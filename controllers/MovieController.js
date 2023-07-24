const e = require('express');
const Cast = require('../models/cast.model');
const MovieOrder = require('../models/movieorder.model');
const Movies = require('../models/movies.model');

const add = async (req, res) => {
  // get my user id
  const createdBy = req.user.id;
  // console.log(req.body);

  // console.log(req.files.gallery);
  // const img_url = process.env.APP_URL + '/public/';
  // banner
  let banner = '';
  if (req.files.banner) {
    // banner = img_url + req.files.banner[0].filename;
    banner = req.files.banner[0].location;
  }
  let image = '';
  if (req.files.image) {
    // image = img_url + req.files.image[0].filename;
    image = req.files.image[0].location;
  }

  const { title, genre, category, synopsis, trailer, starcast, releaseDate } =
    req.body;

  const gallery = [];
  if (req.files.gallery) {
    req.files.gallery.forEach((element) => {
      console.log(element);
      gallery.push({
        type: 'image',
        url: element.location,
      });
    });
  }

  try {
    const movie = new Movies({
      title,
      genre,
      banner,
      image,
      gallery,
      category,
      synopsis,
      trailer,
      releaseDate,
    });
    await movie.save();
    res.status(201).send(movie);
    // res.status(201).json({ msg: 'Category added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const view = async (req, res) => {
  try {
    const movies = await Movies.find({ status: true }, '-status -__v')
      .sort({ releaseDate: -1 })
      .populate('createdBy', '-password -__v -role -createdAt -updatedAt');

    res.status(200).json(movies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const movies = await Movies.findOne({ _id: id }, '-status -__v ').populate(
      'createdBy starcast.cast seriescast.cast category',
      '-password -__v -role '
    );
    if (!movies) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(200).json(movies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// const update = async (req, res) => {
//   const { id } = req.params;
//   const { type, title } = req.body;
//   try {
//     const category = await Category.findOne({ _id: id });
//     if (!category) {
//       return res.status(404).json({ msg: 'Category not found' });
//     }

//     const newCategory = {
//       type,
//       title,
//     };
//     await Category.findOneAndUpdate({ _id: id }, newCategory);

//     res.status(200).json({ msg: 'Category updated successfully' });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server Error');
//   }
// };

const update = async (req, res) => {
  // get my user id

  // banner

  const { title, genre, category, synopsis, trailer, releaseDate } = req.body;

  try {
    const movie = await Movies.findOne({ _id: req.params.id });
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    let banner = movie.banner;
    if (req.files.banner) {
      banner = req.files.banner[0].location;
    }
    let image = movie.image;
    if (req.files.image) {
      image = req.files.image[0].location;
    }
    const gallery = [];
    if (req.files.gallery) {
      req.files.gallery.forEach((element) => {
        gallery.push({
          type: 'image',
          url: element.location,
        });
      });
    }

    const newMovie = {
      title,
      genre,
      banner,
      image,
      $push: { gallery },
      category,
      synopsis,
      trailer,
      releaseDate,
    };

    let result = await Movies.findOneAndUpdate(
      { _id: req.params.id },
      newMovie
    );

    console.log(result);

    return res.status(200).json({ msg: 'Movie updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const archive = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movies.findOne({ _id: id });
    if (!movie) {
      return res.status(404).json({ msg: 'Movies not found' });
    }
    await Movies.findOneAndUpdate({ _id: id }, { status: false });

    // remove the id from the movieorder

    const movieorder = await MovieOrder.find({ movie: id });
    // // delete the movieorder
    movieorder.forEach((element) => {
      element.remove();
    });
    res.status(200).json({ msg: 'Movies archived successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const fetchStarCast = async (req, res) => {
  const { id } = req.params;
  try {
    const movies = await Movies.findOne({ _id: id }, 'starcast').populate(
      'starcast.cast',
      '-password -__v -role -createdAt -updatedAt'
    );
    if (!movies) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(200).json(movies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const addStarCast = async (req, res) => {
  const { id } = req.params;
  const { name, type, exist_id } = req.body;
  try {
    let image = '';
    if (req.file) {
      image = req.file.location;
    } else {
      image = '';
    }

    const movie = await Movies.findOne({ _id: id });
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }

    if (type === '1') {
      const cast = new Cast({
        name,
        image,
      });
      const res = await cast.save();
      // find a movie and update the id of the cast

      movie.starcast.push({
        cast: res._id,
      });
      await movie.save();
    } else {
      movie.starcast.push({
        cast: exist_id,
      });
      await movie.save();
    }

    //  push the cast id to the movie starcast array cast
    const movies = await Movies.findOne({ _id: id }, 'starcast').populate(
      'starcast.cast',
      '-password -__v -role -createdAt -updatedAt'
    );
    res.status(200).json(movies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const deleteStarCast = async (req, res) => {
  const { movie_id, cast_id } = req.params;
  try {
    // remove the cast from the movie
    const castremoved = await Movies.findOneAndUpdate(
      { _id: movie_id },
      { $pull: { starcast: { _id: cast_id } } }
    );
    if (!castremoved) {
      return res.status(404).json({ msg: 'Cast not found' });
    } else {
      res.status(200).json({
        msg: 'Cast removed successfully',
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// series cast

const fetchSeriesCast = async (req, res) => {
  const { id } = req.params;
  try {
    const movies = await Movies.findOne({ _id: id }, 'seriescast').populate(
      'seriescast.cast',
      '-password -__v -role -createdAt -updatedAt'
    );
    if (!movies) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(200).json(movies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const addSeriesCast = async (req, res) => {
  const { id } = req.params;
  const { name, type, exist_id, character, season } = req.body;
  console.log(req.body);
  try {
    let image = '';
    if (req.file) {
      image = req.file.location;
    } else {
      image = '';
    }

    const movie = await Movies.findOne({ _id: id });
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }

    if (type === '1') {
      const cast = new Cast({
        name,
        image,
      });
      const res = await cast.save();
      // find a movie and update the id of the cast

      movie.seriescast.push({
        cast: res._id,
        character,
        season,
      });
      await movie.save();
    } else {
      movie.seriescast.push({
        cast: exist_id,
        character,
        season,
      });
      await movie.save();
    }

    //  push the cast id to the movie seriescast array cast
    const movies = await Movies.findOne({ _id: id }, 'seriescast').populate(
      'seriescast.cast',
      '-password -__v -role -createdAt -updatedAt'
    );
    res.status(200).json(movies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const deleteSeriesCast = async (req, res) => {
  const { movie_id, cast_id } = req.params;
  try {
    // remove the cast from the movie
    const castremoved = await Movies.findOneAndUpdate(
      { _id: movie_id },
      { $pull: { seriescast: { _id: cast_id } } }
    );
    if (!castremoved) {
      return res.status(404).json({ msg: 'Cast not found' });
    } else {
      res.status(200).json({
        msg: 'Cast removed successfully',
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// const Production
const addProduction = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;

  try {
    const movie = await Movies.findOne({ _id: id });
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    movie.production.push({
      ...req.body,
    });
    await movie.save();
    res.status(200).json({ msg: 'Production added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// const other add
const addOther = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movies.findOne({ _id: id });
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    movie.other.push(...req.body);
    await movie.save();
    res.status(200).json({ msg: 'Other added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// delete image from movie
const deleteImage = async (req, res) => {
  const { id, image } = req.params;
  try {
    const movie = await Movies.findOne({ _id: id });
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    // remove a image from movie.gallery
    const removed = await Movies.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $pull: { gallery: { _id: image } },
      }
    );

    if (!removed) {
      return res.status(404).json({ msg: 'Image not found' });
    }
    res.status(200).send(removed);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Edit Other
const editOther = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movies.findOne({ _id: id });
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    // update the new other received from body
    const updated = await Movies.findOneAndUpdate(
      { _id: id },
      { $set: { other: req.body } }
    );

    await updated.save();
    res.status(200).json({ msg: 'Other added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Order View

const viewOrder = async (req, res) => {
  try {
    const movies = await MovieOrder.find({}).populate('movie');
    res.status(200).json(movies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Order Add
const addOrder = async (req, res) => {
  try {
    const { type, id } = req.body;
    const movie = await Movies.findOne({ _id: id });
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    const order = new MovieOrder({
      movie: id,
      type,
    });
    await order.save();

    // populate order
    const orderPopulated = await MovieOrder.findOne({
      _id: order._id,
    }).populate('movie');

    res.status(200).json(orderPopulated);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// delete movie order
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await MovieOrder.findOneAndDelete({ _id: id });
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }
    res.status(200).json({ msg: 'Movie order deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getData = async (req, res) => {
  const { type } = req.params;
  // get a genre distinct from movie model

  try {
    const genres = await Movies.distinct('genre', {
      status: true,
    });
    // remove duplicates using case insensitive
    const uniqueGenres = [
      ...new Set(genres.map((genre) => genre.toLowerCase())),
    ];

    // get a release year distinct from movie model production objects
    const releaseYears = await Movies.distinct('production.release_date', {
      status: true,
    });
    // convert these dates to years
    const years = releaseYears.map((date) => {
      // convert the string to date
      const dateObj = new Date(date);
      if (dateObj !== 'Invalid Date') {
        return dateObj.getFullYear();
      }
      // get the year
    });

    // remove duplicates
    const uniqueYears = [...new Set(years)];
    // sort the years
    const sortedYears = uniqueYears.sort((a, b) => {
      return a - b;
    });

    // get a language distinct from movie model production objects only if Movies status is true

    const languages = await Movies.distinct('production.language', {
      status: true,
    });
    // remove duplicates using case insensitive
    const uniqueLanguages = [
      ...new Set(languages.map((lang) => lang.toLowerCase())),
    ];

    // sort languages by alphabet
    const sortedLanguages = uniqueLanguages.sort((a, b) => {
      return a.localeCompare(b);
    });

    const data = {
      genres: uniqueGenres,
      years: sortedYears,
      languages: sortedLanguages,
    };

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error  ');
  }
};

module.exports = {
  add,
  view,
  getById,
  fetchStarCast,
  addStarCast,
  deleteStarCast,
  fetchSeriesCast,
  addSeriesCast,
  deleteSeriesCast,
  addProduction,
  addOther,
  editOther,
  archive,
  deleteImage,
  update,
  addOrder,
  viewOrder,
  deleteOrder,
  getData,
};
