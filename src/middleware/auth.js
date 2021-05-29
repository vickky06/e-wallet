const jwt = require('jsonwebtoken');
const User = require('../DB/models/users');
const dotenv = require('dotenv');
dotenv.config();

// const config = require('config');
///const JWT_TOKEN = config.get('jwt_token');


module.exports = auth = async (req, res, next) => {
    console.log('auth running');
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        //console.log("JWT_TOKEN "+JWT_TOKEN);
        //console.log("Token ->",token);
        const JWT_TOKEN = process.env.JWT_TOKEN||'vivek';

        const decode = jwt.verify(token, JWT_TOKEN)
        //console.log('decode \n'+decode)
        const user = await User.findOne({
            _id: decode._id,
            'tokens.token': token
        })
        if (!user) {
            throw new Error({
                error: 'Please authenticate'
            })
        }
        // console.log("Token : "+token)
        // console.log("\n User : "+user)
        req.token = token
        req.user = user


        next();
    } catch (e) {
        console.log(e);
        res.status(500).send({
            error: 'Please authenticate'
        })
    }

};