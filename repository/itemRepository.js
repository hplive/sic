const Item = require('../models/item');

exports.GetById = function(id) {
    return new Promise((resolve, reject) => {
        Item.findById(id, function(err, item) {
            if(err) reject (err);
            resolve(item);
        });
    });
}

exports.SaveItem = function(item) {
    item.save(function(err) {
        if(err) return next(err);
    });
}

exports.DeleteItem = function(id) {
    return new Promise((resolve, reject) => {
        Item.findByIdAndDelete(id, function(err, item) {
            if(err) reject (err);
            resolve(item);
        });
    });
}