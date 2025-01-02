import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link 
          rel="stylesheet" 
          href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css"
        />
        <link rel="icon" href="/favicon1.ico" type="image/x-icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"
          async
        ></script>
      </body>
    </Html>
  );
}
