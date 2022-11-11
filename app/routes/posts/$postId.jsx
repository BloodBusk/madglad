import { useLoaderData } from "@remix-run/react";
import React from "react";
import connectDb from "~/db/connectDb.server";
import { findPostById } from "~/db/dbF";

export async function loader({ params }) {
  const db = await connectDb();
  const post = await findPostById(db, params.postId);
  return post;
}

export async function action({ request }) {
    return null;
  }



export default function PostId() {
  const post = useLoaderData();
  console.log(post);
  return (
    <>
      <div>{post.title}</div>
    </>
  );
}
