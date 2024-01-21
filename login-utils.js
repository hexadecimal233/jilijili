async function fetchBili(url, userAgent) {
  const header = {
    "User-Agent": userAgent,
    Origin: "https://www.bilibili.com",
    Referer: "https://www.bilibili.com/",
  };

  return await fetch(url, {
    headers: header,
  });
}

const functions = {
  async QR(userAgent) {
    const loginUrl =
      "https://passport.bilibili.com/x/passport-login/web/qrcode/generate?source=main-fe-header";
    const resp = await fetchBili(loginUrl, userAgent);
    return await resp.json();
  },

  async poll(userAgent, key) {
    const pollUrl = `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${key}&source=main-fe-header`;
    const resp = await fetchBili(pollUrl, userAgent);
    return await resp.json();
  },

  async confirm(userAgent, key) {
    const pollUrl = `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${key}&source=main-fe-header`;
    const resp = await fetchBili(pollUrl, userAgent);
    const resp0 = await resp.json();

    if (resp0["code"] === 0) {
      const cookie = resp.headers.getSetCookie();
      const r1 = await fetch(resp0.data.url);
      cookie.push(r1.headers.getSetCookie());
      console.log(cookie);
    }

    return await resp0[code];
  },
};

module.exports = functions;
