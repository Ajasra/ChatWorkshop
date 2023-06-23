import Head from "next/head";
import {
  AppShell,
  Container,
  Header,
  Navbar,
  useMantineTheme,
} from "@mantine/core";
import styles from "styles/styles/Home.module.css";
import Navigation from "components/Layout/navbar";
import { useState } from "react";
import AppHeader from "components/Layout/header";

export default function LayoutApp({ children }) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Head>
        <title>Virtual Assistant</title>
        <meta name="description" content="Virtual assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        navbarOffsetBreakpoint="md"
        navbar={<Navigation opened={opened} setOpened={setOpened} />}
        header={<AppHeader opened={opened} setOpened={setOpened} />}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <Container className={`${styles.main}`}>{children}</Container>
      </AppShell>
    </>
  );
}
