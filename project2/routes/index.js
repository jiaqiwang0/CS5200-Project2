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

    return await eventsCollection.find().sort({ _id: -1 }).toArray();
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
  
      return await eventsCollection.find().count();
    } finally {
      await client.close();
    }
}

async function getAddressesbyCityCount(query) {
  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");

    //return await eventsCollection.find({city:query}).count();
    return await eventsCollection.find().count();
  } finally {
    await client.close();
  }
}

async function getAddressesByCitytName(query, page, pageSize) {
  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");
    let result = eventsCollection.find({city:query}).toArray();
    console.log(result.toString())
    //return await eventsCollection.find({city:query}).toArray();
    return await eventsCollection.find().sort({ _id: -1 }).toArray();
  } finally {
    await client.close();
  }
}

async function getAddressByID(participantID, par) {
  console.log("getAddressByID", participantID);

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");
    //db.city.update({_id:ObjectId("584a13d5b65761be678d4dd4")}, {$set: {"citiName":"Jakarta Pusat"}})

    return await eventsCollection.update({id:query}, {$set: {street1:par.street1,street2:par.street2, city:par.city, state:par.state, zipCode:par.zipCode}}).count();
  } finally {
    await stmt1.finalize();
    await stmt2.finalize();
    db.close();
  }
}


async function deleteAddressByID(participantID) {
  console.log("deleteAddressByID", participantID);

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");

    return await eventsCollection.remove({id:query}).count();
  } finally {
    await stmt1.finalize();
    await stmt2.finalize();
    db.close();
  }
}


async function createAddress(par) {
  console.log("createAddress", par);

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");

    return await eventsCollection.update({id:par.id, street1:par.street1,street2:par.street2, city:par.city, state:par.state, zipCode:par.zipCode});
  } finally {
    await stmt1.finalize();
    await stmt2.finalize();
    db.close();
  }
}


/* GET home page. */
router.get("/participants", async (req, res, next) => {
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

router.get("/addresses/searchAddressesByOrginizer", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  //uery = "Flatley-Stehr"
  try {
    let total = await getAddressesbyCityCount(query);
    let participants = await getAddressesByCitytName(query, page, pageSize);
    res.render("./pages/participants", {
      participants,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total/pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/addresses/:addressID/edit", async (req, res, next) => {
  const addressID = req.params.addressID;

  const msg = req.query.msg || null;
  try {

    let par = await getAddressByID(addressID);

    console.log("edit addresses", {
      par,
      msg,
    });


    res.render("./pages/editAddresses", {
      par,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/addresses/:addressID/delete", async (req, res, next) => {
  const addressID = req.params.addressID;

  const msg = req.query.msg || null;
  try {

    let par = await deleteAddressByID(addressID);

    console.log("delete addresses", {
      par,
      msg,
    });

    if (deleteResult && deleteResult.changes === 1) {
      res.redirect("/addresses/?msg=Deleted");
    } else {
      res.redirect("/addresses/?msg=Error Deleting");
    }

  } catch (err) {
    next(err);
  }
});


router.post("/createAddresses", async (req, res, next) => {
  const par = req.body;
  console.log("get request body");

  try {
    const insertPar = await createAddress(par);

    console.log("Inserted", insertPar);
    res.redirect("/participants/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

module.exports = router;