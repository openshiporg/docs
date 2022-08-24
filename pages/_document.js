import Document, { Head, Html, Main, NextScript } from "next/document";
import { createGetInitialProps } from "@mantine/next";
import Script from "next/script";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="en">
        <Head>
          <Script
            src="https://stats.openship.org/umami.js"
            data-website-id="8771e503-7249-43f4-a175-0a7a7060ab3f"
            strategy="lazyOnload"
          />
        </Head>
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
