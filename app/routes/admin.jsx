import React from "react";
import Header from "./components/header.jsx";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getLoggedUser, requireUserSession } from "~/session.server";
import connectDb from "~/db/connectDb.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const db = await connectDb();

  const user = await db.models.User.find();
  const profile = await db.models.Profile.find();
  const post = await db.models.Post.find();

  const userCount = await db.models.User.find().count();
  const profileCount = await db.models.Profile.find().count();
  const postCount = await db.models.Post.find().count();

  return { user, profile, post, userCount, profileCount, postCount };
};

export const action = async ({ request }) => {
  const db = await connectDb();
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  if (_action === "deleteAll") {
    await db.models.User.deleteMany({});
    await db.models.Profile.deleteMany({});
    await db.models.Post.deleteMany({});
    return redirect("/admin");
  }
};

export default function Admin() {
  const { user, profile, post, userCount, profileCount, postCount } =
    useLoaderData();
  return (
    <div>
      <h1>Admin</h1>
      <p>
        users: {userCount}, profiles: {profileCount}, posts: {postCount}{" "}
      </p>
      <div>
        {user.map((u) => {
          return (
            <div key={u._id}>
              <p>{u.username}</p>
            </div>
          );
        })}
      </div>
      <div>
        <Form method="post">
          <button type="submit" name="_action" value="deleteAll">
            Delete All
          </button>
        </Form>
      </div>
    </div>
  );
}
