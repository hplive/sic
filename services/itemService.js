const axios = require('axios');
const mongoose = require('mongoose');


const Item = require('../models/item');
const Order = require('../models/order');

const ItemRepository = require('../repository/itemRepository');
const OrderRepository = require('../repository/orderRepository');


const ItemRestrictionDto = require('../Dtos/ItemRestrictionDto');
const ItemDto = require('../Dtos/ItemDto');
const OrderDto = require('../Dtos/OrderDto');
const OrderAndItemDto = require('../Dtos/OrderAndItemsDto');
const ItemOfItemDto = require('../Dtos/ItemsOfItemDto');


const uri = 'https://andrearmarios.azurewebsites.net/api/product/';
const restriction_uri = 'https://andrearmarios.azurewebsites.net/api/product/check';
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
    var parentItem = body.item;

    var parentProduct = await isProductValid(parentItem);

    if (parentProduct == false) {
        return false;
    }

    if (parentProduct == null) {
        return null;
    }

    parentItem["productId"] = parentProduct.id
    
    var p = createNewProduct(parentItem);

    //parent product
    let stack = [parentItem];
    let schemas = [p];

    while (stack.length > 0) {
        var parentSchema = schemas.pop();
        var parent = stack.pop();

        if (parent.hasOwnProperty('children') && parent.children.length > 0) {

            var listMandatory = await mandatoryItems(parent.productId);

            if(listMandatory == null) {
                console.log('mand');
                return null;
            }

            for (let child of parent.children) {

                if (child.width > parent.width || child.height > parent.height || child.depth > parent.depth) {
                    return 'child';
                }

                const area = child.width * child.height;

                if(parentSchema.area - area < 0) {
                    return 'DontFit';
                } 

                parentSchema.area = parentSchema.area - area;

                const cP = await isProductValid(child);
                
                if (cP === null) {
                    return null;
                }

                if (cP == false) {
                    return false;
                }

                let c = createNewProduct(child);
                
                child["productId"] = cP.id

                let check = await validateRestriction(parent, child);
                if (check == false) {
                    return 'bad';
                }   

                const index = listMandatory.indexOf(child.productId);

                if(index != -1) {
                    listMandatory.splice(index,1);
                }

                parentSchema.children = [...parentSchema.children, c];

                schemas.push(c);
                stack.push(child);
            }

            if(listMandatory.length > 0) {
                return 'mandatory';
            }
        }
    }

    let order = new Order({
        item: p
    });

    saveItems(p);

    OrderRepository.SaveOrder(order);

    return new OrderDto(order._id, order.item);
};

validateData = function (product, data) {

    if(product.materialsAndFinishes.includes(data.material) === false) {
        return false;
    }

    if (product.heightPossibleValues.isDiscrete) {
        if (product.heightPossibleValues.values.includes(data.height) === false) {
            return false;
        }
    } else {
        if (!(product.heightPossibleValues.values[0] <= data.height <= product.heightPossibleValues.values[1])) {
            return false;
        }
    }

    if (product.widthPossibleValues.isDiscrete) {
        if (product.widthPossibleValues.values.includes(data.width) === false) {
            return false;
        }
    } else {
        if (!(product.widthPossibleValues.values[0] <= data.width <= product.widthPossibleValues.values[1])) {
            return false;
        }
    }

    if (product.depthPossibleValues.isDiscrete) {
        if (product.depthPossibleValues.values.includes(data.depth) === false) {
            return false;
        }
    } else {
        if (!(product.depthPossibleValues.values[0] <= data.depth <= product.depthPossibleValues.values[1])) {
            return false;
        }
    }
    return true;
};

validateRestriction = async function (parentDto, childDto) {
    var p = new ItemRestrictionDto(parentDto.width, parentDto.height, parentDto.depth, parentDto.material, parentDto.productId);
    var c = new ItemRestrictionDto(childDto.width, childDto.height, childDto.depth, childDto.material, childDto.productId);

    var answer = await axios.post(restriction_uri, {
        parent: p,
        child: c
    }).then(response => {
        console.log(response)
        return true;
    }).catch(error => {
        console.log(error)
        return null;
    });

    if (answer === null) {
        return false;
    }

    return answer;
};

isProductValid = async function (product) {

    var productUri = uri + "?name=" + product.productName;

    var newProduct = await axios.get(productUri).then(response => {
        return response.data;
    }).catch(error => {
        return null;
    });

    if (newProduct == null) {
        return null;
    }

    if (!validateData(newProduct, product)) {
        return false;
    }

    return newProduct;
};

mandatoryItems = async function(pId) {
    var mandatoryuri = uri + "mandatory/" + pId;
    var mandatoryList = await axios.get(mandatoryuri).then(response => {
        return response.data;
    }).catch(error => {
        return null;
    });

    if(mandatoryList == null) {
        return null;
    }

    return mandatoryList;
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
    return new ItemDto(item._id,
        item.children,
        item.productId,
        item.material,
        item.finish,
        item.width,
        item.height,
        item.depth);
};

createNewProduct = function (product) {

    let p = new Item(
        {
            productId: product.productId,
            material: product.material,
            name: product.name,
            finish: product.finish,
            width: product.width,
            height: product.height,
            depth: product.depth,
            area : product.width * product.height,
            children: []
        }
    );

    return p;
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

