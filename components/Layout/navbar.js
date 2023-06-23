import { Navbar, Text, Title } from "@mantine/core";

export default function Navigation(props) {
  const { opened, setOpened } = props;

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="md"
      hidden={!opened}
      width={{ base: 400 }}
    >
      <Title order={2}>Conversations</Title>
    </Navbar>
  );
}
