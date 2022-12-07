import { Link } from "@remix-run/react";


export default function Header() {
  return (
    <>
      <div className="header">
        <h1>
          <Link to="/" className="logo">
            <span className="logoMad">Mad</span>
            <span className="logoGlad">Glad</span>
          </Link>
        </h1>
      </div>
    </>
  );
}
