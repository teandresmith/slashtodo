import { Todo, TodoStatus } from "../__generated__/graphql";
import { useMutation } from "@apollo/client";
import { UPDATE_TODO, DELETE_TODO, GET_TODOS } from "../gql/gql";
import { ActionIcon, Checkbox, Menu, rem, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { FaArchive, FaRegTrashAlt } from "react-icons/fa";
import EditableTextCell from "./EditableTextCell";
import EditableTextAreaCell from "./EditableTextAreaCell";
import Cell from "./Cell";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";

interface TodoRowProps {
  todo: Todo;
}

export default function TodoTableRow({ todo }: TodoRowProps) {
  const [updateTodo, { error }] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [checked, setChecked] = useState(todo.status === TodoStatus.Closed);

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
    if (todo.name === name) return;

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
    if (todo.description === description) return;

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

  async function archive(id: string, isArchived: boolean) {
    await updateTodo({
      variables: {
        updateTodoId: id,
        input: {
          isArchived,
        },
      },
      refetchQueries: [GET_TODOS],
      awaitRefetchQueries: true,
    });

    if (error) {
      notifications.show({
        id: "archive-todo",
        title: `Todo was could not be ${
          isArchived ? "archived" : "unarchived"
        }`,
        message: "We were unable to update the selected todo task.",
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
    <>
      <Table.Tr>
        <Cell value={todo.id} link={`/todo/${todo.id}`} miw={250} />
        <EditableTextCell
          value={todo.name}
          label="todo name"
          onEnter={async (id: string, value: string) => {
            await rename(id, value);
          }}
          rowId={todo.id}
        />
        <EditableTextAreaCell
          value={todo.description || ""}
          label="todo description"
          onEnter={async (id: string, value: string) => {
            await updateDescription(id, value);
          }}
          rowId={todo.id}
          style={{ minWidth: 200 }}
          autosize
        />

        <Cell
          value={(todo.dueDate && dayjs(todo.dueDate).toISOString()) || ""}
        />
        <Cell value={dayjs(todo.createdAt).toISOString()} />
        {/* <EditableDatePickerCell
          value={dayjs(todo.createdAt).toDate()}
          rowId={todo.id}
          label="todo-created-at"
        /> */}
        <Table.Td>
          <Checkbox
            name="status"
            checked={checked}
            onChange={async (_) => {
              setChecked((prev) => !prev);
              await updateStatus(
                todo.id,
                checked ? TodoStatus.Closed : TodoStatus.Open
              );
            }}
          />
        </Table.Td>
        <Table.Td>
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="transparent" color="gray">
                <BsThreeDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <FaArchive style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={async () => {
                  await archive(todo.id, !todo.isArchived);
                }}
              >
                {!todo.isArchived ? "Archive" : "Unarchive"}
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={
                  <FaRegTrashAlt style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={async () => {
                  await handleDelete(todo.id);
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
    </>
  );
}
