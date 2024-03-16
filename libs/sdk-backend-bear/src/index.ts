// (C) 2019-2022 GoodData Corporation
/**
 * This package provides the Analytical Backend implementation for the GoodData platform.
 *
 * @remarks
 * You can use this package to communicate with the GoodData platform in a convenient way without concerning
 * yourself with low-level details. The functionality includes but is not limited to:
 * setting and creating metadata objects, running executions, getting settings, getting available workspaces, and more.
 *
 * For similar package for GoodData Cloud and GoodData.CN, see `@gooddata/sdk-backend-tiger`.
 *
 * @packageDocumentation
 */
import { IAnalyticalBackendConfig, IAnalyticalBackend } from "@gooddata/sdk-backend-spi";
import { BearBackend, BearBackendConfig } from "./backend/index.js";
import {
    FixedLoginAndPasswordAuthProvider,
    ContextDeferredAuthProvider,
    BearAuthProviderBase,
    AnonymousAuthProvider,
} from "./auth.js";

/**
 * Returns function which creates instances of Analytical Backend implementation which works with the 'bear'
 * version of the GoodData platform.
 *
 * @param config - analytical backend configuration, may be omitted and provided later
 * @param implConfig - bear client specific configuration, may be omitted at this point but it cannot be provided later
 * @public
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function bearFactory(config?: IAnalyticalBackendConfig, implConfig?: any): IAnalyticalBackend {
    return new BearBackend(config, implConfig);
}

export {
    BearBackendConfig,
    FixedLoginAndPasswordAuthProvider,
    ContextDeferredAuthProvider,
    BearAuthProviderBase,
    AnonymousAuthProvider,
};

export default bearFactory;

//
// Exports to support legacy state in AD / KD
//

import {
    convertScheduledMail,
    convertWidget,
    convertLayoutSize,
    convertLayoutItemSize,
} from "./convertors/toBackend/DashboardConverter.js";
import { convertInsight, convertInsightDefinition } from "./convertors/toBackend/InsightConverter.js";
import { toAfmExecution } from "./convertors/toBackend/afm/ExecutionConverter.js";

/**
 * @internal
 */
export {
    convertInsightDefinition,
    toAfmExecution,
    convertScheduledMail,
    convertWidget,
    convertLayoutSize,
    convertLayoutItemSize,
};

/**
 * @internal
 */
export { IConvertInsightOptions } from "./convertors/toBackend/FilterConverter.js";

/**
 * Some of the convertors from bear types are exported through this so that they can be used by our
 * applications that were using bear-specific types in their state.
 *
 * All of these exports are marked as internal and can break at any time.
 *
 * @internal
 */
export const BearToBackendConvertors: {
    convertInsight: typeof convertInsight;
    convertInsightDefinition: typeof convertInsightDefinition;
    toAfmExecution: typeof toAfmExecution;
    convertScheduledMail: typeof convertScheduledMail;
    convertWidget: typeof convertWidget;
    convertLayoutSize: typeof convertLayoutSize;
    convertLayoutItemSize: typeof convertLayoutItemSize;
} = {
    convertInsight,
    convertInsightDefinition,
    toAfmExecution,
    convertScheduledMail,
    convertWidget,
    convertLayoutSize,
    convertLayoutItemSize,
};

import { convertVisualization, convertBucket } from "./convertors/fromBackend/VisualizationConverter.js";
import {
    convertReferencesToUris,
    convertUrisToReferences,
} from "./convertors/fromBackend/ReferenceConverter.js";
import { serializeProperties, deserializeProperties } from "./convertors/fromBackend/PropertiesConverter.js";

import {
    convertFilterContext,
    convertFilterContextItem,
    convertFilterReference,
    convertKpiDrill,
    convertVisualizationWidgetDrill,
    convertScheduledMail as convertScheduledMailFromBackend,
    convertDashboardDateFilterConfig,
    convertLayoutSize as convertLayoutSizeFromBackend,
    convertLayoutItemSize as convertLayoutItemSizeFromBackend,
} from "./convertors/fromBackend/DashboardConverter/index.js";

/**
 * @internal
 */
export {
    convertBucket,
    convertVisualization,
    convertReferencesToUris,
    convertFilterContext,
    convertFilterContextItem,
    convertFilterReference,
    convertKpiDrill,
    convertInsight,
    convertVisualizationWidgetDrill,
    convertScheduledMailFromBackend,
    convertDashboardDateFilterConfig,
    convertUrisToReferences,
    serializeProperties,
    deserializeProperties,
    convertLayoutSizeFromBackend,
    convertLayoutItemSizeFromBackend,
};
/**
 * Some of the convertors to bear types are exported through this so that they can be used by our
 * applications that were using bear-specific types in their state.
 *
 * All of these exports are marked as internal and can break at any time.
 *
 * @internal
 */
export const BackendToBearConvertors: {
    convertBucket: typeof convertBucket;
    convertVisualization: typeof convertVisualization;
    convertReferencesToUris: typeof convertReferencesToUris;
    convertFilterContext: typeof convertFilterContext;
    convertFilterContextItem: typeof convertFilterContextItem;
    convertFilterReference: typeof convertFilterReference;
    convertKpiDrill: typeof convertKpiDrill;
    convertInsight: typeof convertInsight;
    convertVisualizationWidgetDrill: typeof convertVisualizationWidgetDrill;
    convertScheduledMail: typeof convertScheduledMailFromBackend;
    convertDashboardDateFilterConfig: typeof convertDashboardDateFilterConfig;
    convertUrisToReferences: typeof convertUrisToReferences;
    serializeProperties: typeof serializeProperties;
    deserializeProperties: typeof deserializeProperties;
    convertLayoutSize: typeof convertLayoutSizeFromBackend;
    convertLayoutItemSize: typeof convertLayoutItemSizeFromBackend;
} = {
    convertBucket,
    convertVisualization,
    convertReferencesToUris,
    convertFilterContext,
    convertFilterContextItem,
    convertFilterReference,
    convertKpiDrill,
    convertInsight,
    convertVisualizationWidgetDrill,
    convertScheduledMail: convertScheduledMailFromBackend,
    convertDashboardDateFilterConfig,
    convertUrisToReferences,
    serializeProperties,
    deserializeProperties,
    convertLayoutSize: convertLayoutSizeFromBackend,
    convertLayoutItemSize: convertLayoutItemSizeFromBackend,
};

export {
    ReferenceConverter,
    IConversionData,
    IdGenerator,
} from "./convertors/fromBackend/ReferenceConverter.js";
