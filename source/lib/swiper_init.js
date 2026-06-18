var swiper = new Swiper('.blog-slider', {
  passiveListeners: true,
  spaceBetween: 30,
  effect: 'cards',
  cardsEffect: {
    slideShadows: false,
    perSlideOffset: 8,
    perSlideRotate: 2,
  },
  loop: true,
  autoplay: {
    disableOnInteraction: true,
    delay: 3000
  },
  mousewheel: true,
  // autoHeight: true,
  pagination: {
    el: '.blog-slider__pagination',
    clickable: true,
  }
});

var comtainer = document.getElementById('swiper_container');
  if (comtainer !== null) {
    comtainer.onmouseenter = function() {
      swiper.autoplay.stop();
    };
    comtainer.onmouseleave = function() {
      swiper.autoplay.start();
      }
  } else {}

// 强制加载轮播图图片（绕过懒加载）
function forceLoadSwiperImages() {
  // 新模板选择器
  document.querySelectorAll('.blog-slider__cover').forEach(function(img) {
    var lazySrc = img.getAttribute('data-lazy-src');
    if (lazySrc && lazySrc !== '设置封面(填写URL地址即可)') {
      img.src = lazySrc;
      img.style.opacity = '1';
    }
  });
  // 旧模板选择器（兼容）
  document.querySelectorAll('.blog-slider__img img').forEach(function(img) {
    var lazySrc = img.getAttribute('data-lazy-src');
    if (lazySrc && lazySrc !== '设置封面(填写URL地址即可)') {
      img.src = lazySrc;
      img.style.opacity = '1';
    }
  });
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', forceLoadSwiperImages);
} else {
  forceLoadSwiperImages();
}

// Swiper 切换时也加载图片
swiper.on('slideChange', function() {
  setTimeout(forceLoadSwiperImages, 50);
});