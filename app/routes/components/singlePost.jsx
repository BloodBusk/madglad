import React, { useState } from "react";
import { Link, Form } from "@remix-run/react";
import LikeRegular from "~/imgs/like-regular.svg";
import LikeSolid from "~/imgs/like-solid.svg";
import Comment from "~/imgs/comment.svg";
import verified from "~/imgs/verified.png";

export default function SinglePost({ post }) {
  const [countComments, setCountComments] = useState(post.comments?.length);

  const [liked, setLiked] = useState(false);

  const handleLiked = () => {
    setLiked(true);
  };

  return (
    <div className="singlePostContainer">
      <div className="singlePostHeader">
        <Link
          to={`/profiles/${post?.profileId?._id}`}
          className="singlePostHeaderLink"
        >
          <img
            src={post.profileId?.profileImg}
            alt="profile img"
            className="profileImgHeader"
          />
          <h4 className="userColor">{post?.profileId?.username} {post?.profileId?.isVerified ? (
                <img src={verified} alt="verified" className="verifiedIcon" />
              ) : (
                ""
              )}</h4>
          
        </Link>
        <Link
          to={post.restaurantId ? `/profiles/${post.restaurantId?._id}` : ""}
          className="restaurantColor"
        >
          {post?.restaurantName}
        </Link>
      </div>
      <h3> {post.title} </h3>
      <Link to={`/posts/${post._id}`}>
        <img className="postImg" src={post.postImg} alt="" />
      </Link>
      <div className="singlePostIconContainer">
        <div>
          <Form method="post">
            <button
              type="submit"
              name="_action"
              value="like"
              onClick={handleLiked}
              className="likeBtn"
            >
              <img
                src={liked ? LikeSolid : LikeRegular}
                alt="like icon"
                className="postIcons"
              />
            </button>
            <input type="hidden" defaultValue={post._id} name="hiddenPostId" />
          </Form>
        </div>
        <p>{post.likes.length}</p>
        <Link to={`/posts/${post._id}`}>
          <img src={Comment} alt="comment icon" className="postIcons" />
        </Link>
        <p>{countComments}</p>
      </div>
      <p>{post?.review}</p>
      <div className="postDivider"></div>
    </div>
  );
}
