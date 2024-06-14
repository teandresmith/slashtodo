import { useState } from "react";
import {
  Calendar as ReactCalendar,
  Event,
  dayjsLocalizer,
  SlotInfo,
} from "react-big-calendar";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TODO, GET_TODOS } from "../gql/gql";
import dayjs from "dayjs";
import { Button, Loader, Modal, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";

const localizer = dayjsLocalizer(dayjs);

interface CreateTodoInput {
  name: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [currentSlot, setCurrentSlot] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [create] = useMutation(CREATE_TODO);

  useQuery(GET_TODOS, {
    onCompleted(data) {
      setEvents(() => {
        const e: Event[] = [];
        data.todos.forEach((value) => {
          if (value.dueDate) {
            const d = dayjs(value.dueDate);
            e.push({
              title: value.name,
              start: d.startOf("minute").toDate(),
              end: d.endOf("minute").toDate(),
            });
          }
        });
        return e;
      });
    },
    notifyOnNetworkStatusChange: true,
  });

  async function createTodo(input: CreateTodoInput) {
    await create({
      variables: {
        input: {
          name: input.name,
          dueDate: currentSlot.start!.toISOString(),
        },
      },
      refetchQueries: [GET_TODOS],
      awaitRefetchQueries: true,
    });
    close();
  }

  function handleSelectSlot({ start, end }: SlotInfo) {
    setCurrentSlot(() => ({ start, end }));
    open();
  }

  const form = useForm<CreateTodoInput>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
    },
  });

  return (
    <>
      <ReactCalendar
        defaultView="week"
        events={events}
        localizer={localizer}
        style={{ height: "100vh" }}
        selectable
        onSelectSlot={handleSelectSlot}
      />
      <Modal opened={opened} onClose={close} title="Create new todo">
        <form onSubmit={form.onSubmit((values) => createTodo(values))}>
          <Stack gap={"lg"}>
            <TextInput
              name="name"
              key={form.key("name")}
              label={"Name"}
              placeholder="Enter todo name..."
              withAsterisk
              required
              {...form.getInputProps("name")}
            />
            <DateTimePicker
              name="dueDate"
              label="Due date"
              defaultValue={currentSlot.start}
              valueFormat="YYYY-MM-DDTHH:mm:ssZ"
              disabled
            />
            <Button type="submit">Create</Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
