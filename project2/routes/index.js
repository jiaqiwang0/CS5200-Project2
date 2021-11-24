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
    return await eventsCollection.find({city:query}).count();
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
    //console.log(result.toString())
    //return await eventsCollection.find({city:query}).toArray();
    return await eventsCollection.find({city:query}).sort({ _id: -1 }).toArray();
  } finally {
    await client.close();
  }
}

async function getAddressByID(addressID) {
  console.log("getAddressByID", addressID);

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");
    //db.city.update({_id:ObjectId("584a13d5b65761be678d4dd4")}, {$set: {"citiName":"Jakarta Pusat"}})

    //return await eventsCollection.update({id:participantID}, {$set: {street1:par.street1,street2:par.street2, city:par.city, state:par.state, zipCode:par.zipCode}}).count();
    return await eventsCollection.find({_id:addressID});
  } finally {
    client.close();
  }
}

async function updateAddressByID(addressID, par) {
  console.log("getAddressByID", addressID);

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");
    //db.city.update({_id:ObjectId("584a13d5b65761be678d4dd4")}, {$set: {"citiName":"Jakarta Pusat"}})
    console.log(addressID)
    //return await eventsCollection.update({_id:addressID}, {$set: {street1:int(par.street1),street2:par.street2, city:par.city, state:par.state}})
    return await eventsCollection.update({_id:addressID}, {$set: {street1:par.street1,street2:par.street2, city:par.city, state:par.state}})
    //return await eventsCollection.find({id:participantID});
  } finally {
    client.close();
  }
}


async function deleteAddressByID(query) {
  console.log("deleteAddressByID", query);

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");
    console.log(query)
    return await eventsCollection.remove({_id:query});
  } finally {
    
    client.close();
  }
}


async function createAddress(add) {
  console.log("createAddress", add);

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const eventsCollection = db.collection("addresses");

    return await eventsCollection.insert({id:add.id, street1:add.street1,street2:add.street2, city:add.city, state:add.state, zipCode:add.zipCode});
  } finally {
    
    client.close();
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
    res.render("./pages/addresses", {
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

router.get("/addresses/searchAddressesByCity", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  //uery = "Flatley-Stehr"
  try {
    let total = await getAddressesbyCityCount(query);
    let addresses = await getAddressesByCitytName(query, page, pageSize);
    res.render("./pages/addresses", {
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

router.get("/addresses/:addressID/edit", async (req, res, next) => {
  const addressID = req.params.addressID;
  const query = req.query.q
  const msg = req.query.msg || null;

  
  try {

    let add = getAddressByID(addressID);
    console.log("-------------jin------"+add);

    console.log("edit addresses", {
      add,
      msg,
    });


    res.render("./pages/editAddress", {
      add,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/addresses/:addressID/edit", async (req, res, next) => {
  const addressID = req.params.addressID;
  const add = req.body;

  try {

    let updateResult = await updateAddressByID(addressID, add);
    console.log("update", updateResult);

    if (updateResult) {
      res.redirect("/addresses/?msg=Updated");
    } else {
      res.redirect("/addresses/?msg=Error Updating");
    }

  } catch (err) {
    next(err);
  }
});

router.get("/addresses/:addressID/delete", async (req, res, next) => {
  const addressID = req.params.addressID;
  console.log(addressID)
  const msg = req.query.msg || null;
  try {

    let deleteResult = await deleteAddressByID(addressID);

    console.log("delete addresses", {
      deleteResult,
      msg,
    });

    if (deleteResult ) {
      res.redirect("/addresses/?msg=Deleted");
    } else {
      res.redirect("/addresses/?msg=Error Deleting");
    }

  } catch (err) {
    next(err);
  }
});


router.post("/createAddress", async (req, res, next) => {
  const add = req.body;
  console.log("get request body");

  try {
    const insertAdd = await createAddress(add);

    console.log("Inserted", insertAdd);
    res.redirect("/addresses/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

module.exports = router;