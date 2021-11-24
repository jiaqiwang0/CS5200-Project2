const { MongoClient } = require("mongodb");
const mongodb = require("mongodb");

async function getEvents() {
  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const events = db.collection("events");

    // MQL 👉 json
    const query = {};
    return await events.find(query).limit(20).sort({ _id: -1 }).toArray();
  } finally {
    await client.close();
  }
}

async function getEventByID(_id) {
  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const events = db.collection("events");

    // MQL 👉 json
    const query = { _id : new mongodb.ObjectID(_id) };
    return await events.find(query).limit(20).sort({ _id: -1 }).toArray();
  } finally {
    await client.close();
  }
}

async function updateEventByID(_id, item) {
  let db, client;
  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const events = db.collection("events");

    // MQL 👉 json
    const query = {};

    console.log("Updating item", item);
    return await events.insertOne(item);
  } finally {
    await client.close();
  }
}

async function createEvent(item){

  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const events = db.collection("events");

    // MQL 👉 json
    const query = {};

    console.log("Inserting item", item);
    return await events.insertOne(item);
  } finally {
    await client.close();
  }
}


async function deleteEvent(item){

  let db, client;

  try {
    const uri = "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("project2");
    const events = db.collection("events");
    console.log("Deleteing event", item);

    const query = {_id : new mongodb.ObjectID(item)};
    return await events.remove(query);
  } finally {
    await client.close();
  }
}




module.exports.getEvents = getEvents;
module.exports.createEvent = createEvent;
module.exports.deleteEvent = deleteEvent;
module.exports.getEventByID = getEventByID;
module.exports.updateEventByID = updateEventByID;
