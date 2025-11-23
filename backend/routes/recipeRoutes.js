const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', auth, upload.array('images', 5), recipeController.createRecipe);
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', auth, recipeController.updateRecipe);
router.delete('/:id', auth, recipeController.deleteRecipe);
router.post('/:id/like', auth, recipeController.likeRecipe);

module.exports = router;