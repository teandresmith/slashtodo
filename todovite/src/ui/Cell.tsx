import { Box, Table, TableTdProps, Tooltip } from "@mantine/core";
import { useNavigate } from "react-router-dom";

interface CellProps extends TableTdProps {
  value: string;
  link?: string;
  tooltipLabel?: string;
}

export default function Cell({
  value,
  link,
  tooltipLabel,
  ...props
}: CellProps) {
  const navigate = useNavigate();

  return (
    <Table.Td
      onClick={link ? () => navigate(link) : undefined}
      style={{ cursor: link ? "pointer" : "default" }}
      {...props}
    >
      <Tooltip label={tooltipLabel ? tooltipLabel : value}>
        <Box>{value}</Box>
      </Tooltip>
    </Table.Td>
  );
}
