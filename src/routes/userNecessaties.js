const express = require('express');
const User = require('../DB/models/users');
const Wallet = require('../DB/models/wallet');
// const History = require('../DB/models/history');
const auth = require('../middleware/auth')

const router = new express.Router();
router.use(express.json());


//          LOG-IN
router.post('/login',async (req,res)=> 
    {console.log('**********************************************Login*******************************************\n')
        //console.log(req.body)
            try {
                const user = await User.findUserByCredentials(req.body.email,req.body.password);
                const token = await user.generateAuthToken();
                //console.log(user)
                res.status(200).send({user,token})
            }
            catch(error)
            {  console.log('issue \n'+error)
        
                res.status(400).send({error})
            }
    }
);

//          SIGNUP
router.post('/signup', async (req, res) => {
    console.log('******************************************************************SIGN UP**************************************************\n')
    //create and save a New User
    // {
    //     "name": "Vivek01" ,
    //     "email": "vivek.singh.6967@gmail.com",
    //     "password": "Qwerty@456",
    //     "number: "918826915637" 
    // }
    let body = req.body;
    const user = new User({
        name: body.name,
        email: body.email,
        password: body.password,
        number: body.number 
    })
    // console.log(user,"USER DETAILS")

    try {
        await user.save();
        //create a wallet for user
        const wallet = new Wallet({
            owner: user._id,
        })
       
        console.log('Body is here',wallet)
        // console.log('User data received \n', user)

        let walletV = await wallet.save()

        // return res.status(201).send(task)

        console.log('USER SAVED')

        // sendWelcomeEmails(user.email, user.name)
        const token = await user.generateAuthToken()
        console.log('Sign Up successfull')
        res.status(201).send({ user, token ,wallet:walletV})
    }
    catch (e) {
        console.log(' catch Block Found', e)
        res.status(400).send({ error: e })
    }


});

//          LOGOUT
router.post('/logout', auth, async (req, res) => {
    try {
        console.log('***************************Logout*************************************************\n',req.user)
        req.user.tokens = []
        await req.user.save()
        res.send({
            'status': 'Loged out from all devices '
        })
    } catch (e) {
        req.status(500).send()
    }
});

//LogOut all
router.post('/users/logoutAll',auth, async(req,res)=>{
    try{
        console.log('************************************LogOutAll**************************************\n')
        req.user.tokens = []
        await req.user.save()
        res.send({'status':'Loged out from all devices '})
    }
    catch(e){
        res.status(500).send()
    }

});

/**********************UPDATE ME */
router.patch('/users/me', auth,async (req,res)=>{
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Updating USER~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log('Patching Users for '+req.user.id+' ID')
    const allowed = ['name','password','number']
    
    const reqUpdate= Object.keys(req.body)
    console.log('Update Body:: '+reqUpdate)
    const isValid = reqUpdate.map((update)=>  allowed.includes(update))   //checking if the body passed is valid 
   console.log(isValid)
    if (!isValid){
        //console.log('nvalidated')
        return res.status(400).send('error: Invalid Update')
    }

    try{
       
        console.log('User check begin ')
      // const user = await User.findById(req.params.id)
      const user =req.user
        console.log('user found :'+ user.name)
       reqUpdate.forEach((update)=> user[update] = req.body[update]       )
       await user.save()
       // const updateUser =await  User.findByIdAndUpdate(myObjectIdString ,req.body,{new: true,runValidators : true})
        // console.log('User check')
        // console.log('updateUser :',updateUser)
            
        //console.log('User found')
            res.send(user)
    
    }catch(e){
       console.log('Catch Block'+e)
        res.status(500).send(e)
    }

})

module.exports = router;
