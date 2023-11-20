const Web3 = require("web3");
const axios = require("axios");
const { Wallet } = require("./models")

exports.createWallet = async function (req, res) {
    const privateKey = '0xb7d9b51eda54d664366d74c1b1a4ed2ca9e1abed646732bfb83b141f22df3b39';
    const rFrom = '0xA285990a1Ce696d770d578Cf4473d80e0228DF95';
    let minSigns;
    let slistArr = req.body.walletSign;
    if (typeof slistArr !== 'string') {
        if (req.body.minSigns > slistArr.length) {
            minSigns = "1";
        }
    }
    let slist = {"min_signs": minSigns};
    if (typeof slistArr !== 'string') {
        for (let i = 0; i < slistArr.length; i++) {
          let index1 = i.toString();
          slist = { ...slist, [index1]: { "type": "any", "email": slistArr[i] } };
        }
    }
    let cryptoType;
    let reqBody;
    switch(req.body.cryptoType) {
        case ('TRX'):
            cryptoType = "5010";
            break;
        case ('BTC'):
            cryptoType = "1010";
            break;
        case ('ETH'):
            cryptoType = "3010";
            break;
    }
    //console.log(req.body);
    //console.log(slistObj);
    if(typeof(slistArr) == 'string') {
        reqBody = {
            "slist": {
                "min_signs": "1",
                "0": {"type": "any", "email": req.body.walletSign}
            },
            "network": cryptoType,
            "info": req.body.walletName 
        }
    } else {
        reqBody = {
            slist,     
            "network": cryptoType,
            "info": req.body.walletName 
        }
    }

    const sign = await Web3.eth.accounts.sign(JSON.stringify(reqBody), privateKey)
    const headers = {
        'x-app-ec-from': rFrom,
        'x-app-ec-sign-r': sign.r,
        'x-app-ec-sign-s': sign.s,
        'x-app-ec-sign-v': sign.v
    };
    console.log("reqBody", reqBody);
    let unidCode;
    try {
        const response = await axios.post('https://my.h2k.me/ece/newWallet', reqBody, {headers});

        //console.log(response)
        unidCode = response.data;
        console.log("CHECK THIS: ", unidCode)
        res.redirect('/');
        await Wallet.create({
            user_id: req.user.id,
            network: cryptoType,
            myUNID: response.data.myUNID,
            info: req.body.walletName
        });
    } catch (error) {
        console.error(error);
    }
}