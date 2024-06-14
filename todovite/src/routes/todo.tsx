import { useMutation, useQuery } from "@apollo/client";
import { Box, Center, Container, Pill, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import { DELETE_TODO, GET_TODO, GET_TODOS, UPDATE_TODO } from "../gql/gql";
import EditableText from "../ui/EditableText";
import { notifications } from "@mantine/notifications";
import { TodoStatus } from "../__generated__/graphql";
import EditableTextArea from "../ui/EditableTextArea";
import { FaCheck } from "react-icons/fa";

export default function Todo() {
  const { id } = useParams();
  const { data } = useQuery(GET_TODO, {
    variables: {
      id: id!,
    },
  });
  const [updateTodo, { error }] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  async function updateStatus(id: string, status: TodoStatus) {
    await updateTodo({
      variables: {
        updateTodoId: id,
        input: {
          status:
            status === TodoStatus.Closed ? TodoStatus.Open : TodoStatus.Closed,
        },
      },
      refetchQueries: [GET_TODOS],
      awaitRefetchQueries: true,
    });

    if (error) {
      notifications.show({
        id: "update-todo-status",
        title: "Todo status update failed",
        message: "We were unable to update the selected todo task.",
        color: "red",
        withCloseButton: true,
      });
      console.log(error);
      return;
    }
  }

  async function rename(id: string, name: string) {
    if (data?.todo.name === name) return;

    await updateTodo({
      variables: {
        updateTodoId: id,
        input: {
          name: name,
        },
      },
      refetchQueries: [GET_TODOS],
      awaitRefetchQueries: true,
    });

    if (error) {
      notifications.show({
        id: "update-todo-name",
        title: "Failed to rename todo",
        message: "We were unable to update the name of the selected todo",
        color: "red",
        withCloseButton: true,
      });
      console.log(error);
      return;
    }
  }

  async function updateDescription(id: string, description: string | null) {
    if (data?.todo.description === description) return;

    if (typeof description == "string") {
      description = description.trim();
    }

    await updateTodo({
      variables: {
        updateTodoId: id,
        input: {
          description: description,
        },
      },
      refetchQueries: [GET_TODOS],
      awaitRefetchQueries: true,
    });

    if (error) {
      notifications.show({
        id: "update-todo-desscription",
        title: "Failed to update todo's description",
        message:
          "We were unable to update the description of the selected todo",
        color: "red",
        withCloseButton: true,
      });
      console.log(error);
      return;
    }
  }

  async function handleDelete(id: string) {
    await deleteTodo({
      variables: {
        deleteTodoId: id,
      },
      refetchQueries: [GET_TODOS],
      awaitRefetchQueries: true,
    });

    if (error) {
      notifications.show({
        id: "delete-todo-",
        title: "Failed to delete todo",
        message: "We were unable to delete the selected task.",
        color: "red",
        withCloseButton: true,
      });
      console.log(error);
      return;
    }

    notifications.show({
      id: "delete-todo",
      title: "Todo deletion successful",
      message: "We were able to successfully delete the selected task",
      color: "green",
      withCloseButton: true,
    });
  }
  return (
    <Container>
      <Box>
        <EditableText
          value={data?.todo.name || ""}
          label="todo-name"
          rowId={data?.todo.id || ""}
          onEnter={async (id: string, value: string) => {
            await rename(id, value);
          }}
          styles={{
            input: {
              fontSize: "var(--mantine-font-size-xl)",
              fontWeight: "bold",
            },
          }}
        />
        <Center inline>
          <Title order={6} pr={2}>
            Status{" "}
          </Title>
          <FaCheck />
        </Center>

        <EditableTextArea
          value={data?.todo.description || ""}
          placeholder="Add a description..."
          label="todo-description"
          rowId={data?.todo.id || ""}
          onEnter={async (id: string, value: string) => {
            await updateDescription(id, value);
          }}
          size="md"
          autosize
        />
      </Box>
    </Container>
  );
}
