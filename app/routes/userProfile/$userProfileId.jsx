import React, { useRef, useState } from "react";
import {
  useLoaderData,
  Form,
  useActionData,
  useSubmit,
  Link,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/session.server.js";
import {
  findUserById,
  findProfileByUser,
  findPostsCountByProfile,
} from "~/db/dbF.js";

//imgs
import facebook from "~/imgs/facebook.png";
import instagram from "~/imgs/instagram.png";
import twitter from "~/imgs/twitter.png";
import tiktok from "~/imgs/tiktok.png";
import defaultProfile from "~/imgs/user.png";
import settings from "~/imgs/settings.svg";
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

export async function loader({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const db = await connectDb();
  const user = await findUserById(db, userId);
  const profile = await findProfileByUser(db, user);
  const posts = await db.models.Post.find({ profileId: profile._id })
    .populate("profileId")
    .populate("restaurantId");
  const postsCount = await findPostsCountByProfile(db, profile);
  return { profile, user, posts, postsCount };
}

export async function action({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const db = await connectDb();
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  //form values
  const hiddenPostId = formData.get("hiddenPostId");
  const title = formData.get("title");
  const restaurantName = formData.get("restaurantName");
  const review = formData.get("review");

  if (_action === "createPost") {
    return redirect();
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
  if (_action === "editPost") {
    try {
      await db.models.Post.updateOne(
        {
          _id: hiddenPostId,
        },
        {
          $set: {
            title: title,
            restaurantName: restaurantName,
            review: review,
          },
        }
      );

      return redirect(`/userProfile/${userId}`);
    } catch (err) {
      return json(err.errors, { status: 400 });
    }
  }
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
}

export default function UserProfileId() {
  const { profile, user, posts, postsCount } = useLoaderData();
  const [showSettings, setShowSettings] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [showEdit, setShowEdit] = useState(null);

  //used index to handle no more than the selected to show when pressed
  const showPostSettings = (index) => {
    setShowSettings(
      (showSettings) => {
        return showSettings === index ? null : index;
      },
      setShowEdit(false),
      setShowDelete(false)
    );
  };

  const showDeleteOptions = (index) => {
    setShowDelete((showDelete) => {
      return showDelete === index ? null : index;
    }, setShowSettings(false));
  };

  const handleDeleteNo = () => {
    setShowDelete(false);
    setShowSettings(false);
  };

  const showEditOptions = (index) => {
    setShowEdit((showEdit) => {
      return showEdit === index ? null : index;
    }, setShowSettings(false));
  };

  return (
    <>
      <Header />
      <div className="userProfileContainer">
        <div className="userProfileId_container">
          <div className="profileServiceLinks">
            <Link to={`/userProfile/${user._id}/updateProfile`}>
              Update Profile
            </Link>
            <Link to="/services/logout">Logout</Link>
          </div>
          <div className="userProfileId_1">
            {/* profile picture */}
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
          {/* followers / followings / posts */}
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
          {/* social media */}
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
        </div>
        {/* posts */}
        <div>
          {posts.map((p) => {
            return (
              <div key={p._id} className="settingsContainer">
                <button
                  type="button"
                  onClick={() => showPostSettings(p._id)}
                  className="settingsButton"
                >
                  <img src={settings} alt="settings" className="settingsImg" />
                </button>
                {showSettings ? (
                  <div
                    className={
                      showSettings === p._id
                        ? "settingsDropDownContainer"
                        : "hidden"
                    }
                    style={{
                      display: showSettings === p._id ? "flex" : "none",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => showEditOptions(p._id)}
                      className="button-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => showDeleteOptions(p._id)}
                      className="button-1"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {showEdit ? (
                  <>
                    <Form
                      method="POST"
                      reloadDocument
                      className={showEdit === p._id ? "showEdit" : "hidden"}
                      style={{
                        display: showEdit === p._id ? "flex" : "none",
                      }}
                    >
                      <input type="text" defaultValue={p.title} name="title" />
                      <input
                        type="text"
                        defaultValue={p.restaurantName}
                        name="restaurantName"
                      />
                      <textarea
                        type="text"
                        defaultValue={p.review}
                        name="review"
                      />
                      <input
                        type="hidden"
                        name="hiddenPostId"
                        defaultValue={p._id}
                      />
                      <button type="submit" name="_action" value="editPost">
                        Done
                      </button>
                    </Form>
                  </>
                ) : (
                  ""
                )}
                {showDelete ? (
                  <>
                    <div
                      className={showDelete === p._id ? "showDelete" : "hidden"}
                      style={{
                        display: showDelete === p._id ? "flex" : "none",
                      }}
                    >
                      <Form method="DELETE">
                        <label>
                          Are you Sure you want to delete this post?
                        </label>
                        <button
                          type="submit"
                          name="_action"
                          value="deletePost"
                          className="button-1"
                        >
                          Yes
                        </button>
                        <input
                          type="hidden"
                          name="hiddenPostId"
                          defaultValue={p._id}
                        />
                      </Form>
                      <button
                        type="button"
                        onClick={handleDeleteNo}
                        className="button-1"
                      >
                        No
                      </button>
                    </div>
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
      <FooterNav user={user._id} userProfile={profile} />
    </>
  );
}
