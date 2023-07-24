const express = require('express');
const router = express.Router();
const { uploadFiles } = require('../../middlewares/uploadfile');

// controller
const TeamController = require('../../controllers/TeamController');
const auth = require('../../middlewares/auth');
const { teamValidation } = require('../../validations');

// Routes
router.post(
  '/',
  [auth, uploadFiles.single('image'), teamValidation.add],
  TeamController.addTeam
);
router.get('/', TeamController.getTeam);
router.get('/:id', [auth], TeamController.getTeamById);
router.patch(
  '/:id',
  [auth, uploadFiles.single('image')],
  TeamController.updateTeam
);
router.delete('/:id', [auth], TeamController.archiveTeamById);

module.exports = router;
