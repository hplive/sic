const axios = require('axios');
const mongoose = require('mongoose');


const Item = require('../models/item');
const Order = require('../models/order');

const ItemRepository = require('../repository/itemRepository');
const OrderRepository = require('../repository/orderRepository');


const ItemDto = require('../Dtos/ItemDto');
const OrderDto = require('../Dtos/OrderDto');
const OrderAndItemDto = require('../Dtos/OrderAndItemsDto');
const ItemOfItemDto = require('../Dtos/ItemsOfItemDto');
const { State } = require('../models/order');

const uri = 'https://nucleocs.azurewebsites.net/api/product/'; //to complete
const restriction_uri = 'https://nucleocs.azurewebsites.net/api'; //to complete
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

exports.deleteOrder = async function(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    } else {
        var order = await OrderRepository.DeleteOrder(id);

        if(order === null) {
            return false;
        } else {
            await getItem(order.item, false, true);
            return true;
        }
    }
};

exports.getOrder = async function(id) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    } else {
        var order = await OrderRepository.GetById(id);

        if(order == null) {
            return false;
        } else {
            return new OrderDto(order._id, order.item);
        }
    }
}

exports.getOrderItems = async function(id) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    } else {
        var order = await OrderRepository.GetById(id);

        if(order == null) {
            return false;
        } else {
            var list = await getItem(order.item, true, false);

            var dto = new OrderAndItemDto(order._id, list);

            return dto;
        }
    }
};

exports.getItemsOrder = async function(id1,id2) {
    if (!mongoose.Types.ObjectId.isValid(id1) || !mongoose.Types.ObjectId.isValid(id2)) {
        return false;
    } else {
        var order = await OrderRepository.GetById(id);

        if(order == null) {
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

                return(new ItemOfItemDto(item._id, list));
            }
        }
    }
};

exports.createOrder = async function(body) {
    var customer=body.customer;
    var address=body.address;
    var parentItem = body.item;

    var parentProduct = await isProductValid(parentItem);
/*
    if (parentProduct == false) {
        return false;
    }
*/
    if (parentProduct == null) {
        return null;
    }

   // parentItem["productId"] = parentProduct.id;
    var p = createNewProduct(parentProduct);

    //parent product
    let stack = [parentItem];
    let schemas = [p];

    while (stack.length > 0) {
        var parentSchema = schemas.pop();
        var parent = stack.pop();

        if (parent.hasOwnProperty('children') && parent.children.length > 0) {


            for (let child of parent.children) {

                if (child.dimension.width > parent.dimension.width || child.dimension.height > parent.dimension.height
                     || child.dimension.depth > parent.dimension.depth) {
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

                parentSchema.children = [...parentSchema.children, c];

                schemas.push(c);
                stack.push(child);
            }
        }
    }

    let order = createNewOrder(customer, address, items);

    saveItems(p);

    OrderRepository.SaveOrder(order);

    return new OrderDto(order._id, order.item);
};
/*
validateData = function (product, item) {

    if(product.materialsAndFinishes.includes(item.material) === false) {
        return false;
    }

    if (product.heightPossibleValues.isDiscrete) {
        if (product.heightPossibleValues.values.includes(item.height) === false) {
            return false;
        }
    } else {
        if (!(product.heightPossibleValues.values[0] <= item.height <= product.heightPossibleValues.values[1])) {
            return false;
        }
    }

    if (product.widthPossibleValues.isDiscrete) {
        if (product.widthPossibleValues.values.includes(item.width) === false) {
            return false;
        }
    } else {
        if (!(product.widthPossibleValues.values[0] <= item.width <= product.widthPossibleValues.values[1])) {
            return false;
        }
    }

    if (product.depthPossibleValues.isDiscrete) {
        if (product.depthPossibleValues.values.includes(item.depth) === false) {
            return false;
        }
    } else {
        if (!(product.depthPossibleValues.values[0] <= item.depth <= product.depthPossibleValues.values[1])) {
            return false;
        }
    }
    return true;
};
*/

isProductValid = async function (product) {

    var productUri = uri + product.productId;

    var newProduct = await axios.get(productUri).then(response => {
        return response.data;
    }).catch(error => {
        return null;
    });
/*
    if (newProduct == null) {
        return null;
    }

    if (!validateData(newProduct, product)) {
        return false;
    }
*/
    return newProduct;
};



findItem = async function(parentId, id) {
    var parent = await ItemRepository.GetById(parentId);

    let stack = [parent._id];

    var list = [];
    while(stack.length > 0) {
        var pId = stack.pop();
        var cItem = await ItemRepository.GetById(pId);

        if(cItem.children.length > 0) {
            for (let child of cItem.children) {
                if(chid._id == id) {
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

    if(toDelete) {
        await ItemRepository.DeleteItem(pId);
    }

    return list;
};

createItem = function (item) {
    return new ItemDto(
        item.id,
        item.name,
        item.price,
        item.category,
        item.children,
        item.productId,
        item.material,
        item.finish,
        item.dimension
        );
};

createNewProduct = function (product) {

    let p = new Item(
        {
            productId: product.productId,
            material: product.material,
            finish: finish,
            category: product.category,
            name: product.name,
            price: product.price,
            dimension: product.dimension,
            children: product.children
        }
    );

    return p;
};

createNewOrder = function (receivedCustomer, receivedAddress, receivedItems){
    total=0;
    for(let it of receivedItems){
        total+=it.price;
    }
    let order= new Order(
        {
            customer=receivedCustomer,
            address=receivedAddress,
            totalPrice=total,
            items=receivedItems,
            state=State.SUBMETIDA
        }
    )
    return order;
};
saveItems = function (item) {
    let stack = [item];

    console.log(item)

    while (stack.length > 0) {
        i = stack.pop();

        if (i.children.length > 0) {
            for (let child of i.children) {
                stack = [...stack, child];
            }
        }

        ItemRepository.SaveItem(i);
    }

};

