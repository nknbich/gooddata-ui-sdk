// (C) 2019-2021 GoodData Corporation
import { IInsightDefinition } from "@gooddata/sdk-model";
import { VisualizationObjectModelV1 } from "@gooddata/api-client-tiger";
import { cloneWithSanitizedIds } from "../../IdSanitization";
import { fixInsightLegacyElementUris } from "../../fixLegacyElementUris";

export function convertVisualizationObject(
    visualizationObject: VisualizationObjectModelV1.IVisualizationObject,
): IInsightDefinition {
    const convertedInsight: IInsightDefinition = {
        insight: {
            ...visualizationObject.visualizationObject,
            buckets: cloneWithSanitizedIds(visualizationObject.visualizationObject.buckets) ?? [],
            filters: cloneWithSanitizedIds(visualizationObject.visualizationObject.filters) ?? [],
            sorts: cloneWithSanitizedIds(visualizationObject.visualizationObject.sorts) ?? [],
        },
    };

    const insight = fixInsightLegacyElementUris(convertedInsight);

    return insight;
}
