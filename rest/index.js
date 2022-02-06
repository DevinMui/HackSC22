const fetch = require("node-fetch").default;
const express = require("express");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.SECRET_KEY);
const repo = require("./repo");
const Campaign = require("./models/campaign");
const Sponsor = require("./models/sponsor");
const nodemailer = require("nodemailer");

mongoose.connect("mongodb://localhost/hacksc22");

const PORT = 8080;
const app = express();

app.use(express.json());

const sendEmail = async (to, subject, html) => {
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"GitPeanuts 🥜" <pay@gitpeanuts.com>', // sender address
    to,
    subject,
    html,
  });
  return { info, url: nodemailer.getTestMessageUrl(info) };
};

app.get("/campaigns", async (req, res, next) => {
  const getMine = async () => {
    // TODO?
    return await getExplore();
  };

  const getSubscribed = async () => {
    // this is quite possibly the least efficient query ive ever written
    const sponsors = await Sponsor.find({
      userId: req.query.userId,
      paymentAccepted: true,
    });

    const campaigns = await Promise.all(
      sponsors.map(async (sponsor) => {
        return await Campaign.findOne({ repoId: sponsor.repoId });
      })
    );

    res.json(campaigns);
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

app.post("/campaigns", async (req, res, next) => {
  try {
    // is this inefficient? yes. do i care? no
    // const { path } = await repo.rank({
    await repo.rank({
      name: req.body.name,
      url: req.body.url,
    });
    const campaign = await new Campaign({
      ...req.body,
      path: "repos/" + req.body.name,
    }).save();
    res.json(campaign);
  } catch (e) {
    next(e);
  }
});

// handle subscription payments
app.post("/webhook", async (req, res) => {
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

app.post("/github/oauth", async (req, res, next) => {
  try {
    const b = await fetch("https://github.com/login/oauth/access_token", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(req.body),
    });
    const json = await b.json();
    res.send({ token: json.access_token });
  } catch (e) {
    next(e);
  }
});

app.get("/github/contributions", async (req, res, next) => {
  try {
    const url = `https://github.com/${req.query.owner}/${req.query.repo}/graphs/contributors-data`;
    const b = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const json = await b.json();
    console.log(url);
    res.send(json);
  } catch (e) {
    next(e);
  }
});

// dumb admin stuff
app.post("/campaigns/:id/payout", async (req, res, next) => {
  try {
    const repoId = encodeURIComponent(req.params.id);

    const campaign = await Campaign.findOne({
      repoId,
    });

    const sponsors = await Sponsor.find({ repoId });
    // total sponsor contributions
    const sum = sponsors.reduce(
      (prev, curr) => prev.contribution + curr.contribution
    );

    const { rank } = await repo.rank({
      path: campaign.path,
    });

    // total contributions
    const totalContributions = rank.reduce(
      (prev, curr) => Number(prev.commits) + Number(curr.commits)
    );

    const notifInfo = await rank.map((r) => {
      const ratio = r.commits / totalContributions;
      const pay = ratio * sum;
      return { ratio, pay, name: r.name, email: r.email };
    });

    const info = await notifInfo.map(async (info) => {
      const subject = `Thanks for contributing to ${repoId}`;
      const message = `<p>Thank you, ${info.name}!</p>
      <p>For your contributions to the repository <a href="https://github.com/${repoId}">${repoId}</a>, we have sent you ${info.pay} this month.</p>
        <p>Keep at it!</p><p>GitPeanuts team 🥜</p>`;
      return await sendEmail(info.email, subject, message);
    });
    return res.json({ sent: true, info });
  } catch (e) {
    next(e);
  }
});

app.get("/campaigns/:id", async (req, res, next) => {
  try {
    const repoId = encodeURIComponent(req.params.id);
    console.log("repoId", repoId);
    const campaign = await Campaign.findOne({
      repoId,
    });

    if (campaign === null) throw "campaign not found";

    console.log("campaign", campaign);
    const { rank } = await repo.rank({
      path: campaign.path,
    });

    res.json({ ...campaign, rank });
  } catch (e) {
    next(e);
  }
});

if (process.env.NODE_ENV === "production") {
  // Serve React production bundle
  app.use(express.static(path.join(__dirname, "build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    return res.json({ message: "hello world!" });
  });
}

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
