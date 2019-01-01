const axios = require('axios');
const mongoose = require('mongoose');
const parser = require('body-parser');

const Item = require('../models/item');
const Order = require('../models/order');
const Customer = require('../models/customer')
const Address = require('../models/address')

const ItemRepository = require('../repository/itemRepository');
const OrderRepository = require('../repository/orderRepository');


const ItemDto = require('../Dtos/ItemDto');
const OrderDto = require('../Dtos/OrderDto');
const OrderAndItemDto = require('../Dtos/OrderAndItemsDto');
const ItemOfItemDto = require('../Dtos/ItemsOfItemDto');
const { State } = require('../models/order');

const uri = 'https://localhost:5001/api/order'; //to complete
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

exports.deleteOrder = async function (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    } else {
        var order = await OrderRepository.DeleteOrder(id);

        if (order === null) {
            return false;
        } else {
            await getItem(order.item, false, true);
            return true;
        }
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

exports.getOrderItems = async function (id) {
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
        var order = await OrderRepository.GetById(id);

        if (order == null) {
            return false;
        } else {
            var item = await ItemRepository.GetById(id2);

            if (item === null) {
                return null;
            } else {
                if (! await findItem(item._id, req.params.itemId)) {
                    return null;
                }
                var list = await getItem(item._id, false, false);

                return (new ItemOfItemDto(item._id, list));
            }
        }
    }
};

exports.createOrder = async function (body) {
    const received = getCustomer()
    var tmpCustomer;
    await received.then(async function (data) {
        tmpCustomer = data
    });
    let customer = createCustomer(tmpCustomer)
    let address = createAddress(body.address)
    var itemsList = body.items;
    let i;
    let items = [];
    for (i = 0; i < itemsList.length; i++) {
        var parentItem = await isProductValid(itemsList[i]);
        if (parentItem == null) {
            return null;
        }
        var currentItem = itemsList[i];
        var p = createNewProduct(currentItem);
        //parent product
        let stack = [currentItem];
        let schemas = [p];

        while (stack.length > 0) {
            var parentSchema = schemas.pop();
            var parent = stack.pop();

            if (parent.hasOwnProperty('children') && parent.children.length > 0) {

                let j;
                let childrenList = parent.children;
                for (j = 0; j < childrenList.length; j++) {
                    let child = childrenList[j];
                    if (child.width >= parent.width || child.height >= parent.height
                        || child.depth >= parent.depth) {
                        return 'DontFit';
                    }

                    const cP = await isProductValid(child);

                    if (cP === null) {
                        return null;
                    }

                    if (cP == false) {
                        return false;
                    }

                    let c = createNewProduct(child);

                    child["productId"] = cP.id

                    schemas.push(c);
                    stack.push(child);
                }
            }
        }
        items.push(p);
    }
    let order = createNewOrder(customer, address, items);
    saveItems(items);
    OrderRepository.SaveOrder(order);
    return new OrderDto(order._id, order.customer.name, order.address, order.item, order.totalPrice, order.state);
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

createItem = function (item) {
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

createCustomer = function (customer) {
    let address = createAddress(customer.address)
    let c = new Customer({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: address
    })
    return c;
}

createAddress = function (address) {
    let a = new Address({
        street: address.streetName,
        door: address.door,
        postalCodeCity: address.postalCodeCity,
        postalCodeStreet: address.postalCodeStreet
    })
    return a;
}
createNewProduct = function (product) {

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

createNewOrder = function (receivedCustomer, receivedAddress, receivedItems) {
    total = 0;
    let i;
    for (i = 0; i < receivedItems.length; i++) {
        total += receivedItems[i].price;

    }
    let order = new Order(
        {
            customer: receivedCustomer,
            address: receivedAddress,
            totalPrice: total,
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

