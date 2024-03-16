// (C) 2023 GoodData Corporation
import React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";

import ConfigSection from "../ConfigSection.js";
import { messages } from "../../../../locales.js";
import { IVisualizationProperties } from "../../../interfaces/Visualization.js";
import CheckboxControl from "../CheckboxControl.js";

export interface IInteractionsSectionProps {
    controlsDisabled: boolean;
    properties: IVisualizationProperties;
    propertiesMeta: any;
    pushData: (data: any) => any;
    InteractionsDetailRenderer?: () => React.ReactNode;
}

const InteractionsSection: React.FC<IInteractionsSectionProps & WrappedComponentProps> = (props) => {
    const { controlsDisabled, properties, propertiesMeta, pushData, InteractionsDetailRenderer } = props;
    const isDrillDownDisabled = properties?.controls?.disableDrillDown ?? false;

    return (
        <ConfigSection
            id="interactions_section"
            className="gd-interactions-section"
            title={messages.interactions.id}
            propertiesMeta={propertiesMeta}
            pushData={pushData}
        >
            <CheckboxControl
                valuePath="disableDrillDown"
                labelText={messages.interactionsDrillDown.id}
                properties={properties}
                disabled={controlsDisabled}
                checked={!isDrillDownDisabled}
                pushData={pushData}
                isValueInverted={true}
            />
            {InteractionsDetailRenderer ? InteractionsDetailRenderer() : null}
        </ConfigSection>
    );
};

export default injectIntl(React.memo(InteractionsSection));
