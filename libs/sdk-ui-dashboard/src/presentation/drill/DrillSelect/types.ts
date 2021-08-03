// (C) 2021 GoodData Corporation
import { DashboardDrillDefinition, DashboardDrillContext, IDashboardDrillEvent } from "../../../types";

/**
 * These types are also used as s-classes for testing e.g. .s-drill-to-dashboard
 */
export enum DrillType {
    DRILL_TO_DASHBOARD = "drill-to-dashboard",
    DRILL_TO_INSIGHT = "drill-to-insight",
    DRILL_TO_URL = "drill-to-url",
    DRILL_DOWN = "drill-down",
}

export interface DrillSelectItem {
    type: DrillType;
    id: string;
    name: string;
    drillDefinition: DashboardDrillDefinition;
    attributeValue?: string;
}

export interface DrillSelectContext {
    drillDefinitions: DashboardDrillDefinition[];
    drillEvent: IDashboardDrillEvent;
    drillContext?: DashboardDrillContext;
    correlationId?: string;
}
