import { Link, Form, useCatch, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/session.server.js";
import { redirect, json } from "@remix-run/node";
import Logo from "~/imgs/Logo.png";

export default function Header({ profile }) {
  return (
    <>
      <div className="header">
        <h1>
          <Link to="/" className="logo">
            <span className="logoMad">Mad</span>
            <span className="logoGlad">Glad</span>
          </Link>
        </h1>
        <Link to="/services/logout">Logout</Link>
        <img
          src={profile ? profile.profileImg : ""}
          alt="profile img"
          className="headerProfileImg"
        />
      </div>
    </>
  );
}
