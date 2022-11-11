import Header from "./components/header.jsx";
import FooterNav from "./components/footerNav.jsx";
import { Link, useLoaderData } from "@remix-run/react";
import { getLoggedUser, requireUserSession } from "~/session.server";
import connectDb from "~/db/connectDb.server";
import { findUserById, findProfileByUser, findAllPosts } from "~/db/dbF";

export const loader = async ({ request }) => {
  await requireUserSession(request);
  const userId = await getLoggedUser(request);
  const db = await connectDb();
  const user = await findUserById(db, userId);
  const profile = await findProfileByUser(db, user);
  const posts = await findAllPosts(db);  
  const combine = await db.models.Profile.find({}).populate("userId");
  const combine2 = await db.models.Post.find({}).populate("profileId");

  return { profile, user, posts, combine, combine2};
};

export default function Index() {
  const { profile, user, posts, combine, combine2 } = useLoaderData();
  console.log(combine2);
  return (
    <div>
      <Header profile={profile} />
      <p>{user.username}</p>
      {posts.map((post) => {
        return (
          <div key={post._id}>
            {post.title} <Link to="">{post.userId} </Link>
            <Link to={`/posts/${post._id}`}>
              <img className="postImg" src={post.postImg} alt="posts img" />
            </Link>
          </div>
        );
      })}
      <FooterNav user={user._id} />
    </div>
  );
}
