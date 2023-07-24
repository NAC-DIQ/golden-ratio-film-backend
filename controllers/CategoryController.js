const Category = require('../models/category.model');

const add = async (req, res) => {
  // get my user id
  const createdBy = req.user.id;
  const { type, title } = req.body;
  try {
    const category = new Category({
      title,
      type,
      createdBy,
    });
    await category.save();
    res.status(201).json({ msg: 'Category added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const getAll = async (req, res) => {
  try {
    const categories = await Category.find(
      { status: true },
      '-status -__v'
    ).populate('createdBy', '-password -__v -role -createdAt -updatedAt');
    res.status(200).json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findOne(
      { _id: id },
      '-status -__v -createdAt -updatedAt -createdBy'
    );
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { type, title } = req.body;
  try {
    const category = await Category.findOne({ _id: id });
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    const newCategory = {
      type,
      title,
    };
    await Category.findOneAndUpdate({ _id: id }, newCategory);

    res.status(200).json({ msg: 'Category updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const archive = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findOne({ _id: id });
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    await Category.findOneAndUpdate({ _id: id }, { status: false });

    res.status(200).json({ msg: 'Category archived successfully' });
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
};
