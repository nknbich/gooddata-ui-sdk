// (C) 2019-2022 GoodData Corporation
import React from "react";
import { render } from "react-dom";
import isEmpty from "lodash/isEmpty";
import { BucketNames, VisualizationTypes } from "@gooddata/sdk-ui";
import { IInsightDefinition, localIdRef, newAttributeAreaSort, newMeasureSort } from "@gooddata/sdk-model";
import { PluggableColumnBarCharts } from "../PluggableColumnBarCharts";
import { IReferencePoint, IVisConstruct } from "../../../interfaces/Visualization";
import { BAR_CHART_SUPPORTED_PROPERTIES } from "../../../constants/supportedProperties";
import BarChartConfigurationPanel from "../../configurationPanels/BarChartConfigurationPanel";
import { AXIS, AXIS_NAME } from "../../../constants/axis";
import { ISortConfig, newMeasureSortSuggestion } from "../../../interfaces/SortConfig";
import { getBucketItems } from "../../../utils/bucketHelper";
import { canSortStackTotalValue } from "./sortHelpers";

/**
 * PluggableBarChart
 *
 * ## Buckets
 *
 * | Name     | Id       | Accepts             |
 * |----------|----------|---------------------|
 * | Measures | measures | measures only       |
 * | ViewBy   | view     | attributes or dates |
 * | StackBy  | stack    | attributes or dates |
 *
 * ### Bucket axioms
 *
 * - |ViewBy| ≤ 2
 * - |StackBy| ≤ 1
 * - |StackBy| = 1 ⇒ |Measures| ≤ 1
 * - |StackBy| = 0 ⇒ |Measures| ≤ 20
 * - |Measures| ≥ 2 ⇒ |StackBy| = 0
 * - ∀ a, b ∈ ViewBy (isDate(a) ∧ isDate(b) ⇒ dateDataset(a) = dateDataset(b))
 *
 * ## Dimensions
 *
 * The PluggableBarChart always creates two dimensional execution.
 *
 * - |StackBy| != 0 ⇒ [[StackBy[0]], [...ViewBy, MeasureGroupIdentifier]]
 * - |StackBy| = 0 ⇒ [[MeasureGroupIdentifier], [...ViewBy]]
 *
 * ## Default sorts
 *
 * There are four different sort set ups:
 *
 * - |ViewBy| = 2 ∧ |Measures| ≥ 2 ∧ ¬stackMeasures ⇒ [attributeAreaSort(ViewBy[0]), measureSort(Measures[0])]
 * - |ViewBy| = 2 ∧ ¬(|Measures| ≥ 2 ∧ ¬stackMeasures) ⇒ [attributeAreaSort(ViewBy[0]), attributeAreaSort(ViewBy[1])]
 * - |ViewBy| = 1 ∧ (|StackBy| = 1 ∨ stackMeasures) ⇒ [attributeAreaSort(ViewBy[0])]
 * - |ViewBy| = 1 ∧ ¬(|StackBy| = 1 ∨ stackMeasures) ∧ |Measures| ≥ 1 ⇒ [measureSort(Measures[0])]
 *
 * In any other case the sorts are not used.
 *
 * If "enableChartsSorting" is enabled, the sorts can be changed by the user.
 */
export class PluggableBarChart extends PluggableColumnBarCharts {
    constructor(props: IVisConstruct) {
        super(props);
        this.secondaryAxis = AXIS_NAME.SECONDARY_X;
        this.type = VisualizationTypes.BAR;
        this.defaultControlsProperties = {
            stackMeasures: false,
        };
        this.initializeProperties(props.visualizationProperties);
    }

    public getSupportedPropertiesList(): string[] {
        return BAR_CHART_SUPPORTED_PROPERTIES[this.axis || AXIS.DUAL] || [];
    }

    protected renderConfigurationPanel(insight: IInsightDefinition): void {
        if (document.querySelector(this.configPanelElement)) {
            render(
                <BarChartConfigurationPanel
                    locale={this.locale}
                    colors={this.colors}
                    references={this.references}
                    properties={this.visualizationProperties}
                    propertiesMeta={this.propertiesMeta}
                    insight={insight}
                    pushData={this.handlePushData}
                    type={this.type}
                    isError={this.getIsError()}
                    isLoading={this.isLoading}
                    featureFlags={this.featureFlags}
                    axis={this.axis}
                />,
                document.querySelector(this.configPanelElement),
            );
        }
    }

    protected getDefaultAndAvailableSort(
        referencePoint: IReferencePoint,
        canSortStackTotalValue: boolean,
    ): {
        currentSort: ISortConfig["currentSort"];
        availableSorts: ISortConfig["availableSorts"];
    } {
        const { buckets } = referencePoint;
        const measures = getBucketItems(buckets, BucketNames.MEASURES);
        const viewBy = getBucketItems(buckets, BucketNames.VIEW);
        const stackBy = getBucketItems(buckets, BucketNames.STACK);

        if (viewBy.length === 2) {
            if (measures.length >= 2 && !canSortStackTotalValue) {
                return {
                    currentSort: [
                        newAttributeAreaSort(viewBy[0].localIdentifier, "desc"),
                        newMeasureSort(measures[0].localIdentifier, "desc"),
                    ],
                    availableSorts: [
                        {
                            itemId: localIdRef(viewBy[0].localIdentifier),
                            attributeSort: {
                                normalSortEnabled: true,
                                areaSortEnabled: true,
                            },
                        },
                        {
                            itemId: localIdRef(viewBy[1].localIdentifier),
                            attributeSort: {
                                normalSortEnabled: true,
                                areaSortEnabled: true,
                            },
                            metricSorts: [
                                ...measures.map((m) => newMeasureSortSuggestion(m.localIdentifier)),
                            ],
                        },
                    ],
                };
            }

            return {
                currentSort: [
                    newAttributeAreaSort(viewBy[0].localIdentifier, "desc"),
                    newAttributeAreaSort(viewBy[1].localIdentifier, "desc"),
                ],
                availableSorts: [
                    {
                        itemId: localIdRef(viewBy[0].localIdentifier),
                        attributeSort: {
                            normalSortEnabled: true,
                            areaSortEnabled: true,
                        },
                    },
                    {
                        itemId: localIdRef(viewBy[1].localIdentifier),
                        attributeSort: {
                            normalSortEnabled: true,
                            areaSortEnabled: true,
                        },
                        metricSorts: [...measures.map((m) => newMeasureSortSuggestion(m.localIdentifier))],
                    },
                ],
            };
        }

        if (!isEmpty(viewBy) && (!isEmpty(stackBy) || canSortStackTotalValue)) {
            return {
                currentSort: [newAttributeAreaSort(viewBy[0].localIdentifier, "desc")],
                availableSorts: [
                    {
                        itemId: localIdRef(viewBy[0].localIdentifier),
                        attributeSort: {
                            normalSortEnabled: true,
                            areaSortEnabled: true,
                        },
                    },
                ],
            };
        }

        if (!isEmpty(viewBy) && !isEmpty(measures)) {
            return {
                currentSort: [newMeasureSort(measures[0].localIdentifier, "desc")],
                availableSorts: [
                    {
                        itemId: localIdRef(viewBy[0].localIdentifier),
                        attributeSort: {
                            normalSortEnabled: true,
                            areaSortEnabled: false,
                        },
                        metricSorts: [...measures.map((m) => newMeasureSortSuggestion(m.localIdentifier))],
                    },
                ],
            };
        }

        return {
            currentSort: [],
            availableSorts: [],
        };
    }
    public getSortConfig(referencePoint: IReferencePoint): Promise<ISortConfig> {
        const { buckets } = referencePoint;
        const viewBy = getBucketItems(buckets, BucketNames.VIEW);
        const measures = getBucketItems(buckets, BucketNames.MEASURES);
        const disabled = viewBy.length < 1 || measures.length < 1;
        const { currentSort } = this.getDefaultAndAvailableSort(
            referencePoint,
            canSortStackTotalValue(referencePoint.buckets, referencePoint.properties),
        );
        return Promise.resolve({
            supported: true,
            disabled,
            currentSort,
            availableSorts: [],
        });
    }
}
