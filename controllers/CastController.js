const Cast = require('../models/cast.model');

const add = async (req, res) => {
  // get my user id
  const createdBy = req.user.id;
  if (!req.file) return res.status(403).send({ error: 'No file uploaded' });
  const image = req.file.location;

  const { name } = req.body;
  try {
    const cast = new Cast({
      name,
      image,
    });
    await cast.save();
    res.status(201).json({ msg: 'Cast added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const getCast = async (req, res) => {
  try {
    const casts = await Cast.find({ status: true }, '-status -__v').populate(
      'createdBy',
      '-password -__v -role -createdAt -updatedAt'
    );
    res.status(200).json(casts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const cast = await Cast.findOne(
      { _id: id },
      '-status -__v -createdAt -updatedAt -createdBy'
    );
    if (!cast) {
      return res.status(404).json({ msg: 'Cast not found' });
    }
    res.status(200).json(cast);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const cast = await Cast.findOne({ _id: id });
    if (!cast) {
      return res.status(404).json({ msg: 'Cast not found' });
    }

    let image = '';
    if (req.file) {
      image = req.file.location;
    } else {
      image = cast.image;
    }

    const newCast = {
      name,
      image,
    };
    await Cast.findOneAndUpdate({ _id: id }, newCast);

    res.status(200).json({ msg: 'Cast updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const archive = async (req, res) => {
  const { id } = req.params;
  try {
    const cast = await Cast.findOne({ _id: id });
    if (!cast) {
      return res.status(404).json({ msg: 'Cast not found' });
    }
    await Cast.findOneAndUpdate({ _id: id }, { status: false });

    res.status(200).json({ msg: 'Cast archived successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  add,
  getCast,
  getById,
  update,
  archive,
};
