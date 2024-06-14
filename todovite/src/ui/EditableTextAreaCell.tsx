import { Table, Textarea, TextareaProps, Tooltip } from "@mantine/core";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

interface EditableTextAreaCell extends TextareaProps {
  value: string;
  onEnter: (id: string, value: string) => Promise<void>;
  label: string;
  rowId: string;
}

function truncateText(text: string): string {
  return text.slice(0, 50).trim() + "...";
}

export default function EditableTextAreaCell({
  value,
  onEnter,
  label,
  rowId,
  style,
  ...props
}: EditableTextAreaCell) {
  const [textState, setTextState] = useState<{
    text: string | null;
    truncated: string | null;
  }>({
    text: null,
    truncated: value.length > 50 ? truncateText(value) : null,
  });
  const [disabled, setDisabled] = useState<boolean>(value === "");
  const ref = useRef<HTMLTextAreaElement>(null);

  async function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      flushSync(() => {
        setTextState((prev) => ({ ...prev, text: null }));
      });
      ref.current?.blur();
    }
    if (e.key === "Enter" && !e.shiftKey) {
      ref.current?.blur();
      if (textState.text) {
        await onEnter(rowId, textState.text);
        flushSync(() => {
          setTextState((prev) => ({ ...prev, text: null }));
        });
      }
    }
  }

  async function onBlur(_: React.FocusEvent<HTMLTextAreaElement>) {
    if (textState.text != null && textState.text !== value) {
      await onEnter(rowId, textState.text);
    }
    setDisabled(value === "");
    if (value.length > 50) {
      textState.truncated = truncateText(value);
    }
  }

  return (
    <>
      <Table.Td>
        <Tooltip label={value} disabled={disabled} multiline maw={"40%"}>
          <Textarea
            aria-label={label}
            onChange={(e) => {
              setTextState((prev) => ({ ...prev, text: e.target.value }));
            }}
            onKeyDown={async (e) => await onKeyDown(e)}
            value={
              textState.truncated
                ? textState.truncated
                : textState.text
                ? textState.text
                : value
            }
            onBlur={async (e) => await onBlur(e)}
            variant="unstyled"
            ref={ref}
            onFocus={(_) => {
              setDisabled(true);
              setTextState((prev) => ({ ...prev, truncated: null }));
            }}
            {...props}
          />
        </Tooltip>
      </Table.Td>
    </>
  );
}
