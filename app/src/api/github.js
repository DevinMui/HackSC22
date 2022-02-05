async function getToken(code) {
  try {
    const res = await fetch("./github/oauth", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        client_id: process.env.REACT_APP_GH_CLIENT_ID,
        client_secret: process.env.REACT_APP_GH_CLIENT_SECRET,
        code,
      }),
    });
    const json = await res.json();
    if (json.token) return json.token;
    throw "No token found";
  } catch (e) {
    throw e;
  }
}

function getRepos() {}

function logout() {}

export { getToken, getRepos, logout };
