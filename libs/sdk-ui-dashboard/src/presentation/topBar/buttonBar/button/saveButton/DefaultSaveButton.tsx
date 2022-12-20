// (C) 2021-2022 GoodData Corporation

import React, { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Bubble, BubbleHoverTrigger, Button } from "@gooddata/sdk-ui-kit";
import noop from "lodash/noop";

import {
    cancelEditRenderMode,
    dispatchAndWaitFor,
    saveDashboard,
    selectEnableAnalyticalDashboardPermissions,
    selectIsDashboardDirty,
    selectIsDashboardSaving,
    selectIsInEditMode,
    useDashboardDispatch,
    useDashboardSelector,
    selectDashboardTitle,
    selectLayoutHasAnalyticalWidgets,
} from "../../../../../model";
import { messages } from "../../../../../locales";
import { selectCanSaveDashboard, selectIsPrivateDashboard } from "../selectors";
import { ISaveButtonProps } from "./types";

/**
 * @internal
 */
export function useSaveButtonProps(): ISaveButtonProps {
    const dispatch = useDashboardDispatch();

    const title = useDashboardSelector(selectDashboardTitle);
    const intl = useIntl();
    const emptyTitle = intl.formatMessage({ id: "untitled" });

    const onSaveClick = useCallback(
        () =>
            dispatchAndWaitFor(
                dispatch,
                // the || is intentional, we want to replace empty string as well
                saveDashboard(title || emptyTitle),
            ).then(() => {
                dispatch(cancelEditRenderMode());
            }),
        [dispatch, emptyTitle, title],
    );

    const isEditing = useDashboardSelector(selectIsInEditMode);
    const isSaving = useDashboardSelector(selectIsDashboardSaving);
    const arePermissionsEnabled = useDashboardSelector(selectEnableAnalyticalDashboardPermissions);
    const isPrivateDashboard = useDashboardSelector(selectIsPrivateDashboard);
    const isEmptyDashboard = !useDashboardSelector(selectLayoutHasAnalyticalWidgets); // we need at least one non-custom widget there
    const canSaveDashboard = useDashboardSelector(selectCanSaveDashboard);
    const isDashboardDirty = useDashboardSelector(selectIsDashboardDirty);

    const isVisible = isEditing;
    const isEnabled = isDashboardDirty && !isEmptyDashboard && canSaveDashboard;

    const buttonValue = arePermissionsEnabled
        ? messages.controlButtonsSaveValue
        : messages.controlButtonsSaveAndPublishValue;

    let buttonTitle = messages.controlButtonsSaveAndPublishTitle;
    if (isPrivateDashboard) {
        buttonTitle = messages.controlButtonsSaveAsPrivateTitle;
    }

    if (!canSaveDashboard) {
        buttonTitle = messages.controlButtonsSaveAndPublishNoChanges;
    }

    if (isEmptyDashboard) {
        buttonTitle = messages.controlButtonsSaveAndPublishEmpty;
    }

    return {
        isVisible,
        isEnabled,
        isSaving,
        buttonValue,
        buttonTitle,
        onSaveClick,
    };
}

/**
 * @internal
 */
export function DefaultSaveButton({
    isVisible,
    isEnabled,
    isSaving,
    buttonTitle,
    buttonValue,
    onSaveClick,
}: ISaveButtonProps) {
    const intl = useIntl();

    if (!isVisible) {
        return null;
    }

    if (isSaving) {
        // While save is in progress, the save button needs to be disabled and show 'Saving...'
        return (
            <Button
                className="gd-button-action s-saving_button"
                value={intl.formatMessage({ id: "controlButtons.saving.value" })}
                disabled
                onClick={noop}
            />
        );
    }

    return (
        <BubbleHoverTrigger>
            <Button
                className="gd-button-action save-publish-button s-save_button"
                value={intl.formatMessage(buttonValue)}
                onClick={onSaveClick}
                disabled={!isEnabled}
            />
            <Bubble
                alignPoints={[{ align: "bc tr" }]}
                arrowOffsets={{ "bc tr": [10, 20] }}
                alignTo={`.save-publish-button`}
            >
                <FormattedMessage {...buttonTitle} />
            </Bubble>
        </BubbleHoverTrigger>
    );
}
