import { TextInput, TextInputProps } from "@mantine/core";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

interface EditableTextProps extends TextInputProps {
  value: string;
  onEnter: (id: string, value: string) => Promise<void>;
  label: string;
  rowId: string;
}

export default function EditableText({
  value,
  onEnter,
  label,
  rowId,
  ...props
}: EditableTextProps) {
  const [text, setText] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  async function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      flushSync(() => {
        setText(() => null);
      });
      ref.current?.blur();
    }
    if (e.key === "Enter") {
      if (text) {
        await onEnter(rowId, text);
        flushSync(() => {
          setText(() => null);
        });
      }

      ref.current?.blur();
    }
  }

  async function onBlur(_: React.FocusEvent<HTMLInputElement>) {
    if (text != null && text !== value) {
      await onEnter(rowId, text);
    }
  }

  return (
    <>
      <TextInput
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
