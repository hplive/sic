const Order = require('../models/order');

exports.GetById = function(id) {
    return new Promise((resolve, reject) => {
        Order.findById(id, function(err, order) {
            if(err) reject(err);
            resolve(order);
        });
    });
}

exports.SaveOrder = function(order) {
    order.save(function(err) {
        if(err) return next(err);
    });
};

exports.DeleteOrder = function(id) {
    return new Promise((resolve, reject) => {
        Order.findByIdAndDelete(id, function(err, order) {
            if(err) reject(err);
            resolve(order);
        });
    })
}