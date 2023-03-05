/*
  Event Routes
  /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");

const { isDate } = require("../helpers/isDate");
const { fieldValidators } = require("../middlewares/fields-validators");
const { jwtValidator } = require("../middlewares/jwt-validator");
const {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} = require("../controllers/events");

const router = Router();
//all petitions should validate the token
router.use(jwtValidator);

//get events
router.get("/", getEvents);
//create event
router.post(
  "/",
  [
    check("title", "Title is required").not().isEmpty(),
    check("start", "Initial date is required").custom(isDate),
    check("end", "Final date is required").custom(isDate),
    fieldValidators,
  ],
  createEvent
);
//update event
router.put("/:id", updateEvent);
//delete event
router.delete("/:id", deleteEvent);

module.exports = router;
