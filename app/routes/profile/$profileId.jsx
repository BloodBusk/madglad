import React from "react";
import { Link, useLoaderData, Outlet, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession, destroySession } from "~/session.server.js";

export async function loader({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const db = await connectDb();
  const user = await db.models.User.findById(userId);
  const profile = await db.models.Profile.findOne({ userId: user._id });
  return { profile, user };
}

export async function action({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const db = await connectDb();
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  if (_action === "createPost") {
    return redirect(`/profile/${userId}/createPost`);
  }
}

export default function ProfileId() {
  const { profile, user } = useLoaderData();
  return (
    <div>
      User Id {profile.userId} {user.username}{" "}
      <div>
        <Form method="post">
          <button name="_action" value="createPost" type="submit">
            Create Post
          </button>
        </Form>
      </div>
    </div>
  );
}
