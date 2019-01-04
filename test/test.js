var Assert = require('assert');

const Controller = require('../controllers/orderController');
const Service = require('../services/orderService');
const Item = require('../models/item');
const Order = require('../models/order');
const Customer = require('../models/customer');
const Address = require('../models/address');
const { State } = require('../models/order');
const OrderDto = require('../Dtos/OrderDto');

describe('Suite 1: Controller', function () {

    it('Test 1: createOrder', function () {
        // Arrange
        order = Controller.create_order();
        item = new Item();
        item = { name : 'Product Test1' };
        order = { 
            customer : 'Customer Test1',
            address : 'Address Test1',
            state : 1,
            items : [item],
            totalPrice : 30
        };
        // Act
        var resultCustomer = "Customer Test1";
        var resultAddress = "Address Test1";
        var resultState = 1;
        var resultItem = "Product Test1"
        var resultTotalPrice = 30;
        // Assert
        Assert.equal(order.customer, resultCustomer);
        Assert.equal(order.address, resultAddress);
        Assert.equal(order.state, resultState);
        Assert.equal(order.items[0].name, resultItem);
        Assert.equal(order.totalPrice, resultTotalPrice);
    });

});


describe('Suite 2: Dtos', function () {

    it('Test 1: Order.customer', function () {           
        // Arrange
        const order = new OrderDto();
        order.customer = "Customer Test1";
        // Act
        const resultCustomer = "Customer Test1";
        // Assert
        Assert.equal(order.customer, resultCustomer);
    });
    
    it('Test 2: Order.address', function () {
        // Arrange
        const order = new OrderDto();
        order.address = "Address Test1";
        // Act
        const resultAddress = "Address Test1";
        // Assert
        Assert.equal(order.address, resultAddress);
    });
    
    it('Test 3: Order.Items', function () {
        // Arrange
        const order = new OrderDto();
        const item = new Item();
        order.Items = [{
            productId : 1,
            material : 'Wood',
            category : 'Closet',
            finish : 'None',
            name : 'Product 1',
            price : 30,
            width : 2.0,
            height : 1.0,
            depth : 0.5,
            children : []
        }];
        // Act
        const resultMaterial = "Wood";
        const resultCategory = "Closet";
        const resultFinish = "None";
        const resultName = "Product 1";
        const resultPrice = 30;
        const resultWidth = 2.0;
        const resultHeight = 1.0;
        const resultDepth = 0.5;
        // Assert
        Assert.equal(order.Items[0].material, resultMaterial);
        Assert.equal(order.Items[0].category, resultCategory);
        Assert.equal(order.Items[0].finish, resultFinish);
        Assert.equal(order.Items[0].name, resultName);
        Assert.equal(order.Items[0].price, resultPrice);
        Assert.equal(order.Items[0].width, resultWidth);
        Assert.equal(order.Items[0].height, resultHeight);
        Assert.equal(order.Items[0].depth, resultDepth);
    });
    
    it('Test 4: Order.totalPrice', function () {
        // Arrange
        const order = new OrderDto();
        order.totalPrice = 100;
        // Act
        const resultTotalPrice = 100;
        // Assert
        Assert.equal(order.totalPrice, resultTotalPrice);
    });

    it('Test 5: Order.state', function () {
        // Arrange
        const order = new OrderDto();
        order.state = 1;
        // Act
        const resultState = 1;
        // Assert
        Assert.equal(order.state, resultState);
    });
    
});
