const Team = require('../models/team.model');

const addTeam = async (req, res) => {
  if (!req.file) return res.status(403).send({ error: 'No file uploaded' });
  const image = req.file.location;
  const { name, designation, content, linkedin, type } = req.body;
  try {
    const team = new Team({
      name,
      designation,
      content,
      linkedin,
      image,
      type,
    });
    await team.save();
    res.status(201).json({ msg: 'Team added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getTeam = async (req, res) => {
  try {
    // get all team data where status true and show without status and _v
    const team = await Team.find({ status: true }, '-status -__v');
    res.status(200).json(team);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getTeamById = async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Team.findOne({ _id: id }, '-status -__v');
    // if not present
    if (!team) {
      return res.status(404).json({ msg: 'Not Found' });
    }
    res.status(200).json(team);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name, designation, content, linkedin, type } = req.body;
  try {
    const team = await Team.findOne({ _id: id });
    // if not present
    if (!team) {
      return res.status(404).json({ msg: 'Not Found' });
    }
    let image = '';
    if (req.file) {
      image = req.file.location;
    } else {
      image = team.image;
    }
    const newTeam = {
      name,
      designation,
      content,
      linkedin,
      type,
      image,
    };
    await Team.findOneAndUpdate({ _id: id }, newTeam);

    res.status(200).json({ msg: 'Team updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const archiveTeamById = async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Team.findOne({ _id: id });
    // if not present
    if (!team) {
      return res.status(404).json({ msg: 'Not Found' });
    }
    if (!team.status) {
      return res.status(404).json({ msg: 'Not Found' });
    }

    await Team.findOneAndUpdate({ _id: id }, { status: false });
    res.status(200).json({ msg: 'Team archived successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  addTeam,
  getTeam,
  getTeamById,
  updateTeam,
  archiveTeamById,
};
