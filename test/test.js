var assert = require('assert');

const Order = require('../Dtos/OrderDto');
const Item = require('../Dtos/ItemDto');

describe('Order Suite 1', function () {

    it('Test 1: Order.totalPrice', function () {
        // Arrange
        const order = new Order();
        order.totalPrice = 100;
        // Act
        const resultTotalPrice = 100;
        // Assert
        assert.equal(order.totalPrice, resultTotalPrice);
    });

    it('Test 1: Item.Price', function () {
        // Arrange
        const item = new Item();
        item.price = 100;
        // Act
        const resultPrice = 100;
        // Assert
        assert.equal(item.price, resultPrice);
    });

});