const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

router.post("/", OrderController.create_order);
router.get("/:id", OrderController.get_order);
router.get("/", OrderController.get);
router.get("/:id/items", OrderController.get_orders_items);
router.get("/:id/items/:itemId", OrderController.get_items_order);
router.delete("/:id",OrderController.delete_order);

module.exports = router;