const fetch = require("node-fetch").default;
const express = require("express");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.SECRET_KEY);
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

app.get("/users/:id", async (req, res, next) => {
  try {
    await Sponsor.find({});
  } catch (e) {
    next(e);
  }
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
    const amount = req.body.contribution;
    const customer = await stripe.customers.create();
    await stripe.paymentIntents.create({
      customer: customer.id,
      setup_future_usage: "off_session",
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const price = await stripe.prices.create({
      unit_amount: amount,
      currency: "usd",
      recurring: { interval: "month" },
      product_data: {
        name: "Git Sponsorship",
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price }],
    });
    const sponsor = await new Sponsor({
      ...req.body,
      subscriptionId: subscription.id,
    }).save();
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

app.get("/github/contributions", async (req, res) => {
  const url = `https://github.com/${req.query.owner}/${req.query.repo}/graphs/contributors-data`;
  const b = await fetch(url, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });
  const json = await b.json();
  console.log(url);
  console.log(JSON.stringify(json));
  res.send(json);
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
