var express = require("express");
var router = express.Router();
var assert = require('assert');

const myDB = require("../db/myMongoDB.js");



/* GET home page. */
router.get("/", async function (req, res) {
  const events = await myDB.getEvents();


  res.render("index", { events });
});

router.get("/events", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    // let total = await myDb.getEventsCount(query);
    // let events = await myDb.getEvents(query);
    //console.log("hiiiooooooooooo", events);
    res.render("./index", {
      events,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total/pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/insert", async function (req, res) {
  var item = {
    eventType : req.body.eventType,
    eventName : req.body.eventName,
    date: req.body.date,
    duringTime: req.body.duringTime,
    addressId: req.body.addressId,
    description: req.body.description,
    organizerId: req.body.organizerId

  };
  console.log("insert", item, req.body);
  const createEvents = await myDB.createEvent(item);

  res.redirect("/");
});

router.get("/:_id/edit", async (req, res, next) => {
  const _id = req.params._id;

  const msg = req.query.msg || null;
  try {

    let eve = await myDB.getEventByID(_id);
    console.log("edit events", {
      eve,
      msg,
    });

    res.render("./editEvent", {
      eve,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/_id/edit", async (req, res, next) => {
  const _id = req.params._id;
  const eve = req.body;
  console.log(eve)
  var item = {
    eventType : req.body.eventType,
    eventName : req.body.eventName,
    date: req.body.date,
    duringTime: req.body.duringTime,
    addressId: req.body.addressId,
    description: req.body.description,
    organizerId: req.body.organizerId

  };
  console.log("helloooooo", req);

  try {

    let updateResult = await myDb.updateEventByID(_id, item);
    console.log("update", updateResult);

    if (updateResult && updateResult.changes === 1) {
      res.redirect("/?msg=Updated");
    } else {
      res.redirect("/?msg=Error Updating");
    }

  } catch (err) {
    next(err);
  }
});

router.post("/update", async function (req, res, next) {
  const _id = req.params._id;
  const eve = req.body;
  console.log("helloEventTypes", req);

  try {

    let updateResult = await myDb.updateEventTypeByID(_id, eve);
    console.log("update", updateResult);

    if (updateResult && updateResult.changes === 1) {
      res.redirect("/events/?msg=Updated");
    } else {
      res.redirect("/events/?msg=Error Updating");
    }

  } catch (err) {
    next(err);
  }
});

router.get("/:_id/delete", async (req, res, next) => {
  var item = req.params._id;
  console.log(item);
  try {
    let deleteResult = await myDB.deleteEvent(item);
    console.log("delete", deleteResult);

    if (deleteResult && deleteResult.deletedCount === 1) {
      res.redirect("/?msg=Deleted");
    } else {
      res.redirect("/?msg=Error Deleting");
    }

  } catch (err) {
    next(err);
  }
});

module.exports = router;
