/* ------------------ MSEmoji ----------------- */
msemoji.parse(document.body, {
  base: "https://gcore.jsdelivr.net/gh/DellZHackintosh/msemoji@1.1.2/src/",
  ext: ".svg",
  folder: "Color",
  high_contrast: false
});

/* ------------------ 跳转风险提示 ------------------ */
document.body.addEventListener('click', function(e) {
  let target = e.target.closest('.wl-cards a,.card-link, .device-link');
  if (target && !target.href.includes('bulone.github.io')) {
      e.preventDefault();
      let encodedUrl = btoa(target.href);
      let url = '/redirect?url=' + encodedUrl;
      window.open(url, '_blank');
  }
});

/* ------------------ AOS滚动动画 ----------------- */
AOS.init({once: true,
  easing: "ease-out-cubic",
});