import "styles/styles/globals.css";
import RootStyleRegistry from "components/Layout/emotion";

export default function App({ Component, pageProps }) {
  return (
    <RootStyleRegistry>
      <Component {...pageProps} />
    </RootStyleRegistry>
  );
}
