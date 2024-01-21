const OS = [
  /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i,
  /cfnetwork\/.+darwin/i,
  /(android)[\/\s-]?([\w\.]*)/i,
];

function isMobileUser() {
  return OS.find((o) => o.test(navigator.userAgent)) != null;
}

window.onload = () => {
  if (isMobileUser()) {
    $(".login__main").hide();
    $(".login-scan_wp").show();
    return;
  }

  $.ajax({
    type: "get",
    url: "/getQR",
    dataType: "json",
    success: function (data) {
      if (data == null || data == "") {
        return;
      } else {
        $(".qrcd-main").attr("src", data.img);
      }
    },
    error: function (data) {
      console.log(data);
    },
  });

  $("div[data-v-5f77e75b]").removeClass("qrcode-loading");
  $(".login-scan__qrcode").hover(
    () => {
      $(".scan-tips-icon").show();
    },
    () => {
      $(".scan-tips-icon").hide();
    }
  );
};
