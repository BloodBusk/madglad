import style from "~/styles/global.css";
import style2 from "~/styles/singlePost.css";
import style3 from "~/styles/header.css";
import style4 from "~/styles/footer.css";
import Header from "~/routes/components/header.jsx";
import FooterNav from "~/routes/components/footerNav.jsx";
import { getLoggedUser, requireUserSession } from "~/session.server";
import connectDb from "~/db/connectDb.server";
import { findUserById, findProfileByUser } from "~/db/dbF";
import { redirect } from "@remix-run/node";
const {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
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
  },{
    rel: "stylesheet",
    href: style4,
  },
];

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = async ({ request }) => {
  const userId = await getLoggedUser(request);
  const db = await connectDb();
  const user = (await findUserById(db, userId)) || null;
  const profile = (await findProfileByUser(db, user)) || null;
  if (!userId || !user || !profile) {
    return null;
  }
  return { profile, user };
};

export default function App() {
  const {profile, user} = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {profile === null ? "" : <Header profile={profile} />}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <FooterNav user={user._id} />
      </body>
    </html>
  );
}
