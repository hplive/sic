const mongoose = require('mongoose');

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
    }
);

let OrderSchema = new mongoose.Schema ({
    customer : { type: mongoose.Schema.Types.ObjectId, ref: "Customer"},
    address : { type: mongoose.Schema.Types.ObjectId, ref: "Address"},
    state : { type: String, enum: Object.values(State),},
    items : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
    totalPrice: Number
});
Object.assign(OrderSchema.statics, {State});
module.exports = mongoose.model('Order', OrderSchema);