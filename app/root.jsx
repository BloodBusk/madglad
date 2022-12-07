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
  {
    rel: "manifest",
    href: "/site.webmanifest",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon-png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
];

export const meta = () => ({
  charset: "utf-8",
  title: "Mad Glad",
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
