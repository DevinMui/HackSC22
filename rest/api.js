// should really be rpc but eh
const axios = require("axios");

const BASE_URL = "http:127.0.0.1:5000";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const client = axios.create({
  baseURL: BASE_URL,
  headers,
});

module.exports = client;
