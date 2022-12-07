import { Form, useLoaderData } from "@remix-run/react";
import React from "react";
import connectDb from "~/db/connectDb.server";
import { json } from "@remix-run/node";
import {
  findProfileById,
  findPostsCountByProfile,
  findProfileByUser,
  findUserById,
} from "~/db/dbF";
import { getLoggedUser, requireUserSession } from "~/session.server";

//images
import facebook from "~/imgs/facebook.png";
import instagram from "~/imgs/instagram.png";
import twitter from "~/imgs/twitter.png";
import tiktok from "~/imgs/tiktok.png";
import defaultProfile from "~/imgs/user.png";
import verified from "~/imgs/verified.png";

//components
import SinglePost from "../components/singlePost";
import Header from "~/routes/components/header.jsx";
import FooterNav from "~/routes/components/footerNav.jsx";

//style
import style from "~/styles/userProfile.css";

export const links = () => [
  {
    rel: "stylesheet",
    href: style,
  },
];

export async function loader({ request, params }) {
  await requireUserSession(request);
  const db = await connectDb();
  const userId = await getLoggedUser(request);
  const loggedProfile = await findProfileByUser(db, userId);
  const user = await findUserById(db, userId);
  const profile = await findProfileById(db, params.profileId);
  const postsCount = await findPostsCountByProfile(db, profile);
  const posts = await db.models.Post.find({ profileId: profile._id })
    .populate("profileId")
    .populate("restaurantId");
  return { profile, postsCount, posts, user, loggedProfile };
}

export async function action({ request, params }) {
  const db = await connectDb();
  const userId = await getLoggedUser(request);
  const loggedInProfile = await findProfileByUser(db, userId);
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  //form variables
  const hiddenPostId = formData.get("hiddenPostId");

  //adds id of follower to logged in user and adds logged in user id to the followed. //addToSet is mongodb push method but unique
  if (_action === "follow") {
    try {
      await db.models.Profile.updateOne(
        { userId: userId },
        {
          $addToSet: {
            following: params.profileId,
          },
        }
      );
      await db.models.Profile.updateOne(
        { _id: params.profileId },
        {
          $addToSet: {
            followers: userId,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  //add id of logged in user to the like array of pressed post
  if (_action === "like") {
    try {
      await db.models.Post.updateOne(
        {
          _id: hiddenPostId,
        },
        {
          $addToSet: {
            likes: userId,
          },
        }
      );
      return null;
    } catch (err) {
      return json(err.errors, { status: 400 });
    }
  }

  return null;
}

export default function ProfileId() {
  const { profile, postsCount, posts, user, loggedProfile } = useLoaderData();
  return (
    <>
      <Header />
      <div className="userProfileContainer">
        <div className="userProfileId_container">
          <div className="userProfileId_1">
            <img
              src={profile.profileImg ? profile.profileImg : defaultProfile}
              alt="profile img"
              className="profileImgHeader"
            />
            {/* checks if the user is verified */}
            <h3 className="userColor">
              {profile.username}{" "}
              {profile.isVerified ? (
                <img src={verified} alt="verified" className="verifiedIcon" />
              ) : (
                ""
              )}
            </h3>
          </div>
          <div className="profileInfo">
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
          <div className="followBtnContainer">
            <Form method="post">
              <button
                type="submit"
                name="_action"
                value="follow"
                className="followBtn"
              >
                Follow
              </button>
            </Form>
            {profile.bookingLink !== "" ? (
              <a
                href={profile.bookingLink}
                target="_blank"
                rel="noreferrer"
                className="bookingLink"
              >
                Book Her
              </a>
            ) : (
              ""
            )}
          </div>
          <div className="socialMediaIcons">
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
        </div>
      </div>
      <FooterNav user={user._id} userProfile={loggedProfile} />
    </>
  );
}
