const { default: axios } = require('axios');
const Social = require('../models/social.model');

const add = async (req, res) => {
  // get my user id
  const createdBy = req.user.id;
  const { url, type } = req.body;

  if (!req.file) return res.status(403).send({ error: 'No file uploaded' });
  const image = req.file.location;
  try {
    const social = new Social({
      url,
      image,
      type,
      createdBy,
    });
    await social.save();
    res.status(201).json({ msg: 'Social added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const getAll = async (req, res) => {
  try {
    const socials = await Social.find(
      { status: true },
      '-status -__v'
    ).populate('createdBy', '-password -__v -role -createdAt -updatedAt');
    res.status(200).json(socials);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const social = await Social.findOne(
      { _id: id },
      '-status -__v -createdAt -updatedAt -createdBy'
    );
    if (!social) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(200).json(social);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { type, url } = req.body;
  try {
    const social = await Social.findOne({ _id: id });
    // if not present
    if (!social) {
      return res.status(404).json({ msg: 'Not Found' });
    }
    let image = '';
    if (req.file) {
      image = req.file.location;
    } else {
      image = social.image;
    }
    const newSocial = {
      type,
      url,
      image,
    };
    await Social.findOneAndUpdate({ _id: id }, newSocial);

    res.status(200).json({ msg: 'Social updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const archive = async (req, res) => {
  const { id } = req.params;
  try {
    const social = await Social.findOne({ _id: id });
    if (!social) {
      return res.status(404).json({ msg: 'Social not found' });
    }
    await Social.findOneAndUpdate({ _id: id }, { status: false });

    res.status(200).json({ msg: 'Social archived successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getFacebook = async (req, res) => {
  try {
    // const url = `https://graph.facebook.com/me?fields=id,name,posts{full_picture}&access_token=EAAOkf3RweuMBANJ3z9hKFqx6tUIqUMgfaj4Cdh7kVzoluEgAnWM8OND0MYuU3GluYUwiDXOARpq3uA6ncxoSb0d1zoNsmoTYsZC1vyCHqZCLPOz4CeCvZAdJmha21trcVZCtJa0aGBvoS02ZBfkOvmH8c8TJZCxhvNpHr7W1r0Hc1psRQHoS12kZA8hLSB99h2fR5J6zzHjvWBsZBs5T76Xi`;
    const url = `https://graph.facebook.com/me?fields=id,name,posts{full_picture}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`;
    const response = await axios.get(url);

    console.log(response);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getTwitter = async (req, res) => {
  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');

    // console.log(error.response.data);
  }
};

module.exports = {
  add,
  getAll,
  getById,
  update,
  archive,
  getFacebook,
  getTwitter,
};
