async function getToken(code) {
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
}

// Functions should only be called within auth.js

async function _getName(client) {
  const {
    data: { login },
  } = await client.rest.users.getAuthenticated();
  return login;
}

async function _getRepos(client) {
  const { data } = await client.rest.repos.listForAuthenticatedUser({
    sort: "updated",
  });
  console.log(JSON.stringify(data));
  return data;
}

async function _getContributions(_, owner, repo) {
  const url = `/github/contributions?owner=${owner}&repo=${repo}`;
  console.log(url);
  const data = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await data.json();
}

export { getToken, _getRepos, _getName, _getContributions };
