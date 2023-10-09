import "../components/style-fixes.css";
import "../components/styles.css";
import type { AppProps } from "next/app";

// This default export is required in a new `pages/_app.js` file.
export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
