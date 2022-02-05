import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";

const NavBar = () => {
  const auth = useAuth();
  if (auth.user) {
    return (
      <Link to="/" onClick={auth.logout}>
        log out
      </Link>
    );
  } else {
    return <Link to="login">log in</Link>;
  }
};

export default NavBar;
