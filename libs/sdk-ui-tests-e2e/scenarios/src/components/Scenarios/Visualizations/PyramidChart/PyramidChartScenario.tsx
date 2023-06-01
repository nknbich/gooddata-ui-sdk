// (C) 2007-2023 GoodData Corporation
import React from "react";
import { PyramidChart } from "@gooddata/sdk-ui-charts";
import {
    Amount,
    StageName,
} from "../../../../../../reference_workspace/workspace_objects/goodsales/current_reference_workspace_objects_tiger";

const style = { height: 300 };

export const PyramidChartScenario: React.FC = () => {
    return (
        <div style={style} className="s-pyramid-chart">
            <PyramidChart measures={[Amount]} viewBy={StageName.Default} />
        </div>
    );
};
