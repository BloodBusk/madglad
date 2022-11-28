import style from "~/styles/global.css";
import style2 from "~/styles/singlePost.css";
import style3 from "~/styles/header.css";
import style4 from "~/styles/footer.css";

const {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} = require("@remix-run/react");

export const links = () => [
  {
    rel: "stylesheet",
    href: style,
  },
  {
    rel: "stylesheet",
    href: style2,
  },
  {
    rel: "stylesheet",
    href: style3,
  },
  {
    rel: "stylesheet",
    href: style4,
  },
];

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
