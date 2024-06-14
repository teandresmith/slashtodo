import { useQuery } from "@apollo/client";
import {
  AppShell,
  Box,
  Burger,
  Button,
  Center,
  Combobox,
  ComboboxStringItem,
  Group,
  Modal,
  NavLink,
  Pill,
  TextInput,
  Title,
  useCombobox,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaSearch } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { GET_TODO_NAMES } from "../gql/gql";
import { useEffect, useState } from "react";

function Root() {
  const [opened, { open, close }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  window.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      !(
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
    ) {
      open();
    }
  });

  return (
    <>
      <AppShell
        navbar={{
          width: 250,
          breakpoint: "sm",
          collapsed: { mobile: true, desktop: !desktopOpened },
        }}
        padding="md"
        header={{ height: 60 }}
      >
        <AppShell.Navbar p="md">
          <NavLink component={Link} to="/" label="Home" />
          <NavLink component={Link} to="/calendar" label="Calendar" />
        </AppShell.Navbar>
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Box>
              <Center>
                <Burger
                  opened={desktopOpened}
                  onClick={toggleDesktop}
                  visibleFrom="sm"
                  size="sm"
                />
                <Button
                  component={Link}
                  to={"/"}
                  variant="transparent"
                  color="gray"
                >
                  <Title order={3}>/todo</Title>
                </Button>
              </Center>
            </Box>

            <Link style={{ textDecoration: "none" }} to={"/"}></Link>
            <Box style={{ cursor: "pointer !important" }} onClick={open}>
              <TextInput
                placeholder="Search"
                leftSection={<FaSearch />}
                rightSection={<Pill radius={"sm"}>/</Pill>}
                readOnly
                style={{ cursor: "pointer !important" }}
              />
            </Box>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Box>
            <Outlet />
          </Box>
        </AppShell.Main>
      </AppShell>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <SearchBar onClose={close} />
      </Modal>
    </>
  );
}

interface SearchBarProps {
  onClose: () => void;
}

function SearchBar({ onClose }: SearchBarProps) {
  const navigate = useNavigate();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [searchData, setSearchData] = useState<ComboboxStringItem[]>([]);
  const [searchAction, setSearchAction] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  useQuery(GET_TODO_NAMES, {
    onCompleted(data) {
      const m = new Map<string, string>();
      let v: ComboboxStringItem[] = [];
      data.todos.forEach((value) => {
        const options = [
          {
            value: `View or edit todo: ${value.name}`,
            id: value.id,
            link: `/todo/${value.id}`,
          },
        ];

        options.forEach((value) => m.set(value.value, value.link));

        v.push(...options);
      });
      v.sort((a, b) => {
        if (a.value < b.value) {
          return -1;
        } else if (a.value > b.value) {
          return 1;
        }
        return 0;
      });

      const o = [
        {
          value: "Go to home",
          link: `/`,
        },
        {
          value: "Go to calendar",
          link: `/calendar`,
        },
        {
          value: "Create new todo",
          link: `/create`,
        },
      ];
      o.forEach((value) => {
        m.set(value.value, value.link);
      });

      const d = [...o, ...v];

      setSearchData(() => {
        return d;
      });

      setSearchAction(m);
    },
  });

  const [value, setValue] = useState("");
  const shouldFilter = !searchData.some((v) => v.value === value);
  const filtered = shouldFilter
    ? searchData.filter((v) =>
        v.value.toLowerCase().includes(value.toLowerCase().trim())
      )
    : searchData;

  useEffect(() => {
    // we need to wait for options to render before we can select first one
    combobox.selectFirstOption();
  }, [value]);

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        const link = searchAction.get(optionValue);
        onClose();
        navigate(link as string);
        combobox.closeDropdown();
      }}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          aria-label="todo-search"
          placeholder="Search..."
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
          leftSection={<FaSearch />}
          rightSection={<Pill radius={"sm"}>Escape</Pill>}
          rightSectionWidth={75}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {filtered.length === 0 ? (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          ) : (
            filtered.map((value) => (
              <Combobox.Option value={value.value} key={value.value}>
                {value.value}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default Root;
