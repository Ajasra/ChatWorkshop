import {
  Burger,
  Header,
  MediaQuery,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {ColorSchemeToggle} from "components/Buttons/colorToggle";

export default function AppHeader(props) {
  const { opened, setOpened } = props;

  return (
    <Header height={{ base: 70 }} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="md" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            mr="xl"
          />
        </MediaQuery>

        <Title>Virtual assistant</Title>
        {/*<ColorSchemeToggle />*/}
      </div>
    </Header>
  );
}
