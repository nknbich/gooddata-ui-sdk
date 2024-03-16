// (C) 2021-2022 GoodData Corporation

export type CustomizerMutationsContext = {
    insight: CustomizerMutationsType[];
    kpi: CustomizerMutationsType[];
    attributeFilter: CustomizerMutationsType[];
    dashboardContent: CustomizerMutationsType[];
    layouts: Record<string, CustomizerMutationsType>;
};

export type CustomizerMutationsType = "tag" | "provider" | "body" | "decorator" | "inserted";

export function createCustomizerMutationsContext(): CustomizerMutationsContext {
    return {
        insight: [],
        kpi: [],
        attributeFilter: [],
        dashboardContent: [],
        layouts: {},
    };
}
