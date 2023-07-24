const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
    },
    image: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'Category',
    },
    synopsis: {
      type: String,
    },
    gallery: [
      {
        type: {
          type: String,
          default: 'image',
        },
        url: {
          type: String,
        },
      },
    ],
    trailer: {
      type: String,
    },
    releaseDate: {
      type: Date,
    },
    production: [],
    starcast: [
      {
        cast: {
          type: mongoose.Schema.Types.ObjectID,
          ref: 'Cast',
        },
      },
    ],
    seriescast: [
      {
        cast: {
          type: mongoose.Schema.Types.ObjectID,
          ref: 'Cast',
        },
        season: {
          type: String,
        },
        year: {
          type: String,
        },
        character: {
          type: String,
        },
      },
    ],

    other: [],

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

const Movies = mongoose.model('Movies', newsSchema);
module.exports = Movies;
