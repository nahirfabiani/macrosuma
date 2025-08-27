const menuIcon = document.getElementById("menu-icon");
const slideoutMenu = document.getElementById("slideout-menu");
const searchIcon = document.getElementById("search-icon");
const searchBox = document.getElementById("searchbox");

searchIcon.addEventListener('click', function () {
  if (searchBox.style.top == '72px') {
    searchBox.style.top = '24px';
    searchBox.style.pointerEvents = 'none';
  } else {
    searchBox.style.top = '72px';
    searchBox.style.pointerEvents = 'auto';
  }
});

menuIcon.addEventListener('click', function () {
  if (slideoutMenu.style.opacity == "1") {
    slideoutMenu.style.opacity = '0';
    slideoutMenu.style.pointerEvents = 'none';
  } else {
    slideoutMenu.style.opacity = '1';
    slideoutMenu.style.pointerEvents = 'auto';
  }
})

function setupCarousel(carouselContainer) {
  const slide = carouselContainer.querySelector('.carousel-slide');
  const images = carouselContainer.querySelectorAll('.carousel-slide img');
  const indicators = carouselContainer.querySelectorAll('.indicator');
  let currentIndex = 0;
  let interval;

  function showSlide(index) {
    slide.style.transform = `translateX(-${index * 100}%)`;
    indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    showSlide(currentIndex);
  }

  function startCarousel() {
    interval = setInterval(nextSlide, 3500);
  }

  indicators.forEach((indicator, idx) => {
    indicator.addEventListener('click', () => {
      currentIndex = idx;
      showSlide(currentIndex);
      clearInterval(interval);
      startCarousel();
    });
  });

  showSlide(currentIndex);
  startCarousel();
}

// Inicializa todos los carousels en la página
document.querySelectorAll('.carousel-container').forEach(setupCarousel);