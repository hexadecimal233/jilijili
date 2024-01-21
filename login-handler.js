const axios = require("axios");

async function login() {
  const loginUrl =
    "https://passport.bilibili.com/x/passport-login/web/qrcode/generate?source=main-fe-header";
  const header = {
    "User-Agent": userAgent,
    Origin: "https://www.bilibili.com",
    Referer: "https://www.bilibili.com/",
  };
  const resp = await axios.fetch(loginUrl, {
    headers: header,
  });
  console.log(resp);
}

module.exports = login;
