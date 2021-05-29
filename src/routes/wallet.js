const mongoose = require('mongoose');
const express = require('express');
const router = new express.Router();
const _ = require('lodash');
router.use(express.json());
const auth = require('../middleware/auth');
const Wallet = require('../DB/models/wallet');
const User = require('../DB/models/users');
const History = require('../DB/models/history');
// const { invalid } = require('moment')


router.get('/mywallet', auth, async (req, res) => {
    console.log('+++++++++++++++++++++++++++++Get My wallet+++++++++++++++++++++++++++++')
    try {
        await req.user.populate({ path: 'wallet' }).execPopulate()
        console.log('sending values', req.user.wallet)
        res.send(req.user.wallet)
    }
    catch (e) {
        console.log(e, "Error")
        res.status(500).send(e)
    }
})


router.patch('/addBank', auth, async (req, res) => {
    try {
        console.log('+++++++++++++++++++++++++++++ADD BANK to Wallet +++++++++++++++++++++++++++++')
        //do sanity
        let newBank = _.get(req, 'body.newBank', false)
        if (!newBank) {
            return res.status(422).send({ error: 'invalid body param' })
        }
        else {
            // console.log(req.user._id);
            // res.send('great')
            let walletResp = await Wallet.updateOne(
                { owner: req.user._id },
                {
                    $addToSet: {
                        linked_banks: [newBank],
                        history: [{
                            'Bank Added': newBank,
                            time: new Date()
                        }]
                    }
                });
            res.send({ walletResp, 'wallet updated with new Bank': newBank })
        }


    } catch (e) {
        console.log('catch Block Found', e)
        res.status(500).send(e)
    }
})



router.post('/addMoney', auth, async (req, res) => {
    console.log('+++++++++++++++++++++++++++++Add money to wallet+++++++++++++++++++++++++++++')
    try {
        let amount = _.get(req, 'body.amount', false);
        let fromWallet = _.get(req, 'body.sourceBank', false);
        if (fromWallet && amount && typeof (amount) === 'number' && parseInt(amount) > 0) {
            console.log("wallet valid body:searching for", req.user._id)
            let { e_cash, linked_banks } = await Wallet.findOne({ owner: req.user._id });
            if (linked_banks.includes(fromWallet)) {
                await Wallet.findOneAndUpdate({
                    owner: req.user._id,
                }, {
                    $inc: { e_cash: amount },
                    $push: {
                        history: [{
                            'money added': {
                                bank: fromWallet,
                                amount
                            },
                            time: new Date()
                        }]
                    },

                });
                res.status(202).send({ 'updated Wallet Balance': e_cash + amount })
            } else {
                res.status(422).send({
                    error: 'Bank is Invalid. Please add this bank by going to /addBank'
                })
            }
        } else {
            res.status(422).send({
                error: 'Incorrect body param',
                expectedBody: {
                    sourceBank: 'type string',
                    amount: 'positve number'
                }
            })
        }
    }

    catch (e) {
        console.log(e, "Error")
        res.status(500).send(e)
    }
});

router.post('/transection', auth, async (req, res) => {
    try {
        console.log(req.user.number, "Current user")
        //sanity
        let destinationNumber = _.get(req, "body.destination", false);
        let amount = _.get(req, "body.amount", false);
        if (!(amount && typeof (amount) == 'number' && parseInt(amount) > 0)) {
            console.log('here')
            res.status(400).send({
                error: 'Invalid Amount'
            })
        }
        else if (!destinationNumber) {
            res.status(400).send({
                error: 'Receipient Number not valid.'
            })
        }
        else if (destinationNumber && amount) {
            let { e_cash } = await Wallet.findOne({
                owner: req.user._id
            })

            if (destinationNumber == req.user.number) {
                //receipient and sender can not be same
                return res.send({ message: 'receipient and sender can not be same' });
            }
            else if (e_cash < amount) {
                return res.send({ error: 'Insufficient Wallet balance' })
            }
            //#check if valid destinationNumber.
            let dest = await User.findOne({
                number: destinationNumber
            });

            if (dest) {
                // update destination with value.
                await Wallet.findOneAndUpdate({
                    owner: dest._id
                }, {
                    $inc: { e_cash: amount },
                    $push: {
                        history: [{
                            'credited amount': {
                                source: req.user.number,
                                amount
                            },
                            time: new Date()
                        }]
                    },
                }, { new: true });
                // update sender with value.
                let { e_cash } = await Wallet.findOneAndUpdate({
                    owner: req.user._id
                }, {
                    $inc: { e_cash: -amount },
                    $push: {
                        history: [{
                            'debited amount': {
                                recipient: destinationNumber,
                                amount
                            },
                            time: new Date()
                        }]
                    }
                }, { new: true })

                res.send({ "update_wallet_balance": e_cash })
            }
            else {
                res.status(500).send({ "Message": "Something went wrong. Please report this -E1" })
            }
        } else {
            res.status(500).send({ "Message": "Something went wrong. Please report this -E2" })
        }

    } catch (e) {
        console.log(e, "Error")
        res.status(500).send(e)
    }
})


module.exports = router