const client = require("./api");

module.exports = {
  rank: async ({ name, path, url }) => {
    return await client.post("/", {
      name,
      path,
      url,
    });
  },
};
