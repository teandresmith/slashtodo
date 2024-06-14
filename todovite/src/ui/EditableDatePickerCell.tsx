import { Center } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useRef, useState } from "react";

interface EditableDatePickerCellProps {
  value: Date;
  onEnter?: (id: string, value: string) => Promise<void>;
  label: string;
  rowId: string;
}

export default function EditableDatePickerCell({
  value,
  onEnter,
  label,
  rowId,
  ...props
}: EditableDatePickerCellProps) {
  const [date, setDate] = useState<string | null>(null);
  const ref = useRef<HTMLButtonElement>(null);

  // async function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  //   if (e.key === "Escape") {
  //     flushSync(() => {
  //       setText(() => null);
  //     });
  //     ref.current?.blur();
  //   }
  //   if (e.key === "Enter") {
  //     if (text) {
  //       await onEnter(rowId, text);
  //       flushSync(() => {
  //         setText(() => null);
  //       });
  //     }

  //     ref.current?.blur();
  //   }
  // }

  // async function onBlur(_: React.FocusEvent<HTMLInputElement>) {
  //   if (text != null && text !== value) {
  //     await onEnter(rowId, text);
  //   }
  // }

  return (
    <>
      <DatePickerInput
        aria-label={label}
        value={value}
        ref={ref}
        variant="unstyled"
        {...props}
      />
    </>
  );
}
