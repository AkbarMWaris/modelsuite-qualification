const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateAvatar } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;