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
    order.save()
    .then(doc => {
      return doc
    })
    .catch(err => {
        console.log(err.message)
      return null;
    })
};

exports.DeleteOrder = function(id) {
    return new Promise((resolve, reject) => {
        Order.findByIdAndDelete(id, function(err, order) {
            if(err) reject(err);
            resolve(order);
        });
    })
}