import { Link } from "@remix-run/react";

export default function footerNav({user}) {
  return (
    <div className="footer">
      <Link to={`/userProfile/${user}`}>Profile</Link>
      <Link to="/services/search">Search</Link>
    </div>
  );
}