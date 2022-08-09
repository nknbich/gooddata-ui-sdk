// (C) 2022 GoodData Corporation
import React from "react";
import cx from "classnames";
import { getDropZoneDebugStyle } from "../debug";
import {
    selectSettings,
    useDashboardDispatch,
    useDashboardSelector,
    uiActions,
    selectWidgetPlaceholder,
    IWidgetPlaceholderSpec,
} from "../../../model";
import stringify from "json-stable-stringify";
import { useDashboardDrop } from "../useDashboardDrop";
import { isInsightDraggableListItem, isKpiPlaceholderDraggableItem } from "../types";
import { getSizeInfo } from "../../../_staging/layout/sizing";
import { useKpiPlaceholderDropHandler } from "./useKpiPlaceholderDropHandler";
import { useInsightPlaceholderDropHandler } from "./useInsightPlaceholderDropHandler";

interface IHotspotProps {
    sectionIndex: number;
    itemIndex: number;
    classNames?: string;
    dropZoneType: "prev" | "next";
}

export const Hotspot: React.FC<IHotspotProps> = (props) => {
    const { itemIndex, sectionIndex, classNames, dropZoneType } = props;

    const dispatch = useDashboardDispatch();
    const settings = useDashboardSelector(selectSettings);
    const widgetPlaceholder = useDashboardSelector(selectWidgetPlaceholder);

    // for "next" we need to add the item after the current index, for "prev" on the current one
    const targetItemIndex = dropZoneType === "next" ? itemIndex + 1 : itemIndex;

    const handleInsightPlaceholderDrop = useInsightPlaceholderDropHandler();
    const handleKpiPlaceholderDrop = useKpiPlaceholderDropHandler();

    const [{ canDrop, isOver }, dropRef] = useDashboardDrop(
        ["insightListItem", "kpi-placeholder"],
        {
            drop: (item) => {
                if (isInsightDraggableListItem(item)) {
                    handleInsightPlaceholderDrop(sectionIndex, targetItemIndex, item.insight);
                }
                if (isKpiPlaceholderDraggableItem(item)) {
                    handleKpiPlaceholderDrop(sectionIndex, targetItemIndex);
                }
            },
            hover: (item) => {
                if (isInsightDraggableListItem(item)) {
                    const { insight } = item;
                    const sizeInfo = getSizeInfo(settings, "insight", insight);
                    const placeholderSpec: IWidgetPlaceholderSpec = {
                        itemIndex: targetItemIndex,
                        sectionIndex,
                        size: {
                            height: sizeInfo.height.default!,
                            width: sizeInfo.width.default!,
                        },
                        type: "widget",
                    };
                    if (stringify(placeholderSpec) !== stringify(widgetPlaceholder)) {
                        dispatch(uiActions.setWidgetPlaceholder(placeholderSpec));
                    }
                }
                if (isKpiPlaceholderDraggableItem(item)) {
                    const sizeInfo = getSizeInfo(settings, "kpi");
                    const placeholderSpec: IWidgetPlaceholderSpec = {
                        itemIndex: targetItemIndex,
                        sectionIndex,
                        size: {
                            height: sizeInfo.height.default!,
                            width: sizeInfo.width.default!,
                        },
                        type: "widget",
                    };
                    if (stringify(placeholderSpec) !== stringify(widgetPlaceholder)) {
                        dispatch(uiActions.setWidgetPlaceholder(placeholderSpec));
                    }
                }
            },
        },
        [
            dispatch,
            widgetPlaceholder,
            settings,
            targetItemIndex,
            sectionIndex,
            handleKpiPlaceholderDrop,
            handleInsightPlaceholderDrop,
        ],
    );

    const debugStyle = getDropZoneDebugStyle({ isOver });

    return (
        <div
            className={cx(classNames, "dropzone", dropZoneType, { hidden: !canDrop })}
            style={debugStyle}
            ref={dropRef}
        />
    );
};
