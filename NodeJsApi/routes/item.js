const express = require('express');
const router = express.Router();

const order_controller = require('../controllers/itemController');

router.get("/:id", order_controller.GetProductById);

module.exports = router;