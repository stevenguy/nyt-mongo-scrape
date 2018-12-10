var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var SaveSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  saved: {
    type: String,
    required: false
  },
  note: {
    type: String,
    required: false
  }
});

// This creates our model from the above schema, using mongoose's model method
var Save = mongoose.model("Save", SaveSchema);

// Export the Save model
module.exports = Save;