# ewallet-App
This document explains the business requirements of a e wallet tracking API. 
Definitions 
A simple e-wallet app to describe and attain regular functonalities of e- wallaet such as

# Requirements
## Wallet is responsible for having e-cash
## should be able to add value from bank
## should be able to show the current balance at any poiint of time
## should be able to do transection ergo pay for transections.
## if the paytm wallet >0 but <transection ammount> > balance: DENY transection.




```DB : : : Mongo DB```
User :
< u-uq-id> [auto populate]
< user number> [no duplicates allowed ::similar to pk, no null value]

< name >
< email>
< pin/password - auth> ##responsible for authenticate

E-Wallet: 
<wallet-uq-id>[auto populate]
<u-uq-id> [foreign key]
<e-cash> [initally 0]
<bank> <source/source>> :[]  
<history> [{}]



```End Points:```

User :
1. /login <post>: [] [JSON body keys : userEmail, password] [header :  bearer auth token]
2. /logout <post>: [header :  bearer auth token] [] [Reponse : Logs out from current devices]
3. /logoutAll <post>: [header :  bearer auth token] [] [Reponse : Logs out from all devices]
4. /signUp <post>: [ ] -- [JSON body keys : [name : String, email:String, number:String, password:String] ]  -- [response: auth token]
5. /users/me <patch> : [header :  bearer auth token] [JSON body keys : valid Field to update ]-- [success if true for validation]
6. /users/me <get>: [header :  bearer auth token] [] [returns current details]


E-wallet:
1. /mywallet <get>: [user bearer auth token] [] [results wallet details]
2. /addBank <patch> : [user bearer auth token] [JSON body key : newBank] [add a new bank to existing list]
3. /addMoney <post> : [user bearer auth token] [JSON body key : sourceBank, amount :Whole Number] [add value to e-wallet]
4. /transection <psot>[user bearer auth token] [JSON body key : destination, amount :Whole Number] [does transection if valid]





1. do git pull
2. npm install
3. update mongo Values, hash keys etc in  a .env file
4. npm run dev