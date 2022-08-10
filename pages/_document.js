import Document, { Head, Html, Main, NextScript } from "next/document";
import { createGetInitialProps } from "@mantine/next";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <script
            defer
            src="https://shynet.up.railway.app/ingress/59424741-e954-4910-b6e6-ec53e99ba1ee/script.js"
          ></script>
          <noscript>
            <img src="https://shynet.up.railway.app/ingress/59424741-e954-4910-b6e6-ec53e99ba1ee/pixel.gif" />
          </noscript>
        </body>
      </Html>
    );
  }
}
