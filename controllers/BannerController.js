const AboutBanner = require('../models/aboutbanner.model');
const AboutContent = require('../models/aboutcontent.model');
const Banner = require('../models/banner.model');
const UserVisit = require('../models/uservisits.model');

const add = async (req, res) => {
  // get my user id
  const createdBy = req.user.id;
  if (!req.file) return res.status(403).send({ error: 'No file uploaded' });
  // const image = process.env.APP_URL + '/public/' + req.file.filename;
  const image = req.file.location;

  try {
    const banner = new Banner({
      image,
    });
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getBanner = async (req, res) => {
  try {
    const banner = await Banner.find({ status: true }, '-status -__v').populate(
      'createdBy'
    );

    // get a UserVist object and if nothing present add new one
    const userVisit = await UserVisit.findOne({});
    if (!userVisit) {
      const newUserVisit = new UserVisit({
        count: 1,
      });
      await newUserVisit.save();
    } else {
      // increment the count
      await UserVisit.findOneAndUpdate({}, { $inc: { count: 1 } });
    }

    res.status(200).json(banner);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const archive = async (req, res) => {
  const { id } = req.params;
  try {
    const cast = await Banner.findOne({ _id: id });
    if (!cast) {
      return res.status(404).json({ msg: 'Banner not found' });
    }
    await Banner.findOneAndUpdate({ _id: id }, { status: false });

    res.status(200).json({ msg: 'Banner archived successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const aboutadd = async (req, res) => {
  // get my user id
  const createdBy = req.user.id;
  if (!req.file) return res.status(403).send({ error: 'No file uploaded' });
  // const image = process.env.APP_URL + '/public/' + req.file.filename;
  const image = req.file.location;

  const { type } = req.body;
  try {
    const banner = new AboutBanner({
      type,
      image,
    });
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const aboutgetBanner = async (req, res) => {
  try {
    // const banner = await Banner.findOne(
    //   { status: true },
    //   '-status -__v'
    // ).populate('createdBy');

    // get a last added banner

    const banner = await AboutBanner.findOne(
      { status: true },
      {},
      { sort: { createdAt: -1 } }
    );

    res.status(200).json(banner);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getAboutContent = async (req, res) => {
  try {
    const AboutContentData = await AboutContent.findOne();

    res.status(200).json(AboutContentData);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};
const changeAboutContent = async (req, res) => {
  const { content } = req.body;
  try {
    const ExistingAboutContent = await AboutContent.findOne();
    if (!ExistingAboutContent) {
      const newAboutContent = new AboutContent({
        content,
      });
      await newAboutContent.save();
    } else {
      await AboutContent.findOneAndUpdate({}, { content });
    }
    res.status(200).json({ msg: 'About Content changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  add,
  getBanner,
  archive,
  aboutadd,
  aboutgetBanner,
  getAboutContent,
  changeAboutContent,
};
