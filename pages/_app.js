import "styles/styles/globals.css";
import RootStyleRegistry from "components/Layout/emotion";
import { ChatProvider } from "components/Context/context";

export default function App({ Component, pageProps }) {
  return (
    <RootStyleRegistry>
      <ChatProvider>
        <Component {...pageProps} />
      </ChatProvider>
    </RootStyleRegistry>
  );
}
