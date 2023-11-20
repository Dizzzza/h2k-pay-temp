const Web3 = require("web3");
const axios = require("axios");
const { Transaction } = require("../models")

exports.sendTransaction = async function(req, res) {
    let token;
    switch(req.body.transToken) {
        case('5000'):
            token = '5000:::TRX###' + req.body.transWalletName;
            break;
        case('5010'): 
            token = '5010:::TRX###' + req.body.transWalletName;
            break;
        case('5000'):
            token = '5000:::USDT###' + req.body.transWalletName;
            break;
        case('5010'): 
            token = '5010:::USDT###' + req.body.transWalletName;
            break;
        case('3000'):
           token = '3000:::ETH###' + req.body.transWalletName;
            break;
        case('3010'):
            token = '3010:::ETH###' + req.body.transWalletName;
            break;
        case('3030'):
            token = '3030:::ETH###' + req.body.transWalletName;
            break;
        case('3040'):
            token = '3040:::ETH###' + req.body.transWalletName;
            break;
        case('3000'):
            token = '3000:::USDT###' + req.body.transWalletName;
            break;
        case('3010'):
            token = '3010:::USDT###' + req.body.transWalletName;
            break;
        case('3030'):
            token = '3030:::USDT###' + req.body.transWalletName;
            break;
        case('3040'):
            token = '3040:::USDT###' + req.body.transWalletName;
            break;
        case('1000'):
            token = '1000:::BTC###' + req.body.transWalletName;
            break;
        case('1010'):
            token = '1010:::BTC###' + req.body.transWalletName;
            break;
    }
    

    const privateKey = '0xb7d9b51eda54d664366d74c1b1a4ed2ca9e1abed646732bfb83b141f22df3b39'
    const rFrom = '0xA285990a1Ce696d770d578Cf4473d80e0228DF95';
    const reqBody = {"token": token,
    "info": req.body.message,
    "value": req.body.value,
    "toAddress": req.body.toAddr,
    "json_info":{"order_id":"125478"}};

    const sign = await Web3.eth.accounts.sign(JSON.stringify(reqBody), privateKey)
    const headers = {
        'x-app-ec-from': rFrom,
        'x-app-ec-sign-r': sign.r,
        'x-app-ec-sign-s': sign.s,
        'x-app-ec-sign-v': sign.v
    };
    try {
        const response = await axios.post('https://my.h2k.me/ece/tx', reqBody, {headers});

        //console.log(response)
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
    //console.log(req.body, token);
    res.redirect('/wallets');
}

exports.serializeTrans = async function(trans) {
    try {
        await Transaction.create({
            id_order: trans.id_order,
            network: trans.network,
            id_client: trans.id_client,
            id_merchant: trans.id_merchant,
            summ: trans.summ,
            token: trans.token,
            token_id: trans.token_id,
            product: String(trans.product),
            hash: trans.hash,
            value: trans.value
        });
    } catch (error) {
        console.error(error);
    }
}

exports.getTrans = async function(req, res, next) {
        Transaction.findAll()
        .then((trans) => {
            if (!trans || trans.length === 0) {
                req.trans = [];
                res.locals.trans = [];
            } else {
                let needTrans = [];
                for(let i = 0; i < trans.length; i++) {
                    needTrans.push(trans[i].dataValues);
                }
                req.trans = needTrans;
                res.locals.trans = needTrans;
                console.log(needTrans);
            }
            next();
        })
        .catch((error) => {
            req.trans = [];
            res.locals.trans = [];
            console.error(error); 
            next(error);
        });
}