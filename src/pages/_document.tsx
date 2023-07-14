/**
 * Author: Barkah Hadi
 * Description: The document component.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import { Html, Head, Main, NextScript } from "next/document";

import METADATA from "@constants/metadata";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="application-name" content={METADATA.APP_NAME} />
        <meta name="apple-mobile-web-app-title" content={METADATA.APP_NAME} />
        <meta name="description" content={METADATA.APP_DESCRIPTION} />
        <meta content={METADATA.KEYWORDS} name="keywords" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body>
        <div id="modal-root"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
