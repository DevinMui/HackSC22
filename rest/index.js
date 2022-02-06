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
    const sponsors = await Sponsor.find({
      userId: req.params.id,
      paymentAccepted: true,
    });
    res.json(sponsors);
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

// handle subscription payments
app.post("/webhook", async (req, res, next) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.WEBHOOK_KEY
    );
  } catch (err) {
    console.log(err);
    console.log(`⚠️  Webhook signature verification failed.`);
    console.log(`⚠️  Check the env file and enter the correct webhook secret.`);
    return res.sendStatus(400);
  }
  // Extract the object from the event.
  const dataObject = event.data.object;

  if (dataObject["billing_reason"] == "subscription_create") {
    const subscription_id = dataObject["subscription"];
    const payment_intent_id = dataObject["payment_intent"];

    // Retrieve the payment intent used to pay the subscription
    const payment_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

    // Set payment
    await stripe.subscriptions.update(subscription_id, {
      default_payment_method: payment_intent.payment_method,
    });

    const sub = await Sponsor({ subscriptionId: subscription_id });
    sub.paymentAccepted = true;
    await sub.save();
  }

  switch (event.type) {
    case "invoice.paid":
      break;
    case "invoice.payment_failed":
      break;
    case "customer.subscription.deleted":
      if (event.request != null) {
      } else {
      }
      break;
    default:
      break;
  }
  res.status(200);
});

// Call this on
app.post("/campaigns/:id/sponsor", async (req, res, next) => {
  try {
    const amount = req.body.contribution;
    const customer = await stripe.customers.create();
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
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    const sponsor = await new Sponsor({
      ...req.body,
      subscriptionId: subscription.id,
    }).save();
    res.json({
      sponsor,
      subscription,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
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
