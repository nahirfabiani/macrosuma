// Función para inicializar un carrusel con navegación
function initCarousel(carouselClass) {
    const container = document.querySelector(`${carouselClass} .carousel-container`);
    const track = document.querySelector(`${carouselClass} .carousel-track`) || 
                  document.querySelector(`${carouselClass} .carousel-slide`);
    const slides = Array.from(track.children);
    const nextButton = document.querySelector(`${carouselClass} .carousel-btn.next`);
    const prevButton = document.querySelector(`${carouselClass} .carousel-btn.prev`);
    
    // Si no hay botones de navegación, es el carrusel de logos
    if (!nextButton || !prevButton) {
        return initLogosCarousel(carouselClass);
    }
    
    let currentIndex = 0;
    let slideWidth = slides[0].getBoundingClientRect().width + 20; // width + gap
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    function updateSlideWidth() {
        slideWidth = slides[0].getBoundingClientRect().width + 20;
    }

    function moveToSlide(index) {
        // Asegurarse de que el índice esté dentro de los límites
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        track.style.transform = `translateX(-${index * slideWidth}px)`;
        currentIndex = index;
    }

    // Botón siguiente
    nextButton.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
    });

    // Botón anterior
    prevButton.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
    });

    // Eventos táctiles para dispositivos móviles
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchmove', handleTouchMove, { passive: true });
    track.addEventListener('touchend', handleTouchEnd);

    // Eventos de ratón para desktop (para consistencia)
    track.addEventListener('mousedown', handleMouseDown);
    track.addEventListener('mousemove', handleMouseMove);
    track.addEventListener('mouseup', handleMouseUp);
    track.addEventListener('mouseleave', handleMouseUp);

    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = true;
        clearInterval(autoSlide); // Pausar auto-desplazamiento durante el arrastre
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        
        // Mover el track temporalmente durante el arrastre
        track.style.transition = 'none';
        track.style.transform = `translateX(calc(-${currentIndex * slideWidth}px + ${diff}px))`;
    }

    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.4s ease';
        
        const diff = currentX - startX;
        const threshold = slideWidth / 4; // Umbral para cambiar de slide
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Deslizar hacia la derecha -> slide anterior
                moveToSlide(currentIndex - 1);
            } else {
                // Deslizar hacia la izquierda -> slide siguiente
                moveToSlide(currentIndex + 1);
            }
        } else {
            // Volver al slide actual si no se superó el umbral
            moveToSlide(currentIndex);
        }
        
        // Reanudar auto-desplazamiento después de un tiempo
        setTimeout(() => {
            autoSlide = setInterval(() => {
                moveToSlide(currentIndex + 1);
            }, 4000);
        }, 1000);
    }

    // Funciones para eventos de ratón (similar a touch)
    function handleMouseDown(e) {
        e.preventDefault();
        startX = e.clientX;
        currentX = startX;
        isDragging = true;
        clearInterval(autoSlide);
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        currentX = e.clientX;
        const diff = currentX - startX;
        
        track.style.transition = 'none';
        track.style.transform = `translateX(calc(-${currentIndex * slideWidth}px + ${diff}px))`;
    }

    function handleMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.4s ease';
        
        const diff = currentX - startX;
        const threshold = slideWidth / 4;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                moveToSlide(currentIndex - 1);
            } else {
                moveToSlide(currentIndex + 1);
            }
        } else {
            moveToSlide(currentIndex);
        }
        
        setTimeout(() => {
            autoSlide = setInterval(() => {
                moveToSlide(currentIndex + 1);
            }, 4000);
        }, 1000);
    }

    // Auto-slide cada 4 segundos
    let autoSlide = setInterval(() => {
        moveToSlide(currentIndex + 1);
    }, 4000);

    // Pausar auto-slide al pasar el mouse
    container.addEventListener('mouseenter', () => clearInterval(autoSlide));
    container.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 4000);
    });

    // Recalcular ancho al redimensionar
    window.addEventListener('resize', () => {
        updateSlideWidth();
        moveToSlide(currentIndex);
    });

    // Inicializar
    updateSlideWidth();
}

// Función para el carrusel de logos (animación automática)
function initLogosCarousel(carouselClass) {
    const slide = document.querySelector(`${carouselClass} .carousel-slide`);
    const logos = Array.from(slide.children);
    const logoWidth = logos[0].getBoundingClientRect().width + 30; // width + gap
    
    // Duplicar los logos para una transición suave
    logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        slide.appendChild(clone);
    });
    
    let position = 0;
    const animationSpeed = 1; // píxeles por frame
    let isPaused = false;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    function animateLogos() {
        if (!isPaused) {
            position -= animationSpeed;
            
            // Si hemos desplazado todo el ancho del conjunto original de logos, reiniciamos
            if (position <= -logoWidth * logos.length / 2) {
                position = 0;
            }
            
            slide.style.transform = `translateX(${position}px)`;
        }
        requestAnimationFrame(animateLogos);
    }
    
    // Eventos táctiles para pausar/reanudar
    slide.addEventListener('touchstart', handleTouchStart, { passive: true });
    slide.addEventListener('touchmove', handleTouchMove, { passive: true });
    slide.addEventListener('touchend', handleTouchEnd);
    
    // Eventos de ratón para desktop
    slide.addEventListener('mousedown', handleMouseDown);
    slide.addEventListener('mousemove', handleMouseMove);
    slide.addEventListener('mouseup', handleMouseUp);
    slide.addEventListener('mouseleave', handleMouseUp);
    
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = true;
        isPaused = true;
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        
        // Mover manualmente el carrusel durante el arrastre
        position += diff * 0.5; // Reducir la sensibilidad
        startX = currentX;
        
        // Limitar el desplazamiento
        if (position > 0) position = 0;
        if (position < -logoWidth * logos.length) position = -logoWidth * logos.length;
        
        slide.style.transform = `translateX(${position}px)`;
    }
    
    function handleTouchEnd() {
        isDragging = false;
        // Reanudar la animación después de un breve retraso
        setTimeout(() => {
            isPaused = false;
        }, 1000);
    }
    
    // Funciones para eventos de ratón
    function handleMouseDown(e) {
        e.preventDefault();
        startX = e.clientX;
        currentX = startX;
        isDragging = true;
        isPaused = true;
    }
    
    function handleMouseMove(e) {
        if (!isDragging) return;
        currentX = e.clientX;
        const diff = currentX - startX;
        
        position += diff * 0.5;
        startX = currentX;
        
        if (position > 0) position = 0;
        if (position < -logoWidth * logos.length) position = -logoWidth * logos.length;
        
        slide.style.transform = `translateX(${position}px)`;
    }
    
    function handleMouseUp() {
        isDragging = false;
        setTimeout(() => {
            isPaused = false;
        }, 1000);
    }

    // Iniciar animación
    animateLogos();
}

// Inicializar todos los carruseles cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initCarousel('.carousel-mala-praxis');
    initCarousel('.carousel-otros-seguros');
    initCarousel('.carousel-logos');
});