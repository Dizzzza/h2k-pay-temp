const axios = require("axios");
const Web3 = require("web3");

async function APIgetRequest() {
    const privateKey = '0xb7d9b51eda54d664366d74c1b1a4ed2ca9e1abed646732bfb83b141f22df3b39'
    const rFrom = '0xA285990a1Ce696d770d578Cf4473d80e0228DF95'
    const msg = {}

    const sign = await Web3.eth.accounts.sign(JSON.stringify(msg), privateKey)
    const headers = {
        'x-app-ec-from': rFrom,
        'x-app-ec-sign-r': sign.r,
        'x-app-ec-sign-s': sign.s,
        'x-app-ec-sign-v': sign.v
    };
    return await axios.get('https://my.h2k.me/ece/netlist/1', {headers})
}

APIgetRequest()
    .then(response => {
        console.log('Ответ:', response.data);
    })
    .catch(error => {
        console.error('Произошла ошибка:', error);
    });