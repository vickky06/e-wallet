const mongoose = require('mongoose');

const wallet = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        require:true
    },
    e_cash:{
        type:Number,
        required:false,
        default:0
    },
    linked_banks:{
        type:Array,
        default:[],
        required:false
    },
    history:{
        type:Array,
        default:[],
        required:false
    }

},{
    timestamps: true
});

wallet.methods.toJSON = function(){
    const n_wallet =this
    const walletObj = n_wallet.toObject()   
    delete walletObj.owner
    // delete walletObj.history
    return walletObj
}


const Wallet =  mongoose.model('Wallet',wallet)




module.exports = Wallet