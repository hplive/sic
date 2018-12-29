const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const State = Object.freeze(
    {
        SUBMETIDA : 'Submitted',
        VALIDADA : 'Validated',
        ASSINADA : 'Signed',
        EM_PRODUÇÃO :'In production',
        EM_EMBALAMENTO : 'Packing',
        PRONTA_A_EXPEDIR : 'Ready',
        EXPEDIDA : 'Dispatched',
        ENTREGUE : 'Delivered',
        RECECIONADA : 'Received'
    }
);

var OrderSchema = new Schema ({
    customer : { type: Schema.Types.ObjectId, ref: 'Customer'},
    address : { type: Schema.Types.ObjectId, ref: 'Address'},
    state : { type: String, enum: Object.values(State),},
    items: { type: ['../models/Item.js'] },
    totalPrice: Number
});
Object.assign(OrderSchema.statics, {State});
module.exports = mongoose.model('Order', OrderSchema);