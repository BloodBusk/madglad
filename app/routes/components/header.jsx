import { Link, Form, useCatch, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/session.server.js";
import { redirect, json } from "@remix-run/node";

export default function Header() {
  return (
    <div className="header">
      <Link to="/">Home</Link>
      <Link to="../services/login">Login</Link>
      <Link to="../services/signup">Signup</Link>
    </div>
  );
}
