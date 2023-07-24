const mongoose = require('mongoose');

const newsOrderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    news: [
      {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'News',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const NewsOrder = mongoose.model('NewsOrder', newsOrderSchema);
module.exports = NewsOrder;
