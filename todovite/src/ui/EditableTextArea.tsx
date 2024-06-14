import { Textarea, TextareaProps } from "@mantine/core";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

interface EditableTextAreaProps extends TextareaProps {
  value: string;
  onEnter: (id: string, value: string) => Promise<void>;
  label: string;
  rowId: string;
}

export default function EditableTextArea({
  value,
  onEnter,
  label,
  rowId,
  ...props
}: EditableTextAreaProps) {
  const [text, setText] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  async function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      flushSync(() => {
        setText(() => null);
      });
      ref.current?.blur();
    }
    if (e.key === "Enter" && !e.shiftKey) {
      ref.current?.blur();
      if (text) {
        await onEnter(rowId, text);
        flushSync(() => {
          setText(() => null);
        });
      }
    }
  }

  async function onBlur(_: React.FocusEvent<HTMLTextAreaElement>) {
    if (text != null && text !== value) {
      await onEnter(rowId, text);
    }
  }

  return (
    <>
      <Textarea
        aria-label={label}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={async (e) => await onKeyDown(e)}
        value={text != null ? text : value}
        onBlur={async (e) => await onBlur(e)}
        variant="unstyled"
        ref={ref}
        {...props}
      />
    </>
  );
}
