const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
router.use(require("./pingRoutes"));
router.use(require("./userRoutes"));
router.use(protect);
router.use(require("./jobRoutes"));
module.exports = router;
