// === MENÚ Y BUSCADOR ===
const menuIcon = document.getElementById("menu-icon");
const slideoutMenu = document.getElementById("slideout-menu");
const searchIcon = document.getElementById("search-icon");
const searchBox = document.getElementById("searchbox");

if (searchIcon && searchBox) {
  searchIcon.addEventListener('click', function () {
    if (searchBox.style.top == '72px') {
      searchBox.style.top = '24px';
      searchBox.style.pointerEvents = 'none';
    } else {
      searchBox.style.top = '72px';
      searchBox.style.pointerEvents = 'auto';
    }
  });
}

if (menuIcon && slideoutMenu) {
  menuIcon.addEventListener('click', function () {
    if (slideoutMenu.style.opacity == "1") {
      slideoutMenu.style.opacity = '0';
      slideoutMenu.style.pointerEvents = 'none';
    } else {
      slideoutMenu.style.opacity = '1';
      slideoutMenu.style.pointerEvents = 'auto';
    }
  });
}

// === CARRUSEL MEJORADO PARA MÚLTIPLES INSTANCIAS ===
function setupCarousel(carouselContainer) {
  const slide = carouselContainer.querySelector('.carousel-slide');
  const items = carouselContainer.querySelectorAll('.carousel-item');
  const indicators = carouselContainer.querySelectorAll('.indicator');
  
  // Si no hay elementos, salir
  if (items.length === 0) return;
  
  let currentIndex = 0;
  let interval;
  let startX = 0;
  let isDragging = false;

  function showSlide(index) {
    slide.style.transition = "transform 0.3s ease";
    slide.style.transform = `translateX(-${index * 100}%)`;
    if (indicators.length > 0) {
      indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide(currentIndex);
  }

  function startCarousel() {
    // Solo iniciar el carrusel si hay más de un elemento
    if (items.length > 1) {
      interval = setInterval(nextSlide, 3500);
    }
  }

  function stopCarousel() {
    clearInterval(interval);
  }

  // Configurar indicadores si existen
  if (indicators.length > 0) {
    indicators.forEach((indicator, idx) => {
      indicator.addEventListener('click', () => {
        currentIndex = idx;
        showSlide(currentIndex);
        stopCarousel();
        startCarousel();
      });
    });
  }

  // Eventos de arrastre solo para carrousels con múltiples elementos
  if (items.length > 1) {
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
  }

  showSlide(currentIndex);
  startCarousel();
}

// Inicializar todos los carousels al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.carousel-container').forEach(setupCarousel);
});

// === SCROLL SUAVE PARA ANCLAS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      e.preventDefault();
      window.scrollTo({
        top: targetElement.offsetTop - 60, // Ajuste por navbar
        behavior: 'smooth'
      });
    }
  });
});

// === TOGGLE SIDEBAR ===
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('active');
  document.querySelector('.overlay').classList.toggle('active');
}