import { createCookie } from "@remix-run/node";

let secret = process.env.COOKIE_SECRET;
if(!secret){
    throw new Error("cookie secret must be set");
}

export const sessionCookie = createCookie("__session", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
    secrets: [secret],
})