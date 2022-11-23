import { Form, useLoaderData } from "@remix-run/react";
import React from "react";
import connectDb from "~/db/connectDb.server";
import {
  findProfileById,
  findPostsCountByProfile,
  findProfileByUser,
} from "~/db/dbF";
import { getLoggedUser } from "~/session.server";
import facebook from "~/imgs/facebook-f.svg";
import instagram from "~/imgs/instagram.svg";
import twitter from "~/imgs/twitter.svg";
import tiktok from "~/imgs/tiktok.svg";

import SinglePost from "../components/singlePost";

export async function loader({ params }) {
  const db = await connectDb();
  const profile = await findProfileById(db, params.profileId);
  const postsCount = await findPostsCountByProfile(db, profile);
  const posts = await db.models.Post.find({ profileId: profile._id }).populate(
    "profileId"
  ).populate("restaurantId");
  return { profile, postsCount, posts };
}

export async function action({ request, params }) {
  const db = await connectDb();
  const userId = await getLoggedUser(request);
  const loggedInProfile = await findProfileByUser(db, userId);
  console.log(userId);

  try{
    await db.models.Profile.updateOne(
      {userId: userId},
      {$push: {
        following: params.profileId
      }}
    )
    await db.models.Profile.updateOne(
      {_id: params.profileId},
      {
        $push: {
          followers: userId
        }
      }
    )
  }catch(err){
    console.log(err);
  }

  return null;
}

export default function ProfileId() {
  const { profile, postsCount, posts } = useLoaderData();
  return (
    <>
      <div>
        <img
          src={profile.profileImg}
          alt="profile img"
          className="profileImgHeader"
        />
        <p>
          {profile.username} {profile.isVerified ? "true" : "false"}
        </p>
      </div>
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
        <Form method="post">
          <button type="submit" name="_action" value="follow">
            Follow
          </button>
        </Form>
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
      <div>
        {posts.map((p) => {
          return <SinglePost post={p} key={p._id} />;
        })}
      </div>
    </>
  );
}
