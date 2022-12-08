// (C) 2021-2022 GoodData Corporation
import { SagaIterator } from "redux-saga";
import { call, put, select } from "redux-saga/effects";
import { AddDrillTargets } from "../../commands/drillTargets";
import { DrillTargetsAdded, drillTargetsAdded } from "../../events/drillTargets";
import { drillTargetsActions } from "../../store/drillTargets";
import { DashboardContext } from "../../types/commonTypes";
import { selectWidgetsMap } from "../../store/layout/layoutSelectors";
import { validateExistingInsightWidget } from "../widgets/validation/widgetValidations";
import { selectEnableKPIDashboardDrillFromAttribute } from "../../store/config/configSelectors";
import { availableDrillTargetsValidation } from "./validation/availableDrillTargetsValidation";
import { validateDrills } from "../common/validateDrills";
import { selectIsInEditMode } from "../../store/renderMode/renderModeSelectors";

export function* addDrillTargetsHandler(
    ctx: DashboardContext,
    cmd: AddDrillTargets,
): SagaIterator<DrillTargetsAdded> {
    const {
        payload: { availableDrillTargets },
        correlationId,
    } = cmd;

    const widgets: ReturnType<typeof selectWidgetsMap> = yield select(selectWidgetsMap);
    const enableKPIDashboardDrillFromAttribute: boolean = yield select(
        selectEnableKPIDashboardDrillFromAttribute,
    );

    const insightWidget = validateExistingInsightWidget(widgets, cmd, ctx);
    const drillTarget = availableDrillTargetsValidation(
        availableDrillTargets,
        enableKPIDashboardDrillFromAttribute,
        ctx,
        cmd,
    );

    const { ref, uri, identifier } = insightWidget;

    yield put(
        drillTargetsActions.addDrillTargets({
            identifier: identifier,
            uri: uri,
            ref,
            availableDrillTargets: drillTarget,
        }),
    );

    // in edit mode, we need to remove invalid drills in case the insight in the widget changes its drill targets
    const isInEditMode: ReturnType<typeof selectIsInEditMode> = yield select(selectIsInEditMode);
    if (isInEditMode) {
        yield call(validateDrills, ctx, cmd, [insightWidget]);
    }

    return drillTargetsAdded(ctx, ref, availableDrillTargets, correlationId);
}
