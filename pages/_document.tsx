import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body css={{ background: "var(--background-color)" }}>
          <Main />
          <div
            id="portal"
            css={{
              display: "flex",
              flexDirection: "column",
              left: "calc(50% - 175px)",
              position: "fixed",
              bottom: "65px",
              zIndex: 10,
              maxWidth: "350px",
              width: "100%",
            }}
          />

          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
