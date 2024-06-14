import {
  Box,
  Center,
  Loader,
  Paper,
  Skeleton,
  Table,
  Tabs,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_TODOS } from "../gql/gql";
import TodoTableRow from "./TodoTableRow";
import { TodoFilter, TodoStatus } from "../__generated__/graphql";

type TodoTableTab =
  | "all"
  | "open"
  | "closed"
  | "archived"
  | "overdue"
  | "deleted";

interface TabInfo {
  value: TodoTableTab;
  label: string;
}

function buildFilter(tab: TodoTableTab): TodoFilter | null {
  switch (tab) {
    case "all":
      return null;
    case "archived":
      return {
        isArchived: true,
      };
    case "closed":
      return {
        status: TodoStatus.Closed,
      };
    case "deleted":
      return {
        isDeleted: true,
      };
    case "open":
      return {
        status: TodoStatus.Open,
      };
    case "overdue": {
      return {
        isOverdue: true,
      };
    }
  }
}

export function TodoTable() {
  const navigate = useNavigate();
  const { loading, data, refetch } = useQuery(GET_TODOS);

  const tabs: TabInfo[] = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "open",
      label: "Open",
    },
    {
      value: "closed",
      label: "Closed",
    },
    {
      value: "archived",
      label: "Archived",
    },
    {
      value: "overdue",
      label: "Overdue",
    },
    {
      value: "deleted",
      label: "Deleted",
    },
  ];

  if (loading)
    return (
      <>
        <Center mih={500}>
          <Loader type="dots" />
        </Center>
      </>
    );

  return (
    <>
      <Paper mt={3}>
        <Tabs defaultValue={"all"} keepMounted={false}>
          <Tabs.List>
            {tabs.map((value, index) => (
              <Tabs.Tab
                value={value.value}
                key={index}
                onClick={async (_) => {
                  const filter = buildFilter(value.value);
                  refetch({ filter });
                }}
              >
                {value.label}
              </Tabs.Tab>
            ))}
            <Tabs.Tab
              onClick={(_) => {
                navigate(`/create`);
              }}
              value="create"
              ml="auto"
            >
              Create new
            </Tabs.Tab>
          </Tabs.List>

          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Due date</Table.Th>
                <Table.Th>Created at</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data &&
                data.todos.map((todo) => (
                  <TodoTableRow key={todo.id} todo={todo} />
                ))}
            </Table.Tbody>
          </Table>
        </Tabs>
      </Paper>
    </>
  );
}
