import { Link } from "@remix-run/react";

export default function footerNav({user}) {
  return (
    <div>
      <Link to={`/userProfile/${user}`}>Profile</Link>
    </div>
  );
}