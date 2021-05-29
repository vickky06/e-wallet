const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
// const config = require('config');
const Wallet = require('../models/wallet')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email')

            }
        }
    },
    number:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if (!validator.isMobilePhone(value,'any')) {
                throw new Error('Phone is invalid');
               }
               else{
                   console.log(value,'is valid')
               }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Passwor can not contain "Password"!!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }

    }],
}, {
    timestamps: true
});
userSchema.virtual('wallet',{
    ref: 'Wallet',
    localField:'_id',
    foreignField:'owner'
})
// userSchema.virtual('history',{
//     ref: 'History',
//     localField:'_id',
//     foreignField:'owner'
// })




//login function
userSchema.statics.findUserByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })
    const error = 'Invalid User ID password'
    if (!user) {
        throw new Error(error)
    }
    // console.log('searching user : found \n'+user)

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
        throw new Error(error)
    }
    //console.log('Password matched')
    return user
};



//Token generation
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const JWT_TOKEN = process.env.JWT_TOKEN||'vivek';
    // console.log('WE ARE HERE ' + JWT_TOKEN);
    const token = jwt.sign({
        _id: user._id.toString()
    }, JWT_TOKEN);
    user.tokens = user.tokens.concat({
        token
    });
    await user.save();
    return token;

}





//hasing passsword
userSchema.pre('save', async function(next) {
    const user = this
    // console.log("we are hashing password")
    if (user.isModified('password')) {
        // console.log('Password change activated')
        // console.log('password before'+user.password)
        user.password = await bcrypt.hash(user.password, 8)
        // console.log('password after : '+user.password )

    }
    //restructured User router
    // console.log('Pre is running')
    next()
});

///deletion of unnecessaary details for user while converting toJSON 
userSchema.methods.toJSON = function(){
    const user =this
    const userObj = user.toObject()   
    delete userObj.password
    delete userObj.tokens
    return userObj
}


userSchema.pre('remove',async function(next)
{const user = this
    await Wallet.deleteOne({ owner: user._id })
    next()
})



const User = mongoose.model('User', userSchema);
//Export this
module.exports = User;