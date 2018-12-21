const mongoose = require('mongoose');

const ItemDto = require('../Dtos/ItemDto');

const ItemRepository = require('../repository/itemRepository');

const ITEM_NOT_FOUND = 'Item did not find';
const INTERNAL_SERVER_ERROR = 'Server error';
const BAD_REQUEST = 'Request error';


exports.GetProductById = function (req, res) {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).send(BAD_REQUEST);
    } else {

        ItemRepository.GetById(req.params.id).then(item => {
            if (item === null) {
                res.status(404).send(ITEM_NOT_FOUND);
            } else {

                res.send(new ItemDto(
                    item.id,
                    item.children,
                    item.productId,
                    item.material,
                    item.finish,
                    item.width,
                    item.height,
                    item.depth));
            }

        }, err => {
            res.status(500).send(INTERNAL_SERVER_ERROR);
        });
    }
};