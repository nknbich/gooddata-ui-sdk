// (C) 2023-2024 GoodData Corporation
import React from "react";
import Markdown from "react-markdown";
import cx from "classnames";

const RICH_TEXT_PLACEHOLDER = `Add markdown text here...\n
# Heading 1
**Bold**
* List
[link](http://thisisalink.com)
![image](http://url/img.png)
`;

interface IRichTextProps {
    text: string;
    onChange?: (text: string) => void;
    editMode?: boolean;
    editPlaceholder?: string;
    emptyElement?: JSX.Element;
}

export const RichText: React.FC<IRichTextProps> = ({
    text,
    onChange,
    editMode = false,
    editPlaceholder,
    emptyElement,
}) => {
    return (
        <div
            className={cx([
                "gd-rich-text-content",
                `gd-rich-text-content-${editMode ? "edit" : "view"}`,
                "s-rich-text",
                `s-rich-text-${editMode ? "edit" : "view"}`,
                { "gd-visible-scrollbar": !editMode },
            ])}
        >
            {editMode ? (
                <RichTextEdit
                    text={text}
                    onChange={(updatedText) => onChange?.(updatedText)}
                    placeholder={editPlaceholder}
                />
            ) : (
                <RichTextView text={text} emptyElement={emptyElement} />
            )}
        </div>
    );
};

interface IRichTextEditProps {
    text: string;
    onChange: (text: string) => void;
    placeholder?: string;
    rows?: number;
}

const RichTextEdit: React.FC<IRichTextEditProps> = ({
    text,
    onChange,
    placeholder = RICH_TEXT_PLACEHOLDER,
    rows = 10,
}) => {
    const moveCaretToEnd = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        const position = value.length;
        event.target.setSelectionRange(position, position);
    };

    return (
        <textarea
            className="gd-visible-scrollbar"
            value={text}
            autoFocus
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            rows={rows}
            onFocus={moveCaretToEnd}
        />
    );
};

interface IRichTextViewProps {
    text: string;
    emptyElement?: JSX.Element;
}

const ImageComponent = (props: any) => <img style={{ maxWidth: "100%" }} {...props} />;

const AnchorComponent = (props: any) => <a target="_blank" rel="noopener noreferrer" {...props} />;

const RichTextView: React.FC<IRichTextViewProps> = ({ text, emptyElement }) => {
    // Strip all whitespace and newlines
    const isTextEmpty = !text?.replace(/\s/g, "");

    if (isTextEmpty && emptyElement) {
        return <div className="gd-rich-text-content-empty">{emptyElement}</div>;
    }

    return <Markdown components={{ img: ImageComponent, a: AnchorComponent }}>{text}</Markdown>;
};
