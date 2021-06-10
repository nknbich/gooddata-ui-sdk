// (C) 2021 GoodData Corporation
import { loadDashboard } from "../../../../commands";
import { DashboardTester } from "../../../../tests/DashboardTester";
import { DashboardLoaded } from "../../../../events";
import { selectConfig } from "../../../../state/config/configSelectors";
import { selectPermissions } from "../../../../state/permissions/permissionsSelectors";
import { SimpleDashboardIdentifier } from "../../../../tests/Dashboard.fixtures";

describe("load dashboard handler", () => {
    it("should emit event for the loaded dashboard", async () => {
        const tester = DashboardTester.forRecording(SimpleDashboardIdentifier);

        tester.dispatch(loadDashboard());
        const event: DashboardLoaded = await tester.waitFor("GDC.DASH/EVT.LOADED");

        expect(event.type).toEqual("GDC.DASH/EVT.LOADED");
        expect(event.payload.dashboard.identifier).toEqual(SimpleDashboardIdentifier);
    });

    it("should resolve config if empty config provided", async () => {
        const tester = DashboardTester.forRecording(SimpleDashboardIdentifier);

        tester.dispatch(loadDashboard());
        await tester.waitFor("GDC.DASH/EVT.LOADED");

        const config = selectConfig(tester.state());

        expect(config).toMatchSnapshot({
            dateFilterConfig: {
                absoluteForm: {
                    from: expect.any(String),
                    to: expect.any(String),
                },
            },
        });
    });

    it("should resolve permissions if none provided", async () => {
        const tester = DashboardTester.forRecording(SimpleDashboardIdentifier);

        tester.dispatch(loadDashboard());
        await tester.waitFor("GDC.DASH/EVT.LOADED");

        const permissions = selectPermissions(tester.state());

        expect(permissions).toMatchSnapshot();
    });

    it("should emit events in correct order and carry-over correlationId", async () => {
        const tester = DashboardTester.forRecording(SimpleDashboardIdentifier);

        tester.dispatch(loadDashboard(undefined, undefined, "testCorrelation"));
        await tester.waitFor("GDC.DASH/EVT.LOADED");

        expect(tester.emittedEventsDigest()).toMatchSnapshot();
    });
});
