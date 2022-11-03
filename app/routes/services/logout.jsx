import { logout } from "~/session.server.js";

export async function loader({ request }) {
    return await logout(request);
}