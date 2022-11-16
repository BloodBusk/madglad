import { useLoaderData } from "@remix-run/react";
import React from "react";
import connectDb from "~/db/connectDb.server";
import { findPostById, findProfileById } from "~/db/dbF";

export async function loader({ params }) {
  const db = await connectDb();
  // const post = await findPostById(db, );
  const profile = await findProfileById(db, params.profileId);
  return profile;
}

export async function action({ request }) {
    return null;
  }


export default function ProfileId() {
  const profile = useLoaderData();
  return (
    <div>{profile._id}</div>
  )
}
