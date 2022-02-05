const fetch = require("node-fetch").default
const express = require("express");
const mongoose = require("mongoose");
const repo = require("./repo");
const Campaign = require("./models/campaign");
const Sponsor = require("./models/sponsor");

mongoose.connect("mongodb://localhost/hacksc22");

const PORT = 8080;
const app = express();

app.use(express.json());

app.get("/campaigns", async (req, res, next) => {
  const getMine = async () => {
    // TODO
    return await getExplore();
  };

  const getSubscribed = async () => {
    // TODO
    return await getExplore();
  };

  const getExplore = async () => {
    const campaigns = await Campaign.find({});
    res.json(campaigns);
  };

  try {
    const { type } = req.query;
    switch (type) {
      case "MINE":
        // TODO?
        return await getMine();
      case "SUBSCRIBED":
        return await getSubscribed();
      case "EXPLORE":
        return await getExplore();
      default:
        return await getExplore();
    }
  } catch (e) {
    next(e);
  }
});

app.get("/", (req, res) => {
  res.send("hi");
});

app.get("/campaigns/:id", async (req, res, next) => {
  try {
    const campaign = await Campaign.findOne({
      repoId: req.params.id,
    });

    const { rank } = await repo.rank({
      path: campaign.path,
    });

    res.json({ ...campaign, rank });
  } catch (e) {
    next(e);
  }
});

app.post("/campaigns", async (req, res, next) => {
  try {
    // is this inefficient? yes. do i care? no
    const { path } = await repo.rank({
      name: req.body.name,
      url: req.body.url,
    });
    const campaign = await new Campaign({ ...req.body, path }).save();
    res.json(campaign);
  } catch (e) {
    next(e);
  }
});

app.post("/campaigns/:id/sponsors", async (req, res) => {
  try {
    // TODO: stripe stuff
    const sponsor = await new Sponsor(req.body).save();
    res.json(sponsor);
  } catch (e) {
    next(e);
  }
});

app.post("/github/oauth", async (req, res) => {
  const b = await fetch("https://github.com/login/oauth/access_token", {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(req.body),
  });
  const json = await b.json();
  res.send({ token: json.access_token });
});

// error handlers
app.use((req, res) => {
  res.status(404);
  res.json({ error: `${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error("500 Error", err);
  res.status(err.status || 500);
  res.json({ error: err.message || "Something happened" });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
