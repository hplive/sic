var Assert = require('assert');
const Service = require('../services/orderService');
const Item = require('../models/item');
const Order = require('../models/order');
const Customer = require('../models/customer')
const Address = require('../models/address')
const { State } = require('../models/order');

describe('Order Suite 1', function () {
    var street1= '1st avenue';
    var door1=1;
    var postalCodeCity1= 4100;
    var postalCodeStreet1= 10;
    var newAddress;
    var newCustomer;
    var newProduct;
    var totalPrice;
    var newOrder;
    it('Test 1: createAddress', function (){
        var jSonAddress=
        {
            street:street1,
            door:door1,
            postalCodeCity:postalCodeCity1,
            postalCodeStreet:postalCodeStreet1
        }
        newAddress=Service.createAddress(jSonAddress);
        Assert.equal(jSonAddress.street, newAddress.street);
        Assert.equal(jSonAddress.door, newAddress.door);
        Assert.equal(jSonAddress.postalCodeCity, newAddress.postalCodeCity);
        Assert.equal(jSonAddress.postalCodeStreet, newAddress.postalCodeStreet);
    });
    it('Test 2: createCustomer', function () {
        var name1= 'Customer 1';
        var email1="first@customer,com";
        var phone1=919191919;
        var address1=
        {
            street:street1,
            door:door1,
            postalCodeCity:postalCodeCity1,
            postalCodeStreet:postalCodeStreet1
        }
        var customer=
        {
            name:name1,
            email:email1,
            phone:phone1,
            address:address1
        }

        newCustomer=Service.createCustomer(customer);

        Assert.equal(customer.name, newCustomer.name);
        Assert.equal(customer.email, newCustomer.email);
        Assert.equal(customer.phone, newCustomer.phone);
    });
    it('Test 3: createNewProduct', function () {
        var product=
        {
            productId:1,
            material:'Wood',
            category:'Closet',
            finish: 'None',
            name: 'Product 1',
            price:30,
            width:2.0,
            height:1.0,
            depth:0.5,
            children: []
        }

        newProduct=Service.createNewProduct(product2);
        Assert.equal(product.productId, newProduct.productId);
        Assert.equal(product.material, newProduct.material);
        Assert.equal(product.category, newProduct.category);
        Assert.equal(product.finish, newProduct.finish);
        Assert.equal(product.name, newProduct.name);
        Assert.equal(product.price, newProduct.price);
        Assert.equal(product.width, newProduct.width);
        Assert.equal(product.height, newProduct.height);
        Assert.equal(product.depth, newProduct.depth);
        Assert.equal(product.children, newProduct.children);
    });

    it('Test 4: CreateNewOrder', function () {
        var order=
        {
            customer:newCustomer,
            address:newAddress,
            totalPrice:totalPrice,
            items: [newProduct]
        }
        newOrder=Service.createNewOrder(order);

        Assert.equal(order.customer, newOrder.customer);
        Assert.equal(order.address, newOrder.address);
        Assert.equal(order.totalPrice, newOrder.totalPrice);
        Assert.equal(order.items, newOrder.items);
        Assert.equal(order.state, State.SUBMETIDA);
    });

    it('Test 5: ProductFit', function (){
        var productLeast=
        {
            productId:1,
            material:'Wood',
            category:'Closet',
            finish: 'None',
            name: 'Product 1',
            price:30,
            width:2.0,
            height:1.0,
            depth:0.5,
            children: []
        }
        var productBiggest=
        {
            productId:1,
            material:'Wood',
            category:'Closet',
            finish: 'None',
            name: 'Product 1',
            price:30,
            width:3.0,
            height:2.0,
            depth:1.5,
            children: []
        }

        var expResult=true;
        var result=Service.productFit(productBiggest, productLeast);
        Assert.equal(expResult, result);

        expResult=false;
        result=Service.productFit(productLeast, productBiggest);
        Assert.equal(expResult, result);
    });
});