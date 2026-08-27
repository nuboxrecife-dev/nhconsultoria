/* ==========================================================================
   JAVASCRIPT V3.2 — CONFIGURATIONS & INTERACTIVE PREMIUM BEHAVIORS
   ========================================================================== */

// 1. CONFIGURATIONS
// SUBSTITUA 'https://pay.hotmart.com/exemplo' pelo link de checkout real da sua plataforma (Hotmart, Kiwify, etc.)
const CHECKOUT_URL = "https://pay.hotmart.com/exemplo"; 
const WHATSAPP_NUMBER = "5511961778917";             // WhatsApp Real (11) 96177-8917
const WHATSAPP_MESSAGE = "Olá, gostaria de saber mais sobre o Kit de Pastas Sanitárias de R$ 59,90.";

// 2. INITIALIZE PAGE
document.addEventListener("DOMContentLoaded", () => {
    setupCheckoutLinks();
    setupWhatsAppWidget();
    setupThemeToggle();
    setup3DTiltEffect();
    setupCountdownTimer();
    setupTestimonialsCarousel();
    setupFaqAccordion();
    setupMobileStickyBar();
    setupHeaderScrollEffect();
    setupReadingProgressBar();
    setupScrollAnimations();
});

// Setup all checkout buttons to point to CHECKOUT_URL and track analytics events
function setupCheckoutLinks() {
    const checkoutButtons = document.querySelectorAll(".checkout-btn");
    checkoutButtons.forEach(button => {
        button.href = CHECKOUT_URL;
        
        // Dispara o rastreamento do Pixel (InitiateCheckout) se o script do Pixel estiver ativo
        button.addEventListener("click", () => {
            if (typeof fbq === "function") {
                fbq('track', 'InitiateCheckout', {
                    content_name: 'Kit de Pastas Sanitárias',
                    value: 59.90,
                    currency: 'BRL'
                });
            }
        });
    });
}

// 3. WIDGET DE CHAT DO WHATSAPP ATIVO
function setupWhatsAppWidget() {
    const widget = document.getElementById("whatsapp-widget");
    const trigger = document.getElementById("whatsapp-trigger");
    const balloon = document.getElementById("whatsapp-balloon");
    const closeBtn = document.getElementById("chat-close-btn");
    const typingIndicator = document.getElementById("typing-indicator");
    const chatMessage = document.getElementById("chat-message");
    const chatConnectBtn = document.getElementById("whatsapp-chat-btn");
    const unreadBadge = document.getElementById("whatsapp-unread");

    if (!widget || !trigger || !balloon) return;

    // Configurar link real do WhatsApp
    const encodedText = encodeURIComponent(WHATSAPP_MESSAGE);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    if (chatConnectBtn) {
        chatConnectBtn.href = whatsappUrl;
    }

    // Toggle do Balão de Chat ao clicar no botão flutuante
    trigger.addEventListener("click", () => {
        const isVisible = window.getComputedStyle(balloon).display !== "none";
        if (isVisible) {
            balloon.style.display = "none";
        } else {
            balloon.style.display = "flex";
            if (unreadBadge) unreadBadge.style.display = "none"; // Oculta notificação ao ler
        }
    });

    // Fechar balão
    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            balloon.style.display = "none";
        });
    }

    // Abertura automática ativa com delay (3.5 segundos) e simulação de digitação
    setTimeout(() => {
        // Se o balão já não tiver sido aberto manualmente
        if (window.getComputedStyle(balloon).display === "none") {
            balloon.style.display = "flex";
            if (unreadBadge) unreadBadge.style.display = "none";
            
            // Simular digitação
            setTimeout(() => {
                if (typingIndicator) typingIndicator.style.display = "none";
                if (chatMessage) {
                    chatMessage.style.display = "block";
                    // Efeito de entrada suave no texto
                    chatMessage.style.opacity = 0;
                    let opacity = 0;
                    const fade = setInterval(() => {
                        if (opacity >= 1) clearInterval(fade);
                        chatMessage.style.opacity = opacity;
                        opacity += 0.1;
                    }, 30);
                }
            }, 2000); // 2 segundos digitando
        }
    }, 3500);
}

// 4. ALTERNADOR DE TEMA (LIGHT / DARK MODE)
function setupThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    if (!toggleBtn) return;

    // Recupera preferência salva
    const savedTheme = localStorage.getItem("theme");
    
    // Se não houver preferência salva, verifica o esquema de cores preferido do sistema
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }

    // Alternar tema ao clicar
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        
        // Salva preferência no localStorage
        if (document.body.classList.contains("dark-theme")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
}

// 5. EFEITO 3D TILT INTERATIVO (MOCKUP HERO)
function setup3DTiltEffect() {
    const tiltContainer = document.querySelector(".tilt-interactive");
    if (!tiltContainer) return;

    tiltContainer.addEventListener("mousemove", (e) => {
        const bounds = tiltContainer.getBoundingClientRect();
        
        // Coordenadas relativas do cursor dentro do mockup
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        
        // Centraliza coordenadas (centro da imagem = 0, 0)
        const xPercent = (mouseX / bounds.width) - 0.5;
        const yPercent = (mouseY / bounds.height) - 0.5;
        
        // Define o ângulo máximo de rotação em graus (limite seguro para não deformar muito)
        const maxRotation = 12; 
        
        // Rotação em Y depende da coordenada X do mouse, Rotação em X depende da coordenada Y do mouse
        const rotateY = xPercent * maxRotation;
        const rotateX = -yPercent * maxRotation; // Inverte para inclinar em direção ao mouse
        
        // Aplica transformações 3D dinâmicas
        tiltContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        
        // Desloca sutilmente a sombra na direção oposta para aumentar a sensação 3D
        const shadow = tiltContainer.querySelector(".mockup-shadow");
        if (shadow) {
            const shadowX = -rotateY * 0.8;
            const shadowY = rotateX * 0.8;
            shadow.style.transform = `translateX(${shadowX}px) translateY(${shadowY}px) scale(0.95)`;
            shadow.style.filter = "blur(8px)";
        }
    });

    // Reseta rotações quando o mouse sair do mockup
    tiltContainer.addEventListener("mouseleave", () => {
        tiltContainer.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        const shadow = tiltContainer.querySelector(".mockup-shadow");
        if (shadow) {
            shadow.style.transform = "none";
            shadow.style.filter = "blur(6px)";
        }
    });
}

// 6. CRONÔMETRO REGRESSIVO DE URGÊNCIA (15 MINUTOS PERSISTENTE)
function setupCountdownTimer() {
    const countdownContainers = document.querySelectorAll(".countdown-container");
    if (countdownContainers.length === 0) return;

    const DURATION_SECONDS = 15 * 60; // 15 minutos em segundos
    const STORAGE_KEY = "kit_pastas_timer_end";

    let timerEnd = sessionStorage.getItem(STORAGE_KEY);
    const now = Math.floor(Date.now() / 1000);

    // Se o timer não existir na sessão ou já tiver expirado, define um novo término
    if (!timerEnd || parseInt(timerEnd) <= now) {
        timerEnd = now + DURATION_SECONDS;
        sessionStorage.setItem(STORAGE_KEY, timerEnd.toString());
    } else {
        timerEnd = parseInt(timerEnd);
    }

    function updateTimer() {
        const currentNow = Math.floor(Date.now() / 1000);
        let remaining = timerEnd - currentNow;

        // Se o tempo acabar, reinicia sutilmente
        if (remaining <= 0) {
            timerEnd = currentNow + DURATION_SECONDS;
            sessionStorage.setItem(STORAGE_KEY, timerEnd.toString());
            remaining = DURATION_SECONDS;
        }

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        // Formata os números com zero à esquerda
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

        // Atualiza todos os contadores da página
        countdownContainers.forEach(container => {
            const minSpan = container.querySelector(".minutes");
            const secSpan = container.querySelector(".seconds");
            if (minSpan && secSpan) {
                minSpan.textContent = formattedMinutes;
                secSpan.textContent = formattedSeconds;
            }
        });
    }

    updateTimer(); // Roda a primeira vez imediatamente
    setInterval(updateTimer, 1000); // Roda a cada segundo
}

// 7. CARROSSEL DE DEPOIMENTOS
function setupTestimonialsCarousel() {
    const slider = document.getElementById("testimonials-slider");
    const prevBtn = document.getElementById("slider-prev-btn");
    const nextBtn = document.getElementById("slider-next-btn");
    const dotsContainer = document.getElementById("slider-dots-container");
    
    if (!slider) return;
    
    const slides = slider.querySelectorAll(".testimonial-slide");
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    let autoSlideInterval;
    const AUTO_SLIDE_DELAY = 6000; // 6 segundos por depoimento

    // Configurar os botões indicadores inferiores (dots)
    let dotsHtml = "";
    slides.forEach((_, idx) => {
        dotsHtml += `<span class="dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>`;
    });
    if (dotsContainer) {
        dotsContainer.innerHTML = dotsHtml;
        
        // Clique nas bolinhas
        const dots = dotsContainer.querySelectorAll(".dot");
        dots.forEach(dot => {
            dot.addEventListener("click", () => {
                const targetIdx = parseInt(dot.getAttribute("data-index"));
                changeSlide(targetIdx);
                resetAutoSlide();
            });
        });
    }

    function changeSlide(targetIndex) {
        // Garante loop do carrossel
        if (targetIndex >= slides.length) {
            targetIndex = 0;
        } else if (targetIndex < 0) {
            targetIndex = slides.length - 1;
        }

        // Remove classe ativa do slide e bolinha atual
        slides[currentIndex].classList.remove("active");
        
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll(".dot");
            dots[currentIndex].classList.remove("active");
            dots[targetIndex].classList.add("active");
        }

        // Ativa o novo slide
        slides[targetIndex].classList.add("active");
        currentIndex = targetIndex;
    }

    // Controles Prev/Next
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            changeSlide(currentIndex - 1);
            resetAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            changeSlide(currentIndex + 1);
            resetAutoSlide();
        });
    }

    // Auto rotação
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            changeSlide(currentIndex + 1);
        }, AUTO_SLIDE_DELAY);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Inicia rotação automática
    startAutoSlide();

    // Pausar auto-slide quando o mouse estiver sobre o carrossel
    slider.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
    slider.addEventListener("mouseleave", startAutoSlide);
}

// FAQ Accordion functionality
function setupFaqAccordion() {
    const faqQuestions = document.querySelectorAll(".faq-question");
    
    faqQuestions.forEach(button => {
        button.addEventListener("click", () => {
            const item = button.parentElement;
            const answer = item.querySelector(".faq-answer");
            const isExpanded = button.getAttribute("aria-expanded") === "true";
            
            // Close other open FAQ items
            const activeItems = document.querySelectorAll(".faq-item.active");
            activeItems.forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove("active");
                    activeItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
                    activeItem.querySelector(".faq-answer").setAttribute("hidden", "true");
                }
            });
            
            // Toggle current item
            if (isExpanded) {
                button.setAttribute("aria-expanded", "false");
                item.classList.remove("active");
                answer.setAttribute("hidden", "true");
            } else {
                button.setAttribute("aria-expanded", "true");
                item.classList.add("active");
                answer.removeAttribute("hidden");
            }
        });
    });
}

// Header shrink and border effect on scroll
function setupHeaderScrollEffect() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }, { passive: true });
}

// Reading progress bar calculator
function setupReadingProgressBar() {
    const progressBar = document.getElementById("reading-progress");
    if (!progressBar) return;
    
    window.addEventListener("scroll", () => {
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPosition = window.scrollY;
        const progress = scrollHeight > 0 ? (scrollPosition / scrollHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

// Mobile Sticky Bar visibility on scroll & WhatsApp push sync
function setupMobileStickyBar() {
    const mobileBar = document.getElementById("mobile-sticky-bar");
    const heroSection = document.getElementById("hero");
    const whatsappWidget = document.getElementById("whatsapp-widget");
    
    if (!mobileBar || !heroSection) return;
    
    let isTicking = false;
    
    window.addEventListener("scroll", () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                const heroHeight = heroSection.offsetHeight;
                const scrollPosition = window.scrollY;
                
                // Show sticky bar after user scrolls past the Hero section
                if (scrollPosition > (heroHeight - 100)) {
                    mobileBar.classList.add("visible");
                    if (whatsappWidget) whatsappWidget.classList.add("pushed");
                } else {
                    mobileBar.classList.remove("visible");
                    if (whatsappWidget) whatsappWidget.classList.remove("pushed");
                }
                isTicking = false;
            });
            isTicking = true;
        }
    }, { passive: true });
}

// Advanced scroll animations using Intersection Observer with stagger support
function setupScrollAnimations() {
    // Setup Stagger Animation Delays
    const staggerContainers = document.querySelectorAll(".stagger-container");
    staggerContainers.forEach(container => {
        const items = container.querySelectorAll(".animate-stagger-item");
        items.forEach((item, index) => {
            item.style.transitionDelay = `${index * 80}ms`;
        });
    });

    // Identify elements to animate
    const directAnimations = document.querySelectorAll(
        ".animate-fade-up, .animate-fade-left, .animate-fade-right, .animate-scale-up"
    );
    
    // Add base scroll-animate class dynamically for progressive enhancement
    directAnimations.forEach(el => el.classList.add("scroll-animate"));
    staggerContainers.forEach(el => el.classList.add("scroll-animate"));

    const observerOptions = {
        root: null,
        rootMargin: "-40px 0px",
        threshold: 0.08
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animated");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Start observing
    directAnimations.forEach(el => observer.observe(el));
    staggerContainers.forEach(el => observer.observe(el));
}
