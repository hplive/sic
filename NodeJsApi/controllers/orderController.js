const Service = require('../services/itemService');


const ORDER_NOT_FOUND = 'Encomenda não encontrada';
const ITEM_NOT_FOUND = 'Item não encontrado';
const PRODUCT_NOT_FOUND = 'Produto não encontrado';
const ITEM_DIM_WRONG = 'Dimensões inválidas';
const RESTRICTION_VIOLATION = 'Item viola restricoes';
const MANDATORY_ERROR = 'Não estão incluidos todo so produtos obrigatórios';
const AREA_NOT_ENOUGH = 'Área insuficiente';


exports.get_order = async (req, res) => {
    var success = await Service.getOrder(req.params.id);

    if (success == false) {
        res.status(404).send(ORDER_NOT_FOUND);
    } else {
        res.send(success);
    }
};

exports.delete_order = async function (req, res) {
    var success = await Service.deleteOrder(req.params.id);

    if (!success) {
        res.status(404).send(ORDER_NOT_FOUND);
    } else {
        res.status(204).send();
    }
};

exports.get_order_items = async function (req, res) {
    var success = await Service.getOrderItems(req.params.id);

    if (!success) {
        res.status(404).send(ORDER_NOT_FOUND);
    } else {
        res.send(success);
    }
};

exports.get_items_order = async function (req, res) {
    var success = await Service.getOrderItems(req.params.id, req.params.itemId);

    if (success == false) {
        res.status(404).send(ORDER_NOT_FOUND);
    } else if (success == null) {
        res.status(404).send(ITEM_NOT_FOUND);
    } else {
        res.send(success);
    }
};

exports.create_order = async (req, res) => {
    var success = await Service.createOrder(req.body);

    if (success == false) {
        res.status(400).send(ITEM_DIM_WRONG);
    } else if (success == null) {
        res.status(404).send(PRODUCT_NOT_FOUND);
    } else if (success == 'bad' || success == 'child') {
        res.status(404).send(RESTRICTION_VIOLATION);
    } else if (success == 'mandatory') {
        res.status(400).send(MANDATORY_ERROR);
    } else if (success == 'DontFit') {
        res.status(400).send(AREA_NOT_ENOUGH);
    }
    else {
        res.status(201).send(success);
    }
};