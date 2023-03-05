const { Schema, model } = require("mongoose");

const EventSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    //required: true,
  },
});

//use "function" to be able to use "this"
EventSchema.method("toJSON", function () {
  //this references the event object
  const { __v, _id, ...object } = this.toObject();
  //change id name reference
  object.id = _id;
  //return object without __v and _id
  return object;
});

module.exports = model("Event", EventSchema);
