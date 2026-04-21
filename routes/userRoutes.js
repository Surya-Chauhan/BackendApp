const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const {getUsers, postUsers, signin} = require('../controllers/userControllers');
const { protect, adminOnly } = require("../middleware/authMiddleware");
router.get('/users',protect,adminOnly, getUsers);
router.post('/users',upload.single("pic"), postUsers);
router.post('/users/signin', signin);
module.exports = router;