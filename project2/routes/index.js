const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();

//const myDB = require("../db/mongoIntializer.js");
async function getAddresses(query, page, pageSize) {
  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");

    return await eventsCollection.find(query).sort({ _id: -1 }).toArray();
  } finally {
    await client.close();
  }
}

async function getAddressesCount(query) {
    let db, client;
  
    try {
      const uri = "mongodb://localhost:27017";
      client = new MongoClient(uri);
      await client.connect();
  
      console.log("Connected to Mongo Server");
  
      db = client.db("project2");
      const eventsCollection = db.collection("addresses");
  
      return await eventsCollection.find(query).count();
    } finally {
      await client.close();
    }
}
/* GET home page. */
router.get("/addresses", async (req, res, next) => {
  const query = req.query.q || {};
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await getAddressesCount(query);
    let addresses = await getAddresses(query, page, pageSize);
    res.render("./pages/participants", {
      addresses,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total/pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/addresses", async (req, res, next) => {
  const query = req.query.q || {};
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await getAddressesCount(query);
    let addresses = await getAddresses(query, page, pageSize);
    res.render("./pages/participants", {
      addresses,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total/pageSize),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;