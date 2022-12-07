import { useLoaderData, Link, useActionData, Form } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import React, { useState } from "react";
import connectDb from "~/db/connectDb.server";
import { findPostById, findProfileByUser } from "~/db/dbF";
import { getLoggedUser } from "~/session.server";

//imgs
import star from "~/imgs/star.svg";

//components
import Header from "~/routes/components/header.jsx";
import FooterNav from "~/routes/components/footerNav.jsx";

//style
import style from "~/styles/postId.css";

export const links = () => [
  {
    rel: "stylesheet",
    href: style,
  },
];

export async function loader({ request, params }) {
  const db = await connectDb();
  const userId = await getLoggedUser(request);
  const loggedInUserProfile = await findProfileByUser(db, userId);
  const post = await findPostById(db, params.postId);
  const postxProfile = await db.models.Post.findOne({
    _id: params.postId,
  })
    .populate("profileId")
    .populate("restaurantId");
  return { postxProfile, userId, loggedInUserProfile };
}

export async function action({ request, params }) {
  const db = await connectDb();
  const form = await request.formData();
  const comment = form.get("comment");
  const userId = await getLoggedUser(request);
  const loggedInUserProfile = await findProfileByUser(db, userId);

  try {
    await db.models.Post.updateOne(
      { _id: params.postId },
      {
        $push: {
          comments: {
            username: loggedInUserProfile.username,
            comment: comment,
          },
        },
      }
    );
    return redirect(`/posts/${params.postId}`);
  } catch (err) {
    return json(
      { errormessage: err + "something went wrong" },
      { status: 400 }
    );
  }
}

export default function PostId() {
  const { postxProfile, userId, loggedInUserProfile } = useLoaderData();
  const actionData = useActionData();
  const [commentSize, setCommentSize] = useState(3);
  const [showPopup, setShowPopup] = useState(false);

  const handleShowMore = () => {
    setCommentSize(commentSize + 3);
  };

  const handleShowLess = () => {
    setCommentSize(3);
  };

  const handlePopup = () => {
    setShowPopup((showPopup) => !showPopup);
  };

  return (
    <>
      {<Header />}
      <div className="postIdContainer">
        <div className="postIdHeader">
          <img
            src={postxProfile.profileId?.profileImg}
            alt="profile img"
            className="profileImgHeader"
          />
          <h4 className="postIdUsername">{postxProfile.profileId?.username}</h4>
        </div>
        <div className="postIdHeader2">
          <h3>{postxProfile?.title}</h3>

          <Link
            to={
              postxProfile.restaurantId
                ? `/profiles/${postxProfile.restaurantId._id}`
                : ""
            }
            className="postIdRestaurant"
          >
            {postxProfile?.restaurantName}{" "}
          </Link>
        </div>
        <div>
          <img
            src={postxProfile.postImg}
            alt="post pic"
            className="postIdImg"
          />
        </div>

        <div className="postIdTags">
          {postxProfile.tags?.map((tags, i) => {
            return <p key={i}>#{tags}</p>;
          })}
        </div>
        <p className="postIdReview">{postxProfile?.review}</p>
        <div className="ratingStarContainer">
          {Array.from({ length: postxProfile.rating }, (_, i) => (
            <img key={i} src={star} alt="star" className="ratingStar" />
          ))}
        </div>
        <div className="postIdBtns">
          {postxProfile.restaurantId ? (
            <Link to={postxProfile.restaurantId.bookingLink}>Book Her</Link>
          ) : (
            ""
          )}
          <div className="postGeobtn">
            <button onClick={handlePopup} type="button">
              Addresse
            </button>
            <p className={showPopup ? "popupContainer" : "hidden"}>
              {postxProfile.geolocation}
            </p>
          </div>
        </div>
        <Form method="post" className="postIdCommentForm">
          <input type="text" name="comment" placeholder="kommentar..." />
          <button type="submit">Post</button>
        </Form>
        <div>
          {postxProfile.comments?.slice(0, commentSize).map((com, i) => {
            return (
              <div key={i} className="postIdComments">
                <h4>{com.username}</h4>
                <p>{com.comment}</p>
                <div className="divider"></div>
              </div>
            );
          })}
        </div>
        <div className="postIdCommentMore">
          <p onClick={handleShowMore}>show more comments</p>
          <p onClick={handleShowLess}>collapse comments</p>
        </div>

        {actionData?.errormessage}
      </div>
      <FooterNav user={userId} userProfile={loggedInUserProfile} />
    </>
  );
}
