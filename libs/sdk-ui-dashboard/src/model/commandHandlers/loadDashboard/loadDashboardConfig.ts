// (C) 2021 GoodData Corporation
import {
    DashboardConfig,
    DashboardContext,
    isResolvedConfig,
    ResolvedDashboardConfig,
} from "../../types/commonTypes";
import {
    IDateFilterConfigsQueryResult,
    ISeparators,
    ISettings,
    IUserWorkspaceSettings,
} from "@gooddata/sdk-backend-spi";
import { LoadDashboard } from "../../commands/dashboard";
import { all, call } from "redux-saga/effects";
import { dateFilterValidationFailed } from "../../events/dashboard";
import { defaultDateFilterConfig } from "../../_staging/dateFilterConfig/defaultConfig";
import { eventDispatcher } from "../../eventEmitter/eventDispatcher";
import { IColorPalette } from "@gooddata/sdk-model";
import { PromiseFnReturnType } from "../../types/sagas";
import { ILocale } from "@gooddata/sdk-ui";
import { getValidDateFilterConfig } from "../../_staging/dateFilterConfig/validation";
import { stripUserAndWorkspaceProps } from "../../_staging/settings/conversion";

function loadDateFilterConfig(ctx: DashboardContext): Promise<IDateFilterConfigsQueryResult | undefined> {
    const { backend, workspace } = ctx;

    return backend
        .workspace(workspace)
        .dateFilterConfigs()
        .withLimit(1)
        .query()
        .catch((_) => {
            // TODO: add log
            return undefined;
        });
}

function loadSettingsForCurrentUser(ctx: DashboardContext): Promise<IUserWorkspaceSettings> {
    const { backend, workspace } = ctx;

    return backend.workspace(workspace).settings().getSettingsForCurrentUser();
}

function loadColorPalette(ctx: DashboardContext): Promise<IColorPalette> {
    const { backend, workspace } = ctx;

    return backend.workspace(workspace).styling().getColorPalette();
}

function* resolveDateFilterConfig(ctx: DashboardContext, config: DashboardConfig, cmd: LoadDashboard) {
    if (config.dateFilterConfig !== undefined) {
        return config.dateFilterConfig;
    }

    const result: PromiseFnReturnType<typeof loadDateFilterConfig> = yield call(loadDateFilterConfig, ctx);

    if ((result?.totalCount ?? 0) > 1) {
        yield call(eventDispatcher, dateFilterValidationFailed(ctx, "TOO_MANY_CONFIGS", cmd.correlationId));
    }

    const firstConfig = result?.items[0];

    if (!firstConfig) {
        yield call(eventDispatcher, dateFilterValidationFailed(ctx, "NO_CONFIG", cmd.correlationId));
    }

    return result?.items[0] ?? defaultDateFilterConfig;
}

type UserSettings = {
    locale: ILocale;
    separators: ISeparators;
    settings: ISettings;
};

function resolveUserSettings(ctx: DashboardContext, config: DashboardConfig): Promise<UserSettings> {
    if (config.settings && config.locale && config.separators) {
        return Promise.resolve({
            locale: config.locale,
            separators: config.separators,
            settings: config.settings,
        });
    }

    return loadSettingsForCurrentUser(ctx).then((res) => ({
        locale: config.locale ?? (res.locale as ILocale),
        separators: config.separators ?? res.separators,
        settings: config.settings ?? stripUserAndWorkspaceProps(res),
    }));
}

function resolveColorPalette(ctx: DashboardContext, config: DashboardConfig): Promise<IColorPalette> {
    if (config.colorPalette) {
        return Promise.resolve(config.colorPalette);
    }

    return loadColorPalette(ctx);
}

/**
 * Loads all essential dashboard configuration from the backend if needed. The load command may specify their
 * own inline config - if that is the case the config is bounced back immediately. Otherwise the necessary
 * backend queries and post-processing is done.
 *
 * @param ctx
 * @param cmd
 */
export function* loadDashboardConfig(ctx: DashboardContext, cmd: LoadDashboard) {
    const {
        payload: { config = {} },
    } = cmd;

    if (isResolvedConfig(config)) {
        /*
         * Config coming in props is fully specified. There is nothing to do. Bail out imediately.
         */
        return config;
    }

    /*
     * Resolve the config values. The resolve* functions will take value from config if it is defined,
     * otherwise they will obtain the config from backend.
     *
     * Note: the user settings include locale, separators and the ISettings that should be in effect
     * for the current user in the context of the workspace.
     */

    const [dateFilterConfig, settings, colorPalette]: [
        PromiseFnReturnType<typeof resolveDateFilterConfig>,
        PromiseFnReturnType<typeof resolveUserSettings>,
        PromiseFnReturnType<typeof resolveColorPalette>,
    ] = yield all([
        call(resolveDateFilterConfig, ctx, config, cmd),
        call(resolveUserSettings, ctx, config),
        call(resolveColorPalette, ctx, config),
    ]);

    const [validDateFilterConfig, configValidation] = getValidDateFilterConfig(dateFilterConfig, settings);

    if (configValidation !== "Valid") {
        yield call(eventDispatcher, dateFilterValidationFailed(ctx, configValidation, cmd.correlationId));
    }

    return {
        locale: settings.locale as ILocale,
        separators: settings.separators,
        dateFilterConfig: validDateFilterConfig,
        settings: settings.settings,
        colorPalette,
    } as ResolvedDashboardConfig;
}
