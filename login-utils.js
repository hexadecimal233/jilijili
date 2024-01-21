var data = new Map();

async function getUserInfo(userAgent, cookie) {
  const newCookie = [];
  for (const key in cookie) {
    newCookie.push(cookie[key].split(";")[0]);
  }

  const url = "https://api.bilibili.com/x/web-interface/nav";

  const header = {
    "User-Agent": userAgent,
    Origin: "https://www.bilibili.com",
    Referer: "https://www.bilibili.com/",
    Cookie: newCookie.join("; "),
  };

  const resp = await fetch(url, {
    headers: header,
  });

  const resp0 = await resp.json();
  return [resp0.data.face, resp0.data.uname];
}

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
  userData: data,

  async QR(userAgent) {
    const loginUrl =
      "https://passport.bilibili.com/x/passport-login/web/qrcode/generate?source=main-fe-header";
    const resp = await fetchBili(loginUrl, userAgent);
    return await resp.json();
  },

  async poll(userAgent, key) {
    const pollUrl = `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${key}&source=main-fe-header`;
    const resp = await fetchBili(pollUrl, userAgent);
    const resp0 = await resp.json();

    if (resp0["data"]["code"] === 0) {
      const cookie = resp.headers.getSetCookie();
      const r1 = await fetch(resp0.data.url);
      cookie.push(r1.headers.getSetCookie());
      cookie.pop(); //移除最后的空数组
      data.set(key, await getUserInfo(userAgent, cookie));
    }

    return resp0;
  },
};

module.exports = functions;
