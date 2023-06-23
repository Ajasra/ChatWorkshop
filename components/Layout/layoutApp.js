import Head from "next/head";
import { Container } from "@mantine/core";
import styles from "styles/styles/Home.module.css";

export default function LayoutApp({ children }) {
  return (
    <>
      <Head>
        <title>Virtual Assistant</title>
        <meta name="description" content="Virtual assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className={`${styles.main}`}>
        {children}
      </Container>
    </>
  );
}
