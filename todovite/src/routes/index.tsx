import { TodoTable } from "../ui/TodoTable";
import { Title } from "@mantine/core";

export default function Index() {
  return (
    <>
      <Title order={1} mb={2}>
        Dashboard
      </Title>
      <Title order={3} pb={1}>
        Todos
      </Title>
      <TodoTable />
    </>
  );
}
