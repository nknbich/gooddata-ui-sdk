// (C) 2019-2021 GoodData Corporation
/**
 * This package defines APIs for embedding and interfacing with the embedded GoodData applications - Analytical Designer and Dashboards/KPI Dashboards.
 *
 * @remarks
 * You can use this package to manipulate the embedded GoodData applications from your application by sending
 * commands to the embedded GoodData applications and receiving events from them.
 *
 * @packageDocumentation
 */
export {
    EmbeddedGdc,
    EmbeddedAnalyticalDesigner,
    EmbeddedKpiDashboard,
    IObjectMeta,
    IPostMessageContextPayload,
    GdcErrorType,
    GdcEventType,
    GdcMessageEventListener,
    GdcProductName,
    IGdcMessage,
    IGdcMessageEnvelope,
    IGdcMessageEvent,
    IGdcMessageEventListenerConfig,
    CommandFailed,
    CommandFailedData,
    ICommandFailedBody,
    IDrillableItemsCommandBody,
    ISimpleDrillableItemsCommandBody,
    isCommandFailedData,
    getEventType,
} from "./iframe/index.js";
