import "styles/globals.css";
import RootStyleRegistry from "components/Layout/emotion";
import { ChatProvider } from "components/Context/context";
import {Notifications} from "@mantine/notifications";

export default function App({ Component, pageProps }) {
  return (
    <RootStyleRegistry>
      <Notifications limit={5} />
      <ChatProvider>
        <Component {...pageProps} />
      </ChatProvider>
    </RootStyleRegistry>
  );
}
