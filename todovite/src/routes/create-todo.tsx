import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Loader,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { CREATE_TODO, GET_TODOS } from "../gql/gql";
import { useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

interface CreateTodoInput {
  name: string;
  description?: string;
  dueDate?: string;
}

export default function CreateTodo() {
  const navigate = useNavigate();
  const [create, { loading, error }] = useMutation(CREATE_TODO);

  const form = useForm<CreateTodoInput>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      description: undefined,
      dueDate: undefined,
    },
  });

  if (loading) return <Loader />;

  async function handleSubmit(input: CreateTodoInput) {
    const variables = {
      name: input.name,
      description: input.description ? input.description : null,
      dueDate: input.dueDate ? dayjs(input.dueDate).toISOString() : null,
    };

    await create({
      variables: {
        input: variables,
      },
      refetchQueries: [GET_TODOS],
    });

    if (error) {
      notifications.show({
        id: "create-todo",
        title: "Todo creation failed",
        message: "We were unable to create the todo with the given values",
        color: "red",
        withCloseButton: true,
      });
      console.log(error);
      return;
    }

    notifications.show({
      id: "create-todo",
      title: "Todo was created",
      message: "Successfully created",
      color: "green",
      withCloseButton: true,
    });
    navigate("/");
  }

  return (
    <>
      <Box maw={"75%"}>
        <Title order={1} mb={3}>
          Create todo
        </Title>
        <Title order={3} mb={3}>
          Please fill out the form below to create a new todo task
        </Title>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Stack gap={"md"}>
            <TextInput
              label="Name"
              description="Desired name for the new todo"
              placeholder="Demo name..."
              required
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
            <Textarea
              label="Description"
              description="Desired description that describes the todo"
              placeholder="Demo description..."
              resize="both"
              autosize
              minRows={4}
              key={form.key("description")}
              {...form.getInputProps("description")}
            />
            <DateTimePicker
              clearable
              label="Expected target date"
              description="Date and time the task is expected to be completed by"
              placeholder="Pick a target date"
              valueFormat="YYYY-MM-DDTHH:mm"
              key={form.key("dueDate")}
              {...form.getInputProps("dueDate")}
            />
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </Box>
    </>
  );
}
