const OS = [
  /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i,
  /cfnetwork\/.+darwin/i,
  /(android)[\/\s-]?([\w\.]*)/i,
];

const successText =
  '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFrSURBVHgB7dfvTcJAGMfx3x0MoNE3vmMERtAR6gRuoE4gbsAGxAFMdQIdhXcmJEYG0Jz3PCQa7JXev0cu5L4JgdInvU8aaFqgVqvVarVDTqHk2o8pzNfCfrLveIIe3ZYL3mBf7Kejn+8MXkcoMReWUgoapdWHpYxZlvWT2IWFWUJ9XpQD9sCiOSvkDHtiaWv/4AAstQG379f2knFjB9Z2a47L0wf8R4FYSuFxdQWlF1uzSs3QnNxDsggspS35vDtvZvas30GqSCylYZRzhxg6AUtp6PGcB13lRidiKY3meM2D0ugMWOr3sta+TWDG9oBq4p5M+CNmwjJj+8AC6IxYJnQXyIjOjOXl3QtlQAtgeenePSloISwvu3NvDFoQy0sOToSghbG8nNeUDxr6WRrLS3lPDqEButMTxVJh98PD6D/lxVLhN/De6PxYKu6JYxAtg6XiH5F60XJYKu2ZroOWxearXU35VavVDq9vO5Y7DP3IIYsAAAAASUVORK5CYII="> <span>扫码成功</span><span>请在手机上确认</span>';
const expiredText =
  '<img src="//s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/qrcode-refresh.png"/><span>二维码失效</span><span>点击刷新</span>';
var QRkey = "";
var pollLoop = null;

function isMobileUser() {
  return OS.find((o) => o.test(navigator.userAgent)) != null;
}

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = unescape(hash[1]);
  }
  return vars;
}

function poll() {
  $.ajax({
    type: "get",
    url: "/poll",
    dataType: "json",
    data: {
      key: QRkey,
    },
    success: function (data) {
      switch (data.code) {
        case 0: {
          const callbackUrl = getUrlVars()["callbackUrl"];
          if (callbackUrl == null) window.open("//www.bilibili.com", "_self");
          else window.open(callbackUrl, "_self");
          window.close();
          break;
        }
        case 86038: {
          clearInterval(pollLoop);
          $(".login-scan__qrcode").off("mouseenter").unbind("mouseleave");
          $(".qrcode__tip").html(expiredText);
          $(".qrcode__tip").click(() => {
            get();
            $(".qrcode__tip").unbind("click");
          });
          $(".qrcode__tip").show();
          break;
        }
        case 86090: {
          $(".login-scan__qrcode").off("mouseenter").unbind("mouseleave");
          $(".qrcode__tip").html(successText);
          $(".qrcode__tip").show();
          break;
        }
        case 86101: {
          //未扫描
          break;
        }
      }

      $("div[data-v-5f77e75b]").removeClass("qrcode-loading");
    },
    error: function (data) {
      console.log(data);
    },
  });
}

function get() {
  $.ajax({
    type: "get",
    url: "/QR",
    dataType: "json",
    success: function (data) {
      QRkey = data.key;
      window.history.pushState(
        {},
        "",
        "/?callbackUrl=%2Fuserinfo%3Fkey%3D" + QRkey
      );
      $(".qrcd-main").attr("src", data.img);

      $(".qrcode__tip").hide();

      $("div[data-v-5f77e75b]").removeClass("qrcode-loading");
      $(".login-scan__qrcode").hover(
        () => {
          $(".scan-tips-icon").show();
        },
        () => {
          $(".scan-tips-icon").hide();
        }
      );

      pollLoop = setInterval(poll, 2000);
    },
    error: function (data) {
      console.log(data);
    },
  });
}

window.onload = () => {
  if (isMobileUser()) {
    $(".login__main").hide();
    $(".login-scan_wp").show();
    return;
  }

  get();
};
