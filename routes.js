const path = require("path")
const authController = require('./controllers/authController');
const random = require('./random')
const integrationController = require('./controllers/integrationController');
const mainController = require('./controllers/mainController');
const walletController = require('./controllers/walletController');
const transController= require('./controllers/transController')

const passport = require('passport');
const {Strategy: LocalStrategy} = require("passport-local");
const {User, Credential, IntegrationProject} = require("./models");
const crypto = require("crypto");
const Web3 = require('web3')
const secp256k1 = require("secp256k1");
const axios = require("axios");
const session = require('express-session');
const bcrypt = require("bcrypt")

passport.use('local', new LocalStrategy(async function(email, password, cb) {
    try {
        console.log("We are Here");
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return cb(null, false, { message: 'Incorrect email or password.' });
        }
        const credentials = await Credential.findOne({ where: { provider: 'local', user_id: user.id } });
        if (!credentials) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        const isMatch = await bcrypt.compare(password, credentials.hashed_password);

        if (!isMatch) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
}));
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, user)
        console.log('Serialize user: ' + user.user_id);
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbFolder = path.join(__dirname, 'var', 'db');
if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
}

const dbFileName = path.join(dbFolder, 'widget.db');

const db = new sqlite3.Database(dbFileName, (err) => {
    if (err) {
        console.error('Ошибка при подключении к базе данных:', err.message);
    } else {
        console.log('Подключение к базе данных успешно установлено.');
    }
});

process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('Ошибка при закрытии базы данных:', err.message);
        } else {
            console.log('Подключение к базе данных успешно закрыто.');
        }
    });
});

module.exports = (app) => {
    app.get('*',
        authController.ensureAuthenticated);

    app.get("/",
        mainController.getUser,
        walletController.getWallets,
        walletController.getWalletAddr,
        (req, res) => res.render('index', {}))

    app.get("/login",
        (req, res) => res.render('login', {}))

    app.get("/signup",
        (req, res) => res.render('signup', {}))

    app.get("/integration",
        mainController.getUser,
        integrationController.getIntegrations,
        (req, res) => res.render('integration', {}))

    app.get("/integration/:id",
        mainController.getUser,
        integrationController.getIntegrations,
        integrationController.getExactIntegration,
        (req, res) => res.render('integration_detail',))
    app.get("/transactions",
    mainController.getUser,
    transController.getTrans,
    (req, res) => res.render('transactions', {}))
    app.get("/widget",
        (req, res) => res.render('widget', {}))

    app.get("/test1111111",
    (req, res) => res.render('test', {}))

    app.get("/indexaction",
        mainController.getUser,
        walletController.getWallets,
        walletController.getWalletAddr, (req, res) => res.render("indexaction", {}));

    app.get("/wallets", 
        mainController.getUser,
        walletController.getWallets,
        walletController.getWalletAddr,
        (req, res) => res.render("wallets", {}));

    app.get("/create",
        mainController.getUser,
        walletController.getWallets,
        walletController.getWalletAddr,
        (req, res) => res.render("create_wallet", {}));

  
    app.get("/v1/widget/js",
        (req, res) => res.sendFile(path.join(__dirname, 'widget', 'widget-scripts.js')))

    app.get("/v1/widget/css",
        (req, res) => res.sendFile(path.join(__dirname, 'widget', 'widget-styles.css')))

    app.get("/widget/external/dev/test",
        (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
            res.render('iframe_widget', {})
    })

    app.post('/add_integration',
        integrationController.addIntegration)
    
    app.post('/createWallet',
        random.createWallet)

    app.post('/sendTransaction',
        transController.sendTransaction)

    app.post('/signup',
        authController.signup)

    app.post('/resPass',
        authController.resPassword)

    app.post('/checkCode',
        authController.checkCode)

    app.post('/login/password',
        passport.authenticate('local', {
            failureRedirect: './error',
            failureFlash: true
        }),
        (req, res) => res.redirect('/')
    )

    app.post("/cryptoChoice", 
    async (req, res) => {
        const ecFrom = '0xA285990a1Ce696d770d578Cf4473d80e0228DF95'
        const privateKey = '0xb7d9b51eda54d664366d74c1b1a4ed2ca9e1abed646732bfb83b141f22df3b39'
        console.log("Hello", parseInt(req.body.crypto))
        const msg = {
            network: parseInt(req.body.crypto),
            id_client: 123123,
            id_order: 1231324,
            id_merchant: '1',
            summ: 123,
            type: 1,
            token: 'usdt',
            token_id: 59,
            product: 1
        }
        const sign = await Web3.eth.accounts.sign(JSON.stringify(msg), privateKey)
        console.log(sign)
        res.send({ec_from: ecFrom, sign: sign, sign_r: sign.r, sign_s: sign.s, sign_v: sign.v, ec_msg: sign.messageHash, msg: JSON.stringify(msg)})
    })

    app.get("/widget_test",
    async (req, res) => {
        const ecFrom = '0xA285990a1Ce696d770d578Cf4473d80e0228DF95'
        const privateKey = '0xb7d9b51eda54d664366d74c1b1a4ed2ca9e1abed646732bfb83b141f22df3b39'
        const msg = {
            network: 5010,
            id_client: 123123,
            id_order: 1231324,
            id_merchant: '1',
            summ: 123,
            type: 1,
            token: 'usdt',
            token_id: 59,
            product: 1
        }
        const sign = await Web3.eth.accounts.sign(JSON.stringify(msg), privateKey)
        console.log(sign)
        res.render('widget_integ', {ec_from: ecFrom, sign: sign, sign_r: sign.r, sign_s: sign.s, sign_v: sign.v, ec_msg: sign.messageHash, msg: JSON.stringify(msg)})
    });

app.post('/get_address', async (req, res) => {
    const headers = {
        'x-app-ec-from': req.body.ec_from,
        'x-app-ec-sign-r': req.body.ec_sign_r,
        'x-app-ec-sign-s': req.body.ec_sign_s,
        'x-app-ec-sign-v': req.body.ec_sign_v
    };
    console.log("Header", headers)
    try {
        console.log(req.body.ec_msg);
        const response = await axios.post('https://my.h2k.me/w/gettmpaddress', req.body.ec_msg, { headers });
        const getTmpAddress = response.data;
        console.log("CHECK (getTmpAddres): ", getTmpAddress)
        res.send({
            gettmpaddres: getTmpAddress
        })
    } catch (error) {
        console.error(error);
        res.status(400).send({
            ok: false
        })
    }
})

app.post('/check_tx', async (req, res) => {
    let order_tx
    try {
        const response = await axios.get(`https://my.h2k.me/order_tx/1/${req.body.w_type}/${req.body.client_id}/${req.body.order_id}`);
        order_tx = response.data;
        console.log("CHECK (order_tx): ", order_tx)
        //console.log('Hello',req.body.ec_msg);
        for(let i = 0; i <= order_tx.length; i++) {
            let token;
            if(String(order_tx[i].network_id) == '5010') {
                switch(String(order_tx[i].token_id)) {
                    case("59"):
                        token = 'Test TRX'
                        break;
                    case("0"):
                        token = 'Test USDT';
                        break;
                }
            } else if (String(order_tx[i].network_id) == '5000') {
                switch(String(order_tx[i].token_id)) {
                    case("47"):
                        token = 'TRX'
                        break;
                    case("0"):
                        token = 'USDT';
                        break;
                }
            }
            let txData = {
                id_order: req.body.ec_msg.id_order,
                network: req.body.ec_msg.network,
                id_client: req.body.ec_msg.id_client,
                id_merchant: req.body.ec_msg.id_merchant,
                summ: req.body.ec_msg.summ,
                token: token,
                token_id: order_tx[i].token_id,
                product: String(req.body.ec_msg.product),
                hash: order_tx[i].hash,
                value: parseFloat(order_tx[i].value)
            }
            transController.serializeTrans(txData);
        }
    } catch (error) {
        console.error(error);
    }
    let totalSumm = 0
    if (order_tx.length !== 0) {
        order_tx.forEach(item => {
            if (item.token_id === 59 && item.network_id === 5010) {
                totalSumm = totalSumm + parseFloat(item.value)
            }
        })
        res.status(200).send({
            ok: true,
            order_tx: order_tx,
            totalSumm: totalSumm
        })
    } else {
        res.status(200).send({
            ok: false,
            msg: "to transaction"
        })
    }
})

app.get('/get_tokens_list', async (req, res) => {
    const ecFrom = '0xA285990a1Ce696d770d578Cf4473d80e0228DF95'
    const privateKey = '0xb7d9b51eda54d664366d74c1b1a4ed2ca9e1abed646732bfb83b141f22df3b39'
    const msg = '{}'
    const sign = await Web3.eth.accounts.sign(msg, privateKey)
    const headers = {
        'x-app-ec-from': ecFrom,
        'x-app-ec-sign-r': sign.r,
        'x-app-ec-sign-s': sign.s,
        'x-app-ec-sign-v': sign.v
    };

    let tokenNames = []
    let tokenlist
    try {
        const response = await axios.get('https://my.h2k.me/w/tokenlist', { headers });
        tokenlist = response.data;
        console.log("CHECK (tokenNames): ", tokenlist)

        if (Array.isArray(tokenlist)) {
            tokenNames = tokenlist.map(network => network.network_name);
            res.send({
                available_tokens: tokenNames,
                tokenlist: tokenlist
            })
        } else {
            console.error('Error fetching');
            res.status(400).send({
                ok: false
            })
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({
            ok: false
        })
    }
})

    app.post('/webhook', async (req, res) => {
        console.log(req.body)
    })



    app.post('/logout',
        authController.logout)
}