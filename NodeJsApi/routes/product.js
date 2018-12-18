const express = require('express');
const router = express.Router();

const product_controller = require('../controllers/productController');

router.get("/test", product_controller.test);
router.post('/create', product_controller.product_create);
router.put('/:id/update', product_controller.product_update);

module.exports = router;