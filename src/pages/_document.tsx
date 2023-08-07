/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Fri Jul 28 2023 7:55:05 PM
 * File: _document.tsx
 * Description: The document component.
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
        <title>{METADATA.APP_NAME}</title>
      </Head>
      <body>
        <div id="modal-root"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
