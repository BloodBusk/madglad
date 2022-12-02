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
import facebook from "~/imgs/facebook-f.svg";
import instagram from "~/imgs/instagram.svg";
import twitter from "~/imgs/twitter.svg";
import tiktok from "~/imgs/tiktok.svg";
import defaultProfile from "~/imgs/user.png";
import settings from "~/imgs/settings.png";
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
  const [showSettings, setShowSettings] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

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

  const showEditOptions = () => {
    setShowEdit((showEdit) => !showEdit);
  };

  return (
    <>
      <Header profile={profile} />
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
                  onClick={showPostSettings}
                  className="settingsButton"
                >
                  <img src={settings} alt="settings" className="settingsImg" />
                </button>
                {showSettings ? (
                  <>
                    <button type="button" onClick={showEditOptions}>
                      Edit
                    </button>
                    <button type="button" onClick={showDeleteOptions}>
                      Delete
                    </button>

                    {showEdit ? (
                      <>
                        <Form method="POST" reloadDocument>
                          <input
                            type="text"
                            defaultValue={p.title}
                            name="title"
                          />
                          <input
                            type="text"
                            defaultValue={p.restaurantName}
                            name="restaurantName"
                          />
                          <input
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
                        <Form method="DELETE">
                          <label>Are you Sure you want to Delete?</label>
                          <button
                            type="submit"
                            name="_action"
                            value="deletePost"
                          >
                            Yes
                          </button>
                          <input
                            type="hidden"
                            name="hiddenPostId"
                            defaultValue={p._id}
                          />
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
      <FooterNav user={user._id} />
    </>
  );
}
