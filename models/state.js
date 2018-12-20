const mongoose = require('mongoose');

let StateSchema = new mongoose.Schema ({
    type : String
    ['SUBMETIDA', 'VALIDADA', 'ASSINADA', 'EM PRODUÇÃO', 'EM EMBALAMENTO', 'PRONTA A EXPEDIR', 'EXPEDIDA', 'ENTREGUE', 'RECECIONADA'],
    default: 'SUBMETIDA'
});

module.exports = mongoose.model('State', StateSchema);