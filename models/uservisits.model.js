const mongoose = require('mongoose');

const userVisitSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
  },
});

const UserVisit = mongoose.model('UserVisit', userVisitSchema);
module.exports = UserVisit;
