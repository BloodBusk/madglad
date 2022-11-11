import { Link, Form, useCatch, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/session.server.js";
import { redirect, json } from "@remix-run/node";

export default function Header({profile}) {
  return (
    <div>
      <h1>Mad Glad</h1>
      <Link to="/services/logout">Logout</Link>
      <img src={profile.profileImg} alt="profile img" className="profileImgHeader" />
    </div>
  );
}
