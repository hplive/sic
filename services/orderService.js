const axios = require('axios');
const mongoose = require('mongoose');
const parser = require('body-parser');

const Item = require('../models/item');
const Order = require('../models/order');
const Customer = require('../models/customer')
const Address = require('../models/address')

const OrderRepository = require('../repository/orderRepository');


const OrderDto = require('../Dtos/OrderDto');
const { State } = require('../models/order');

const uri = 'https://localhost:5001/api/order'; //to complete
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

exports.deleteOrder = async function (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    } else {
        await OrderRepository.DeleteOrder(id);
        return true;
    }
};

exports.getOrder = async function (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    } else {
        var order = await OrderRepository.GetById(id);

        if (order == null) {
            return false;
        } else {
            return new OrderDto(order._id, order.customer.name, order.address, order.items, order.totalPrice, order.state);
        }
    }
}

exports.getOrdersItems = async function (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    } else {
        return await OrderRepository.GetItems(id);
    }
};

exports.getItemsOrder = async function (id1, id2) {
    if (!mongoose.Types.ObjectId.isValid(id1) || !mongoose.Types.ObjectId.isValid(id2)) {
        return false;
    } else {
        var order= await OrderRepository.GetById(id1);
        if(order==null){
            return false;
        }else{
            let i;
            let items=order.items;
            for(i=0; i<items.length; i++){
                var item=items[i];
                if(item['_id']==id2){
                    return item;
                }
            }
            return null;
        }
    }
};

exports.createOrder = async function (body) {
    const received = getCustomer()
    var tmpCustomer;
    await received.then(async function (data) {
        tmpCustomer = data
    });
    let customer = Customer.createCustomer(tmpCustomer);
    let address = createAddress(body.address)
    var itemsList = body.items;
    let i;
    let items = [];
    let totelPrice=0;
    for (i = 0; i < itemsList.length; i++) {
        var parentItem = await isProductValid(itemsList[i]);
        if (parentItem == null) {
            return null;
        }
        var currentItem = itemsList[i];
        currentItem.price=parentItem.price;
        var p = createNewProduct(currentItem);
        totelPrice+=p.price;
        //parent product
        let stack = [currentItem];
        let schemas = [p];

        while (stack.length > 0) {
            var parent = stack.pop();

            if (parent.hasOwnProperty('children') && parent.children.length > 0) {

                let j;
                let childrenList = parent.children;
                for (j = 0; j < childrenList.length; j++) {
                    let child = childrenList[j];
                    var doesFit=productFit(parent, child)
                    if (!doesFit) {
                        return 'DontFit';
                    }

                    const cP = await isProductValid(child);

                    if (cP === null) {
                        return null;
                    }

                    if (cP == false) {
                        return false;
                    }
                    totelPrice+=cP.price;
                    let c = createNewProduct(child);
                    child.price=cP.price;
                    schemas.push(c);
                    stack.push(child);
                }
            }
        }
        items.push(p);
    }
    let order = createNewOrder(customer, address, items, totelPrice);
    saveItems(items);
    OrderRepository.SaveOrder(order);
    return new OrderDto(order._id, order.customer.name, order.address, order.item, order.totalPrice, order.state);
};

exports.productFit = function (parent, child) {
    if (child.width >= parent.width || child.height >= parent.height
        || child.depth >= parent.depth)
        {
            return false;
        }
    return true;
};
isProductValid = async function (product) {

    // var productUri = uri + product.productId;

    var newProduct = await axios.post(uri, product)
        .then(response => {
            return response.data;
        }).catch(error => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
            return null;
        });
    return newProduct;
};


getCustomer = async function () {
    var customer = await axios.get(uri)
        .then(response => {
            return response.data;
        }).catch(error => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
            return null;
        });

    return customer;
}
findItem = async function (parentId, id) {
    var parent = await ItemRepository.GetById(parentId);

    let stack = [parent._id];

    var list = [];
    while (stack.length > 0) {
        var pId = stack.pop();
        var cItem = await ItemRepository.GetById(pId);

        if (cItem.children.length > 0) {
            for (let child of cItem.children) {
                if (chid._id == id) {
                    return true;
                } else {
                    stack.push(child);
                }
            }
        }
    }

    return false;

};

getItem = async function (id, hasParent, toDelete) {

    var parent = await ItemRepository.GetById(id);

    let stack = [parent._id];

    var list = [];

    while (stack.length > 0) {
        var pId = stack.pop();
        var cItem = await ItemRepository.GetById(pId);

        var test = createItem(cItem);

        list.push(test);

        if (cItem.children.length > 0) {
            for (let child of cItem.children) {
                stack.push(child);
            }
        }
    }

    if (!hasParent) {
        list.shift();
    }

    if (toDelete) {
        await ItemRepository.DeleteItem(pId);
    }

    return list;
};

exports.createItem = function (item) {
    return new ItemDto(
        item.id,
        item.name,
        item.category,
        item.children,
        item.productId,
        item.material,
        item.finish,
        item.width,
        item.height,
        item.depth,
        item.price
    );
};

exports.createCustomer = function (customer) {
    let address = createAddress(customer.address)
    let c = new CustomerSchema({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: address
    })
    return c;
};
exports.createAddress = function (address) {
    let a = new Address({
        street: address.streetName,
        door: address.door,
        postalCodeCity: address.postalCodeCity,
        postalCodeStreet: address.postalCodeStreet
    })
    return a;
}
exports.createNewProduct = function (product) {

    let p = new Item(
        {
            productId: product.productId,
            material: product.material,
            category: product.category,
            finish: product.finishing,
            name: product.name,
            price: product.price,
            width: product.width,
            height: product.height,
            depth: product.depth,
            children: product.children,
        }
    );

    return p;
};

exports.createNewOrder = function (receivedCustomer, receivedAddress, receivedItems, receivedPrice) {

    let order = new Order(
        {
            customer: receivedCustomer,
            address: receivedAddress,
            totalPrice: receivedPrice,
            items: receivedItems,
            state: State.SUBMETIDA
        }
    )
    return order;
};
saveItems = function (items) {
    // let stack = [item];

    let i;
    for (i = 0; i < items.length; i++) {
        let item = items[i];

        console.log('\n saving...\n ' + item)

        ItemRepository.SaveItem(item);
    }

};

