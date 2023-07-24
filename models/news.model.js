const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: 1,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'Category',
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model('News', newsSchema);
module.exports = News;
