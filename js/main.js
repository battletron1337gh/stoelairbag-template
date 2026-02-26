/**
 * STOELAIRBAG - Main JavaScript
 * Interactieve functionaliteiten
 */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initLanguageToggle();
    initBeforeAfterSlider();
    initKentekenChecker();
    initStoelChecker();
    initSmoothScroll();
    initScrollAnimations();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuBtn) return;
    
    menuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('mobile-active');
        const icon = menuBtn.querySelector('i');
        
        if (navMenu.classList.contains('mobile-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '70px';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.background = 'white';
            navMenu.style.padding = '20px';
            navMenu.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            navMenu.style.display = 'none';
        }
    });
}

/**
 * Language Toggle (NL/EN)
 */
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    
    if (!langToggle) return;
    
    langToggle.addEventListener('click', function() {
        const nlSpan = langToggle.querySelector('.lang-nl');
        const enSpan = langToggle.querySelector('.lang-en');
        
        if (nlSpan.classList.contains('active')) {
            nlSpan.classList.remove('active');
            enSpan.classList.add('active');
            // Hier zou de vertaling komen
            console.log('Switching to English...');
        } else {
            enSpan.classList.remove('active');
            nlSpan.classList.add('active');
            // Hier zou de vertaling komen
            console.log('Switching to Dutch...');
        }
    });
}

/**
 * Before/After Slider
 */
function initBeforeAfterSlider() {
    const container = document.querySelector('.comparison-container');
    if (!container) return;
    
    const afterImage = container.querySelector('.comparison-image.after');
    const handle = container.querySelector('.slider-handle');
    let isDragging = false;
    
    function updateSlider(x) {
        const rect = container.getBoundingClientRect();
        let position = ((x - rect.left) / rect.width) * 100;
        position = Math.max(0, Math.min(100, position));
        
        afterImage.style.width = position + '%';
        handle.style.left = position + '%';
    }
    
    handle.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });
    
    // Touch events
    handle.addEventListener('touchstart', () => isDragging = true);
    document.addEventListener('touchend', () => isDragging = false);
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSlider(e.touches[0].clientX);
    });
    
    // Click to move
    container.addEventListener('click', (e) => {
        updateSlider(e.clientX);
    });
}

/**
 * Kenteken Checker
 */
function initKentekenChecker() {
    const kentekenInput = document.getElementById('kenteken');
    const searchBtn = document.getElementById('kentekenSearch');
    const resultDiv = document.getElementById('kentekenResult');
    
    if (!kentekenInput || !searchBtn) return;
    
    // Format kenteken while typing
    kentekenInput.addEventListener('input', function(e) {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        // Format: XX-123-XX of 12-XX-XX
        if (value.length > 2 && value.length <= 5) {
            value = value.slice(0, 2) + '-' + value.slice(2);
        } else if (value.length > 5) {
            value = value.slice(0, 2) + '-' + value.slice(2, 5) + '-' + value.slice(5, 7);
        }
        
        e.target.value = value;
    });
    
    searchBtn.addEventListener('click', function() {
        const kenteken = kentekenInput.value.trim();
        
        if (kenteken.length < 6) {
            showKentekenError('Voer een geldig kenteken in');
            return;
        }
        
        // Simuleer kenteken lookup
        searchKenteken(kenteken);
    });
    
    kentekenInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    function searchKenteken(kenteken) {
        // Toon loading state
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Kenteken wordt gecontroleerd...</p>';
        
        // Simuleer API call
        setTimeout(() => {
            // Mock data - in productie zou dit een echte RDW API call zijn
            const mockData = getMockVehicleData(kenteken);
            displayKentekenResult(mockData);
        }, 1000);
    }
    
    function getMockVehicleData(kenteken) {
        // Mock data generator
        const merken = ['Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Ford', 'Toyota', 'Renault'];
        const modellen = {
            'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan'],
            'BMW': ['3-serie', '5-serie', 'X3', 'X5'],
            'Mercedes': ['A-Klasse', 'C-Klasse', 'E-Klasse', 'GLC'],
            'Audi': ['A3', 'A4', 'Q3', 'Q5'],
            'Ford': ['Focus', 'Fiesta', 'Kuga', 'Mondeo'],
            'Toyota': ['Corolla', 'Yaris', 'RAV4', 'Camry'],
            'Renault': ['Clio', 'Megane', 'Captur', 'Kadjar']
        };
        
        const merk = merken[Math.floor(Math.random() * merken.length)];
        const model = modellen[merk][Math.floor(Math.random() * modellen[merk].length)];
        const jaar = 2015 + Math.floor(Math.random() * 9);
        
        return {
            kenteken: kenteken,
            merk: merk,
            model: model,
            bouwjaar: jaar,
            stoeltype: Math.random() > 0.5 ? 'Leder' : 'Stof',
            airbagCompatibel: true
        };
    }
    
    function displayKentekenResult(data) {
        resultDiv.innerHTML = `
            <div class="kenteken-success">
                <h4><i class="fas fa-check-circle" style="color: #48bb78;"></i> Kenteken gevonden!</h4>
                <div class="vehicle-info">
                    <p><strong>${data.merk} ${data.model}</strong></p>
                    <p>Bouwjaar: ${data.bouwjaar} | Stoeltype: ${data.stoeltype}</p>
                </div>
                <div class="compatible-products">
                    <h5>Beschikbare producten voor uw auto:</h5>
                    <div class="product-links">
                        <a href="pages/webshop.html?type=airbag&kenteken=${data.kenteken}" class="product-link">
                            <i class="fas fa-airbag"></i> Bekijk airbags
                        </a>
                        <a href="pages/webshop.html?type=hoes&kenteken=${data.kenteken}" class="product-link">
                            <i class="fas fa-chair"></i> Bekijk stoelhoezen
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    function showKentekenError(message) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<p style="color: #e53e3e;"><i class="fas fa-exclamation-circle"></i> ${message}</p>`;
    }
}

/**
 * Stoelchecker Quiz
 */
function initStoelChecker() {
    const quizContent = document.getElementById('quizContent');
    const quizResult = document.getElementById('quizResult');
    
    if (!quizContent) return;
    
    let currentQuestion = 1;
    let answers = {};
    
    const questions = {
        1: {
            question: 'Wat is het probleem met uw stoel?',
            options: {
                'airbag': 'Airbag storing of defect',
                'scheur': 'Scheur of beschadiging in bekleding',
                'slijtage': 'Slijtage / versleten stoel',
                'brandgat': 'Brandgat in stoel',
                'compleet': 'Meerdere problemen / complete renovatie'
            }
        },
        2: {
            question: 'Wat voor bekleding heeft uw stoel?',
            options: {
                'leder': 'Leder of kunstleder',
                'stof': 'Stof / textiel',
                'alcantara': 'Alcantara',
                'combinatie': 'Combinatie van materialen'
            }
        },
        3: {
            question: 'Welke stoel(en) hebben het probleem?',
            options: {
                'bestuurder': 'Bestuurdersstoel',
                'passagier': 'Passagiersstoel',
                'achterbank': 'Achterbank',
                'alle': 'Alle stoelen'
            }
        },
        4: {
            question: 'Hoe urgent is de reparatie?',
            options: {
                'direct': 'Direct nodig (airbag waarschuwing)',
                'binnenkort': 'Binnen 2 weken',
                'planning': 'Kan in planning',
                'onderzoek': 'Eerst advies gewenst'
            }
        },
        5: {
            question: 'Wilt u de auto achterlaten of alleen de stoel?',
            options: {
                'auto': 'Auto achterlaten (A-tot-Z service)',
                'stoel': 'Alleen stoel demonteren en brengen',
                'advies': 'Eerst advies aan huis/werk'
            }
        }
    };
    
    // Event delegation voor quiz opties
    quizContent.addEventListener('click', function(e) {
        if (e.target.classList.contains('quiz-option')) {
            const value = e.target.dataset.value;
            answers[currentQuestion] = value;
            
            if (currentQuestion < 5) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                showQuizResult();
            }
        }
    });
    
    function showQuestion(num) {
        const q = questions[num];
        quizContent.innerHTML = `
            <div class="quiz-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(num / 5) * 100}%"></div>
                </div>
                <span>Vraag ${num} van 5</span>
            </div>
            <div class="quiz-question active">
                <h3>${q.question}</h3>
                <div class="quiz-options">
                    ${Object.entries(q.options).map(([key, text]) => `
                        <button class="quiz-option" data-value="${key}">${text}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    function showQuizResult() {
        quizContent.style.display = 'none';
        quizResult.style.display = 'block';
        
        // Genereer advies op basis van antwoorden
        const advice = generateAdvice(answers);
        
        quizResult.innerHTML = `
            <div class="quiz-advice">
                <i class="fas fa-lightbulb" style="font-size: 3rem; color: var(--accent-orange);"></i>
                <h3>Uw persoonlijke advies</h3>
                <div class="advice-content">
                    <h4>${advice.title}</h4>
                    <p>${advice.description}</p>
                    <div class="advice-service">
                        <strong>Aanbevolen service:</strong>
                        <span>${advice.service}</span>
                    </div>
                    <div class="advice-estimate">
                        <strong>Geschatte kosten:</strong>
                        <span>${advice.price}</span>
                    </div>
                </div>
                <div class="advice-actions">
                    <a href="pages/contact.html" class="btn btn-primary">Direct offerte aanvragen</a>
                    <a href="https://wa.me/31612345678" class="btn btn-whatsapp">
                        <i class="fab fa-whatsapp"></i> WhatsApp advies
                    </a>
                </div>
                <button class="btn btn-secondary" onclick="restartQuiz()" style="margin-top: 1rem;">
                    <i class="fas fa-redo"></i> Opnieuw beginnen
                </button>
            </div>
        `;
    }
    
    function generateAdvice(answers) {
        const problem = answers[1];
        const material = answers[2];
        const urgency = answers[4];
        
        let advice = {
            title: '',
            description: '',
            service: '',
            price: ''
        };
        
        if (problem === 'airbag') {
            advice.title = 'Airbag reparatie aanbevolen';
            advice.description = 'Op basis van uw antwoorden adviseren wij een professionele airbag reparatie. Dit is een veiligheidsonderdeel dat vakkundig behandeld moet worden.';
            advice.service = 'Airbag reparatie & montage';
            advice.price = 'Vanaf €149,95';
        } else if (problem === 'scheur' || problem === 'brandgat') {
            advice.title = 'Stoelbekleding reparatie';
            advice.description = `${material === 'leder' ? 'Leder' : 'Stof'} kan vaak perfect gerepareerd worden. Onze specialisten zorgen voor onzichtbaar herstel.`;
            advice.service = 'Stoelbekleding reparatie';
            advice.price = 'Vanaf €89,95';
        } else if (problem === 'slijtage' || problem === 'compleet') {
            advice.title = 'Complete stoelrenovatie';
            advice.description = 'Voor slijtage of meerdere problemen adviseren wij een complete renovatie. Uw stoel wordt als nieuw!';
            advice.service = 'Complete stoelrenovatie';
            advice.price = 'Vanaf €299,95';
        }
        
        if (urgency === 'direct') {
            advice.description += ' Gezien de urgentie raden wij aan om direct contact op te nemen voor een spoedafspraak.';
        }
        
        return advice;
    }
    
    // Global restart function
    window.restartQuiz = function() {
        currentQuestion = 1;
        answers = {};
        quizContent.style.display = 'block';
        quizResult.style.display = 'none';
        showQuestion(1);
    };
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.service-card, .review-card, .usp-item').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

/**
 * Cart Functions
 */
let cart = [];

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    showCartNotification(product.name);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

function showCartNotification(productName) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${productName} toegevoegd aan winkelwagen</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Utility Functions
 */
function formatPrice(price) {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in other scripts
window.StoelAirbag = {
    addToCart,
    updateCartCount,
    formatPrice
};
