import { Link, Form, useCatch, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/session.server.js";
import { redirect, json } from "@remix-run/node";

export default function footerNav({user}) {
  return (
    <div>
      <Link to={`../profile/${user}`}>Profile</Link>
    </div>
  );
}