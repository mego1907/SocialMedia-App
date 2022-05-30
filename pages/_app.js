import "../styles/globals.css";
import Head from "next/head";
import Layout from "../components/Layout";
import store from "../store/store";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <ThemeProvider attribute={"class"}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;
