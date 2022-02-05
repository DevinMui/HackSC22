import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const GhRedirect = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [message, setMessage] = useState(
    "Login unsuccessful, redirecting back to where you came from..."
  );
  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes("?code=");
    if (hasCode) {
      // TODO: this goes in another server
      fetch("https://github.com/login/oauth/access_token", {
        headers: { Accept: "application/json" },
        mode: "cors",
        method: "POST",
        body: JSON.stringify({
          client_id: process.env.REACT_APP_GH_CLIENT_ID,
          client_secret: process.env.REACT_APP_GH_CLIENT_SECRET,
          code: url.split("?code=")[1],
        }),
      })
        .then((res) => res.body)
        .then((r) => r.json())
        .then((json) => console.log(JSON.stringify(json)));
      // end TODO

      setMessage("Login successful! Redirecting you to GitPeanuts...");
      auth.login(url.split("?code=")[1]); // Replace w actual token
      window.setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      auth.logout();
      window.setTimeout(() => navigate(-2), 2000);
    }
  }, [window.location.href]);
  // If Github API returns the code parameter
  return <div>{message}</div>;
};

export default GhRedirect;
