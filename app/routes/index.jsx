import Header from "./components/header.jsx";
import { Link, useLoaderData } from "@remix-run/react";
import { getLoggedUser, requireUserSession } from "~/session.server";
import connectDb from "~/db/connectDb.server";

export const loader = async ({ request }) => {
  const userId = await getLoggedUser(request);
  const db = await connectDb();
  
  return {userId};
};

export default function Index() {
  const {userId} = useLoaderData();
  return (
    <div>
      <Header />
      <Link to="/services/logout">Logout</Link>
      <p>{userId}</p>
    </div>
  );
}
