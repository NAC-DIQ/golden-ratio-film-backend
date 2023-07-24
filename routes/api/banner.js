const express = require('express');
const router = express.Router();
const { uploadFiles } = require('../../middlewares/uploadfile');

// controller
const BannerController = require('../../controllers/BannerController');
const auth = require('../../middlewares/auth');
// const { teamValidation } = require('../../validations');

// Routes
// router.post('/', [auth, uploadFiles.single('image')], CastController.add);
router.post('/', [auth, uploadFiles.single('image')], BannerController.add);
router.get('/', BannerController.getBanner);

router.post(
  '/about',
  [auth, uploadFiles.single('image')],
  BannerController.aboutadd
);
router.get('/about', BannerController.aboutgetBanner);
router.get('/about/content', BannerController.getAboutContent);
router.post('/about/content', BannerController.changeAboutContent);

// router.get('/:id', [auth], CastController.getById);
// router.patch(
//   '/:id',
//   [auth, uploadFiles.single('image')],
//   CastController.update
// );
router.delete('/:id', [auth], BannerController.archive);

module.exports = router;
