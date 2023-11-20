function loadCryptoOrisWidget() {
  console.log("HI")
  const cryptoOrisElement = document.querySelector('crypto-oris');
  const ec_from = cryptoOrisElement.getAttribute('x-app-ec-from');
  const ec_sign_r = cryptoOrisElement.getAttribute('x-app-ec-sign-r');
  const ec_sign_s = cryptoOrisElement.getAttribute('x-app-ec-sign-s');
  const ec_sign_v = cryptoOrisElement.getAttribute('x-app-ec-sign-v');
  const ec_msg = cryptoOrisElement.getAttribute('x-app-ec-msg');

  let data = {
      ec_from: ec_from,
      ec_sign_r: ec_sign_r,
      ec_sign_s: ec_sign_s,
      ec_sign_v: ec_sign_v,
      ec_msg: ec_msg
  };
  cryptoOrisElement.innerHTML = `
        <div class="my-widget-div" style="max-width: 500px; margin: 0 auto; position: relative; width: 100%;">
          <iframe id="myFrameWidgetv1" src="/widget/external/dev/test?data=${encodeURIComponent(JSON.stringify(data))}" style="border:none; overflow:hidden; width: 100%; min-height: 500px;" scrolling="no" allowtransparency="true"></iframe>
        </div>
`;
}
document.getElementById("choiceForm").addEventListener("submit", function(event) {
  event.preventDefault(); 

  fetch('/cryptoChoice', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          crypto: document.getElementById("crypto").value,
      }),
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);

      // Обновление значений на клиенте
      document.querySelector('crypto-oris').setAttribute('x-app-ec-from', data.ec_from);
      document.querySelector('crypto-oris').setAttribute('x-app-ec-sign-r', data.sign.r);
      document.querySelector('crypto-oris').setAttribute('x-app-ec-sign-s', data.sign.s);
      document.querySelector('crypto-oris').setAttribute('x-app-ec-sign-v', data.sign.v);
      document.querySelector('crypto-oris').setAttribute('x-app-ec-msg', data.sign.message);

      // Вызов функции для обновления виджета
      loadCryptoOrisWidget();
  })
  .catch(error => {
      console.error('Error:', error);
  });
});
