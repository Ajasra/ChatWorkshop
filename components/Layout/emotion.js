"use client";

import { CacheProvider } from "@emotion/react";
import {
  useEmotionCache,
  MantineProvider,
  ColorSchemeProvider,
} from "@mantine/core";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";

export default function RootStyleRegistry({ children }) {
  const cache = useEmotionCache();
  cache.compat = true;

  const [colorScheme, setColorScheme] = useState("dark");
  // const toggleColorScheme = (value) =>
  //   setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      {/*<ColorSchemeProvider*/}
      {/*  colorScheme={colorScheme}*/}
      {/*  toggleColorScheme={toggleColorScheme}*/}
      {/*>*/}
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: "dark", primaryColor: "cyan" }}
      >
        {children}
      </MantineProvider>
      {/*</ColorSchemeProvider>*/}
    </CacheProvider>
  );
}
