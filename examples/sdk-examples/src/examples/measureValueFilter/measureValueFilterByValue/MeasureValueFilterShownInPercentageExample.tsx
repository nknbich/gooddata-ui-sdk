// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { PivotTable } from "@gooddata/sdk-ui-pivot";
import { newMeasureValueFilter, IMeasureValueFilter } from "@gooddata/sdk-model";
import { MdExt } from "../../../md";
import { IMeasureValueFilterState } from "./MeasureValueFilterExample";

const measures = [MdExt.FranchisedSales, MdExt.FranchisedSalesWithRatio];

const attributes = [MdExt.LocationName];

const greaterThanFilter = newMeasureValueFilter(MdExt.FranchisedSalesWithRatio, "GREATER_THAN", 7000000);

export class MeasureValueFilterExample extends Component<unknown, IMeasureValueFilterState> {
    state: IMeasureValueFilterState = {
        filters: [],
    };

    public renderPresetButton(
        label: string,
        appliedFilters: IMeasureValueFilter[],
        isActive: boolean,
    ): JSX.Element {
        return (
            <button
                className={`gd-button gd-button-secondary ${isActive ? "is-active" : ""} s-filter-button`}
                onClick={() =>
                    this.setState({
                        filters: appliedFilters,
                    })
                }
            >
                {label}
            </button>
        );
    }

    public render(): React.ReactNode {
        const { filters } = this.state;
        return (
            <div>
                <div>
                    {this.renderPresetButton("All franchise sales", [], filters.length === 0)}
                    {this.renderPresetButton(
                        "Franchise sales greater than 7,000,000 (shown in %)",
                        [greaterThanFilter],
                        filters.length > 0,
                    )}
                </div>
                <hr className="separator" />
                <div style={{ height: 300 }} className="s-pivot-table">
                    <PivotTable measures={measures} rows={attributes} filters={filters} />
                </div>
            </div>
        );
    }
}

export default MeasureValueFilterExample;
