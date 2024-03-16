// (C) 2019-2024 GoodData Corporation
import React from "react";
import noop from "lodash/noop.js";
import { ChartType, DefaultLocale } from "@gooddata/sdk-ui";
import { IInsightDefinition, insightHasMeasures, ISettings } from "@gooddata/sdk-model";

import {
    IReferences,
    IVisualizationProperties,
    IConfigurationPanelRenderers,
} from "../../interfaces/Visualization.js";
import { IColorConfiguration } from "../../interfaces/Colors.js";
import ColorsSection from "../configurationControls/colors/ColorsSection.js";
import LegendSection from "../configurationControls/legend/LegendSection.js";
import { InternalIntlWrapper } from "../../utils/internalIntlProvider.js";
import { getMeasuresFromMdObject } from "../../utils/bucketHelper.js";
import InteractionsSection from "../configurationControls/interactions/InteractionsSection.js";

export interface IConfigurationPanelContentProps<PanelConfig = any> {
    properties?: IVisualizationProperties;
    references?: IReferences;
    propertiesMeta?: any;
    colors?: IColorConfiguration;
    locale: string;
    type?: ChartType;
    isError?: boolean;
    isLoading?: boolean;
    insight?: IInsightDefinition;
    featureFlags?: ISettings;
    axis?: string;
    pushData?(data: any): void;
    panelConfig?: PanelConfig;
    configurationPanelRenderers?: IConfigurationPanelRenderers;
}

export default abstract class ConfigurationPanelContent<
    T extends IConfigurationPanelContentProps = IConfigurationPanelContentProps,
> extends React.PureComponent<T> {
    public static defaultProps: IConfigurationPanelContentProps = {
        properties: null,
        references: null,
        propertiesMeta: null,
        colors: null,
        locale: DefaultLocale,
        isError: false,
        isLoading: false,
        insight: null,
        pushData: noop,
        featureFlags: {},
        axis: null,
        panelConfig: {},
    };

    protected supportedPropertiesList: string[];

    public render() {
        return (
            <div key={`config-${this.props.type}`}>
                <InternalIntlWrapper locale={this.props.locale}>
                    {this.renderConfigurationPanel()}
                </InternalIntlWrapper>
            </div>
        );
    }

    protected abstract renderConfigurationPanel(): React.ReactNode;

    protected isControlDisabled(): boolean {
        const { insight, isError, isLoading } = this.props;
        return !insight || !insightHasMeasures(insight) || isError || isLoading;
    }

    protected renderColorSection(): React.ReactNode {
        const { properties, propertiesMeta, pushData, colors, featureFlags, references, insight, isLoading } =
            this.props;

        const controlsDisabled = this.isControlDisabled();
        const hasMeasures = getMeasuresFromMdObject(insight).length > 0;

        return (
            <ColorsSection
                properties={properties}
                propertiesMeta={propertiesMeta}
                references={references}
                colors={colors}
                controlsDisabled={controlsDisabled}
                pushData={pushData}
                hasMeasures={hasMeasures}
                showCustomPicker={featureFlags.enableCustomColorPicker as boolean}
                isLoading={isLoading}
            />
        );
    }

    protected renderLegendSection(): React.ReactNode {
        const { properties, propertiesMeta, pushData } = this.props;
        const controlsDisabled = this.isControlDisabled();

        return (
            <LegendSection
                properties={properties}
                propertiesMeta={propertiesMeta}
                controlsDisabled={controlsDisabled}
                pushData={pushData}
            />
        );
    }

    protected renderInteractionsSection(): React.ReactNode {
        const { pushData, properties, propertiesMeta, panelConfig, configurationPanelRenderers } = this.props;

        return panelConfig.supportsAttributeHierarchies ? (
            <InteractionsSection
                controlsDisabled={this.isControlDisabled()}
                properties={properties}
                propertiesMeta={propertiesMeta}
                pushData={pushData}
                InteractionsDetailRenderer={configurationPanelRenderers?.InteractionsDetailRenderer}
            />
        ) : null;
    }
}
