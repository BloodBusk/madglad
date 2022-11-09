import Header from "./components/header.jsx";
import FooterNav from "./components/footerNav.jsx";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getLoggedUser, requireUserSession } from "~/session.server";
import connectDb from "~/db/connectDb.server";
import {findUserById, findProfileByUser} from "~/db/dbF";


export const loader = async ({ request }) => {
  await requireUserSession(request);
  const userId = await getLoggedUser(request);
  const db = await connectDb();
  const user = await findUserById(db, userId);
  const profile = await findProfileByUser(db, user);
  return { profile, user };
};

export default function Index() {
  const {profile, user} = useLoaderData();
  return (
    <div>
      <Header  profile={profile} />
      <p>{user.username}</p>
      <Outlet />
      <FooterNav user={user._id} />
    </div>
  );
}
