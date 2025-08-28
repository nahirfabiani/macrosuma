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
  let startX = 0;
  let isDragging = false;

  function showSlide(index) {
    slide.style.transition = "transform 0.3s ease";
    slide.style.transform = `translateX(-${index * 100}%)`;
    indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showSlide(currentIndex);
  }

  function startCarousel() {
    interval = setInterval(nextSlide, 3500);
  }

  function stopCarousel() {
    clearInterval(interval);
  }

  // Eventos de los indicadores
  indicators.forEach((indicator, idx) => {
    indicator.addEventListener('click', () => {
      currentIndex = idx;
      showSlide(currentIndex);
      stopCarousel();
      startCarousel();
    });
  });

  // Eventos de deslizamiento (touch + mouse)
  slide.addEventListener('mousedown', (e) => {
    startX = e.pageX;
    isDragging = true;
    slide.style.transition = "none";
    stopCarousel();
  });

  slide.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diff = e.pageX - startX;
    slide.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
  });

  slide.addEventListener('mouseup', (e) => {
    isDragging = false;
    const diff = e.pageX - startX;
    if (diff > 50) prevSlide();
    else if (diff < -50) nextSlide();
    else showSlide(currentIndex);
    startCarousel();
  });

  slide.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      showSlide(currentIndex);
      startCarousel();
    }
  });

  // Touch
  slide.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    isDragging = true;
    slide.style.transition = "none";
    stopCarousel();
  });

  slide.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].pageX - startX;
    slide.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
  });

  slide.addEventListener('touchend', (e) => {
    isDragging = false;
    const diff = e.changedTouches[0].pageX - startX;
    if (diff > 50) prevSlide();
    else if (diff < -50) nextSlide();
    else showSlide(currentIndex);
    startCarousel();
  });

  showSlide(currentIndex);
  startCarousel();
}

// Inicializa todos los carousels en la página
document.querySelectorAll('.carousel-container').forEach(setupCarousel);

