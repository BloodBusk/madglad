import Header from "./components/header.jsx";
import FooterNav from "./components/footerNav.jsx";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getLoggedUser, requireUserSession } from "~/session.server";
import connectDb from "~/db/connectDb.server";


export const loader = async ({ request }) => {
  const userId = await getLoggedUser(request);
  const db = await connectDb();
  
  return {userId};
};

export default function Index() {
  const {userId} = useLoaderData();
  console.log(userId);
  return (
    <div>
      <Header />
      <Link to="/services/logout">Logout</Link>
      <p>{userId}</p>
      <FooterNav profile={userId} />
    </div>
  );
}
