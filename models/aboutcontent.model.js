const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);
module.exports = AboutContent;
