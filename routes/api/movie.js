const express = require('express');
const router = express.Router();
const { uploadFiles } = require('../../middlewares/uploadfile');

// controller
const MovieController = require('../../controllers/MovieController');
const CastController = require('../../controllers/CastController');
const auth = require('../../middlewares/auth');
// const { teamValidation } = require('../../validations');

// Routes
router.post(
  '/',
  [
    auth,
    uploadFiles.fields([
      {
        name: 'banner',
        maxCount: '1',
      },
      {
        name: 'image',
        maxCount: '1',
      },
      {
        name: 'gallery',
        maxCount: '10',
      },
      // add a starcast array of image
      {
        name: 'starcastimage',
        maxCount: '100',
      },
    ]),
  ],
  MovieController.add
);
router.get('/', MovieController.view);
router.get('/starcast/:id', [auth], MovieController.fetchStarCast);
router.post(
  '/starcast/:id',
  [auth, uploadFiles.single('image')],
  MovieController.addStarCast
);
router.delete(
  '/starcast/:movie_id/:cast_id',
  [auth],
  MovieController.deleteStarCast
);
router.get('/seriescast/:id', [auth], MovieController.fetchSeriesCast);
router.post(
  '/seriescast/:id',
  [auth, uploadFiles.single('image')],
  MovieController.addSeriesCast
);
router.delete(
  '/seriescast/:movie_id/:cast_id',
  [auth],
  MovieController.deleteSeriesCast
);
router.post('/production/:id', [auth], MovieController.addProduction);
router.post('/other/:id', [auth], MovieController.addOther);
router.patch('/other/:id', [auth], MovieController.editOther);

router.get('/:id', MovieController.getById);
router.patch(
  '/:id',
  [
    auth,
    uploadFiles.fields([
      {
        name: 'banner',
        maxCount: '1',
      },
      {
        name: 'image',
        maxCount: '1',
      },
      {
        name: 'gallery',
        maxCount: '10',
      },
    ]),
  ],
  MovieController.update
);
router.delete('/:id', [auth], MovieController.archive);

router.delete('/gallery/:id/:image', [auth], MovieController.deleteImage);

router.get('/order/view', MovieController.viewOrder);
router.post('/order/add', [auth], MovieController.addOrder);
router.delete('/order/delete/:id', [auth], MovieController.deleteOrder);

router.get('/data/filter', MovieController.getData);

module.exports = router;
