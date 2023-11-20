const { Wallet } = require("../models");
const Web3 = require("web3");
const axios = require("axios");
const { data } = require("autoprefixer");

exports.getWallets = function(req, res, next) {
    Wallet.findAll({
        where: {
            user_id: req.user.id
        }
    })
    .then((wallets) => {
        if (!wallets || wallets.length === 0) {
            req.unids = [];
            res.locals.unids = [];
        } else {
            let needWal = [];
            for(let i = 0; i < wallets.length; i++) {
                needWal.push(wallets[i].dataValues);
            }
            req.unids = needWal;
            res.locals.unids = needWal;
            console.log(needWal);
        }
        next();
    })
    .catch((error) => {
        req.wallets = [];
        res.locals.wallets = [];
        console.error(error); 
        next(error);
    });
};

exports.getWalletAddr = async function(req, res, next) {
    //console.log(req.unids);
    if (req.unids == []) {
        req.wallets = [];
        res.locals.wallets = [];
        //console.log(walletsResp);
    } else {
        const privateKey = '0xb7d9b51eda54d664366d74c1b1a4ed2ca9e1abed646732bfb83b141f22df3b39'
        const rFrom = '0xA285990a1Ce696d770d578Cf4473d80e0228DF95';
        const msg = {};

        const sign = await Web3.eth.accounts.sign(JSON.stringify(msg), privateKey)
        const headers = {
            'x-app-ec-from': rFrom,
            'x-app-ec-sign-r': sign.r,
            'x-app-ec-sign-s': sign.s,
            'x-app-ec-sign-v': sign.v
        };
        let wallets = req.unids;
        let walletsResp = [];
        for (const element of wallets) {
            try {
                const response = await axios.get(`https://my.h2k.me/ece/walletbyunid/${element.myUNID}`, {headers});
    
                //console.log(response)
                datas = response.data;
                //console.log(datas);
                if (Object.keys(datas).length !== 0) {
                    //console.log("no")
                    if (!element.wallet_addrs) {
                        const updatedData = {
                            wallet_addrs: datas.addrs,
                            wallet_type: datas.wallet_type,
                            name: datas.wallet_name
                        }
                        await Wallet.update(updatedData, {
                            where: {
                                id: element.id
                            }
                        });
                    }

                    const tokenResp = await axios.get(`https://my.h2k.me/ece/wallet_tokens/${datas.wallet_name}`, {headers});
                    tokens = tokenResp.data
                    walletsResp.push({
                        myUNID: datas.unid,
                        addrs: datas.addrs,
                        info: datas.info,
                        type: datas.wallet_type,
                        network: datas.network,
                        name: datas.wallet_name,
                        tokens
                    }
                    )
                } else {
                    walletsResp.push({
                        myUNID: element.myUNID,
                        addrs: '-',
                        info: element.info,
                        type: '-',
                        network: element.network,
                        name: '-'
                    })
                }

            } catch (error) {
                console.error(error);
            }
        }
        req.wallets = walletsResp;
        res.locals.wallets = walletsResp;
        console.log(walletsResp);
    }
    next();
}
