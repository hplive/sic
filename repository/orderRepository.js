const Order = require('../models/order');

exports.GetById = function (id) {
    return new Promise((resolve, reject) => {
        Order.findById(id, function (err, order) {
            if (err) reject(err);
            resolve(order);
        });
    });
}

exports.set_state = function (id, order){
    return new Promise((resolve, reject)=> {
        Order.updateOne({_id:id} ,order, function (err, order){
            if(err) reject(err);
            resolve(order);
        });
    });
};
exports.GetAll = function (email) {
    return new Promise((resolve, reject) => {
        Order.find({
            "customer.email": email
        }, function (err, order) {
            if (err) reject(err);
            resolve(order);
        });
    });
}
exports.GetItems = function (id) {
   return new Promise((resolve , reject) =>{
      Order.findOne({_id:id}, function (err, order){
          if(err) reject(err);
          resolve(order)
      }).select('items')
   });
}

exports.SaveOrder = function (order) {
    order.save()
        .then(doc => {
            return doc
        })
        .catch(err => {
            console.log(err.message)
            return null;
        })
};

exports.DeleteOrder = function (id) {
    return new Promise((resolve, reject) => {
        Order.findByIdAndDelete(id, function (err, order) {
            if (err) reject(err);
            resolve(order);
        });
    })
}