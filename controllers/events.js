const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name");

  res.status(201).send({ ok: true, events });
};

const createEvent = async (req, res = response) => {
  const event = new Event(req.body);
  try {
    //send uid of the user that saved the event
    event.user = req.uid;
    const savedEvent = await event.save();

    res.status(201).send({
      ok: true,
      event: savedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const updateEvent = async (req, res = response) => {
  //returns url id
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({
        ok: false,
        msg: "Cant find event",
      });
    }

    //only the original users can edit their own events
    if (event.user.toString() !== uid) {
      return res.status(401).send({
        ok: false,
        msg: "Can not edit this event",
      });
    }

    const newEvent = {
      ...req.body,
      user: uid,
    };

    //returns old event if you dont use the third argument
    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.status(201).send({
      ok: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false });
  }
};

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({
        ok: false,
        msg: "Cant find event",
      });
    }

    //only the original users can edit their own events
    if (event.user.toString() !== uid) {
      return res.status(401).send({
        ok: false,
        msg: "Can not delete this event",
      });
    }

    //returns old event if you dont use the third argument
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    res.status(201).send({
      ok: true,
      event: deletedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
