const News = require('../models/news.model');
const NewsOrder = require('../models/newsorder.model');

const add = async (req, res) => {
  // get my user id
  if (!req.file) return res.status(403).send({ error: 'No file uploaded' });
  const image = req.file.location;

  const createdBy = req.user.id;
  const { type, title, category, content } = req.body;
  try {
    const news = new News({
      title,
      type,
      category,
      content,
      image,
      createdBy,
    });
    await news.save();
    res.status(201).json({ msg: 'News added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const getAll = async (req, res) => {
  try {
    const news = await News.find({ status: true }, '-status -__v').populate(
      'createdBy category',
      '-password -__v -role -createdAt -updatedAt -status -type -createdBy '
    );
    res.status(200).json(news);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findOne(
      { _id: id },
      '-status -__v -createdAt -updatedAt '
    ).populate(
      'category createdBy',
      '-password -__v -role -createdAt -updatedAt -status -type -createdBy'
    );
    if (!news) {
      return res.status(404).json({ msg: 'News not found' });
    }
    res.status(200).json(news);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { type, title, category, content } = req.body;
  try {
    const news = await News.findOne({ _id: id });
    // if not present
    if (!news) {
      return res.status(404).json({ msg: 'Not Found' });
    }
    let image = '';
    if (req.file) {
      image = req.file.location;
    } else {
      image = news.image;
    }
    const newNews = {
      title,
      type,
      category,
      content,
      image,
    };
    await News.findOneAndUpdate({ _id: id }, newNews);

    res.status(200).json({ msg: 'News updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const archive = async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findOne({ _id: id });
    if (!news) {
      return res.status(404).json({ msg: 'News not found' });
    }
    await News.findOneAndUpdate({ _id: id }, { status: false });

    res.status(200).json({ msg: 'News archived successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const updateOrders = async (req, res) => {
  const { type } = req.params;

  try {
    // push the news ids from the body to the newsOrder array
    const newsIds = req.body.newsIds;

    // get the newsOrder object
    const newsOrder = new NewsOrder({
      type,
      news: newsIds,
    });
    await newsOrder.save();

    return res.status(200).json({ msg: 'News Order added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getOrders = async (req, res) => {
  const { type } = req.params;
  try {
    // get the newsOrder latest updated one
    const newsOrder = await NewsOrder.findOne({ type }, '-__v').sort({
      updatedAt: -1,
    });
    if (!newsOrder) {
      return res.status(404).json({ msg: 'News Order not found' });
    }
    const newsIds = newsOrder.news;
    const news = await News.find(
      { _id: { $in: newsIds }, status: true },
      '-status -__v'
    ).populate(
      'createdBy category',
      '-password -__v -role -createdAt -updatedAt -status -type -createdBy '
    );
    res.status(200).json(news);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  add,
  getAll,
  getById,
  update,
  archive,
  updateOrders,
  getOrders,
};
