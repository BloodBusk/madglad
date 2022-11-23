import React, { useState } from "react";
import { useLoaderData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession} from "~/session.server.js";
import {
  findUserById,
  findProfileByUser,
  findPostsCountByProfile,
} from "~/db/dbF.js";

import facebook from "~/imgs/facebook-f.svg";
import instagram from "~/imgs/instagram.svg";
import twitter from "~/imgs/twitter.svg";
import tiktok from "~/imgs/tiktok.svg";

import SinglePost from "../components/singlePost";

export async function loader({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const db = await connectDb();
  const user = await findUserById(db, userId);
  const profile = await findProfileByUser(db, user);
  const posts = await db.models.Post.find({ profileId: profile._id }).populate(
    "profileId"
  );
  const postsCount = await findPostsCountByProfile(db, profile);
  return { profile, user, posts, postsCount };
}

export async function action({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const db = await connectDb();
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  let hiddenPostId = formData.get("hiddenPostId");

  if (_action === "createPost") {
    return redirect(`/userProfile/${userId}/createPost`);
  }
  if (_action === "changeProfileImg") {
    return redirect(`/services/uploadImg`);
  }
  if (_action === "deletePost") {
    try {
      await db.models.Post.deleteOne({ _id: hiddenPostId });
      return redirect(`/userProfile/${userId}`);
    } catch (err) {
      return json({
        deletePostErrorMessage: "something went wrong deleting the post",
      });
    }
  }
}

export default function UserProfileId() {
  const { profile, user, posts, postsCount } = useLoaderData();
  const [showSettings, setShowSettings] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const showPostSettings = () => {
    setShowSettings((showSettings) => !showSettings);
  };

  const showDeleteOptions = () => {
    setShowDelete((showDelete) => !showDelete);
  };

  const handleDeleteNo = () => {
    setShowDelete(false);
    setShowSettings(false);
  };

  return (
    <div>
      User Id {profile.userId} {profile.username}{" "}
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
        <p>
          {profile.username} {profile.isVerified ? "true" : "false"}
        </p>
        <div>
          <div>
            <p>Posts</p>
            <p>{postsCount}</p>
          </div>
          <div>
            <p>Followers</p>
            <p>{profile.followers.length}</p>
          </div>
          <div>
            <p>Following</p>
            <p>{profile.following.length}</p>
          </div>
        </div>
        <div>
          {profile.facebook !== "" ? (
            <a href={profile.facebook} target="_blank" rel="noreferrer">
              <img src={facebook} alt="facebook" className="socialIcons" />
            </a>
          ) : (
            ""
          )}
          {profile.instagram !== "" ? (
            <a href={profile.instagram} target="_blank" rel="noreferrer">
              <img src={instagram} alt="instagram" className="socialIcons" />
            </a>
          ) : (
            ""
          )}
          {profile.twitter !== "" ? (
            <a href={profile.twitter} target="_blank" rel="noreferrer">
              <img src={twitter} alt="twitter" className="socialIcons" />
            </a>
          ) : (
            ""
          )}
          {profile.tiktok !== "" ? (
            <a href={profile.tiktok} target="_blank" rel="noreferrer">
              <img src={tiktok} alt="tiktok" className="socialIcons" />
            </a>
          ) : (
            ""
          )}
        </div>
      </div>
      <div>
        {posts.map((p) => {
          return (
            <div key={p._id}>
              <button type="button" onClick={showPostSettings}>
                | | |
              </button>
              {showSettings ? (
                <>
                  <button type="button">Edit</button>
                  <button type="button" onClick={showDeleteOptions}>
                    Delete
                  </button>
                  {showDelete ? (
                    <>
                      <Form method="post">
                        <label>Are you Sure you want to Delete?</label>
                        <input
                          type="hidden"
                          name="hiddenPostId"
                          defaultValue={p._id}
                        />
                        <button type="submit" name="_action" value="deletePost">
                          Yes
                        </button>
                      </Form>
                      <button type="button" onClick={handleDeleteNo}>
                        No
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
              <SinglePost post={p} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
