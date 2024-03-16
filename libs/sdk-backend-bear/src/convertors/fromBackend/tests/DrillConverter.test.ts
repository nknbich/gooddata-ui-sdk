// (C) 2021 GoodData Corporation

import { convertDrillOrigin, convertVisualizationWidgetDrill } from "../DashboardConverter/index.js";
import {
    drillFromAttribute,
    drillFromMeasure,
    drillToDashboardWithDrillFromMeasure,
    drillToDashboardWithDrillFromAttribute,
} from "./DrillConverter.fixtures.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as uuid from "uuid";

describe("convert drill", () => {
    beforeEach(() => {
        vi.spyOn(uuid, "v4").mockReturnValue("mocked-uuid");
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("origin", () => {
        it("should convert drill from measure", () => {
            const convertedDrill = convertDrillOrigin(drillFromMeasure);
            expect(convertedDrill).toMatchSnapshot();
        });

        it("should convert drill from attribute", () => {
            const convertedDrill = convertDrillOrigin(drillFromAttribute);
            expect(convertedDrill).toMatchSnapshot();
        });
    });

    describe("definition", () => {
        it("should convert drill to dashboard with drill from measure", () => {
            const convertedDrill = convertVisualizationWidgetDrill(drillToDashboardWithDrillFromMeasure);
            expect(convertedDrill).toMatchSnapshot();
        });

        it("should convert drill to dashboard with drill from attribute", () => {
            const convertedDrill = convertVisualizationWidgetDrill(drillToDashboardWithDrillFromAttribute);
            expect(convertedDrill).toMatchSnapshot();
        });
    });
});
