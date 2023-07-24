const Banner = require('../models/banner.model');
const Cast = require('../models/cast.model');
const Category = require('../models/category.model');
const Movies = require('../models/movies.model');
const News = require('../models/news.model');
const Social = require('../models/social.model');
const Team = require('../models/team.model');
const UserVisit = require('../models/uservisits.model');

const getInfo = async (req, res) => {
  try {
    // get Banner Count
    const bannerCount = await Banner.countDocuments({ status: true });
    // Get a UserVisit
    const userVisit = await UserVisit.findOne({});
    // get Cast Count
    const castCount = await Cast.countDocuments({ status: true });
    // get Category Count
    const categoryCount = await Category.countDocuments({ status: true });
    // get Movie Count
    const movieCount = await Movies.countDocuments({ status: true });
    // get News Count
    const newsCount = await News.countDocuments({ status: true });
    // get Social Count
    const socialCount = await Social.countDocuments({ status: true });
    // get Team Count
    const teamCount = await Team.countDocuments({ status: true });
    // get News sort by createdAt time
    const news = await News.find({ status: true })
      .sort({ createdAt: -1 })
      .limit(5);
    // get Social
    const social = await Social.find({ status: true })
      .sort({ createdAt: -1 })
      .limit(5);

    // create a new object
    const info = {
      bannerCount,
      userVisit: userVisit ? userVisit.count : 0,
      castCount,
      categoryCount,
      movieCount,
      newsCount,
      socialCount,
      teamCount,
      news,
      social,
    };
    res.send(info);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getInfo,
};
