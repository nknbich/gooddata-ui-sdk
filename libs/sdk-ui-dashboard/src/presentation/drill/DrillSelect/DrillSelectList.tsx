// (C) 2019-2022 GoodData Corporation
import React from "react";
import { isCrossFiltering } from "@gooddata/sdk-model";
import partition from "lodash/partition.js";
import { FormattedMessage } from "react-intl";
import { DashboardDrillDefinition, isDrillDownDefinition } from "../../../types.js";
import { DrillSelectListItem } from "./DrillSelectListItem.js";
import { DrillSelectItem } from "./types.js";

export interface DrillSelectListProps {
    items: DrillSelectItem[];
    onSelect: (item: DashboardDrillDefinition) => void;
}

export const DrillSelectList: React.FunctionComponent<DrillSelectListProps> = (props) => {
    const { items } = props;

    const [drillDownAndCrossFilteringItems, drillItems] = partition(items, (item: DrillSelectItem) => {
        return isDrillDownDefinition(item.drillDefinition) || isCrossFiltering(item.drillDefinition);
    });
    const [drillDownItems, crossFilteringItems] = partition(
        drillDownAndCrossFilteringItems,
        (item: DrillSelectItem) => {
            return isDrillDownDefinition(item.drillDefinition);
        },
    );

    const renderItems = (items: DrillSelectItem[]) => {
        return items.map((item) => (
            <DrillSelectListItem key={item.id} item={item} onClick={props.onSelect} />
        ));
    };

    const renderDrillDownItems = (items: DrillSelectItem[]) => {
        if (items?.length > 0) {
            return (
                <>
                    <div className="gd-drill-modal-picker-title">
                        <FormattedMessage id="drill_modal_picker.drill-down" tagName="span" />
                    </div>
                    {renderItems(items)}
                </>
            );
        }
        return null;
    };

    const renderDrillItems = (items: DrillSelectItem[]) => {
        if (items?.length > 0) {
            return (
                <>
                    <div className="gd-drill-modal-picker-title">
                        <FormattedMessage id="drill_modal_picker.drill-into" tagName="span" />
                    </div>
                    {renderItems(items)}
                </>
            );
        }
        return null;
    };

    const renderCrossFilteringItems = (items: DrillSelectItem[]) => {
        if (items?.length > 0) {
            return (
                <>
                    <div className="gd-drill-modal-picker-title">
                        <FormattedMessage id="drill_modal_picker.cross-filter" tagName="span" />
                    </div>
                    {renderItems(items)}
                </>
            );
        }
        return null;
    };

    return (
        <div className="gd-drill-modal-picker-selector-list">
            {renderDrillDownItems(drillDownItems)}
            {renderDrillItems(drillItems)}
            {renderCrossFilteringItems(crossFilteringItems)}
        </div>
    );
};
