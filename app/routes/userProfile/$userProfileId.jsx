import React from "react";
import { Link, useLoaderData, Outlet, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession, destroySession } from "~/session.server.js";
import {
  findUserById,
  findProfileByUser,
  findPostsByUser,
  findPostsCountByUser,
} from "~/db/dbF.js";

import facebook from "~/imgs/facebook-f.svg";
import instagram from "~/imgs/instagram.svg";
import twitter from "~/imgs/twitter.svg";
import tiktok from "~/imgs/tiktok.svg";

export async function loader({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const db = await connectDb();
  const user = await findUserById(db, userId);
  const profile = await findProfileByUser(db, user);
  const posts = await findPostsByUser(db, user);
  const postsCount = await findPostsCountByUser(db, user);
  return { profile, user, posts, postsCount };
}

export async function action({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const db = await connectDb();
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  if (_action === "createPost") {
    return redirect(`/userProfile/${userId}/createPost`);
  }
  if (_action === "changeProfileImg") {
    return redirect(`/services/uploadImg`);
  }
}

export default function UserProfileId() {
  const { profile, user, posts, postsCount } = useLoaderData();
  return (
    <div>
      User Id {profile.userId} {user.username}{" "}
      <div>
        <Form method="post">
          <button name="_action" value="createPost" type="submit">
            Create Post
          </button>
        </Form>
        <Form method="post">
          <button name="_action" value="changeProfileImg" type="submit">
            <img
              src={profile.profileImg}
              alt="profile img"
              className="profileImgHeader"
            />
          </button>
        </Form>
        <div>
          <div>
            <p>Posts</p>
            <p>{postsCount}</p>
          </div>
          <div>
            <p>Followers</p>
            <p>{}</p>
          </div>
          <div>
            <p>Following</p>
            <p>{}</p>
          </div>
        </div>
        <div>
          <a href={profile.facebook} target="_blank" rel="noreferrer">
            <img src={facebook} alt="facebook" className="socialIcons" />
          </a>
          <a href={profile.instagram} target="_blank" rel="noreferrer">
            <img src={instagram} alt="instagram" className="socialIcons" />
          </a>
          <a href={profile.twitter} target="_blank" rel="noreferrer">
            <img src={twitter} alt="twitter" className="socialIcons" />
          </a>
          <a href={profile.tiktok} target="_blank" rel="noreferrer">
            <img src={tiktok} alt="tiktok" className="socialIcons" />
          </a>
        </div>
      </div>
    </div>
  );
}
