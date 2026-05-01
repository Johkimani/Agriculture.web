// main.js

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Mobile Menu Toggle (Hamburger)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // 2. Testimonial Carousel
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showNextTestimonial() {
        if (testimonials.length === 0) return;
        
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }

    if (testimonials.length > 0) {
        setInterval(showNextTestimonial, 5000);
    }

    // 3. Scroll Animation (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Set initial state
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // 4. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Statistics Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 100; // The lower the slower

    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const isDecimal = target % 1 !== 0;

                const updateCount = () => {
                    const current = +counter.innerText;
                    const inc = target / speed;

                    if (current < target) {
                        counter.innerText = isDecimal ? (current + inc).toFixed(1) : Math.ceil(current + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 6. ROI Calculator Logic
    const calcBtn = document.getElementById('calculate-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const acreage = document.getElementById('acreage').value;
            const equipType = document.getElementById('equipment-type').value;
            const resultDiv = document.getElementById('calc-result');
            const resultText = document.getElementById('result-text');

            if (!acreage || acreage <= 0) {
                alert("Please enter a valid farm size in acres.");
                return;
            }

            // Simple mock calculation logic based on $500 baseline profit per acre
            const baselineProfit = acreage * 500;
            let profitIncrease = 0;

            if (equipType === 'tractor') {
                profitIncrease = baselineProfit * 0.15;
            } else if (equipType === 'irrigation') {
                profitIncrease = (baselineProfit * 0.20) + (acreage * 50); // Plus water savings
            } else if (equipType === 'harvester') {
                profitIncrease = baselineProfit * 0.10;
            }

            // Show result block
            resultDiv.style.display = 'block';
            
            // Animate number inside resultText
            let start = 0;
            const duration = 1000; // ms
            const interval = 10;
            const step = profitIncrease / (duration / interval);
            
            const countInterval = setInterval(() => {
                start += step;
                if (start >= profitIncrease) {
                    clearInterval(countInterval);
                    resultText.innerText = `+$${Math.round(profitIncrease).toLocaleString()}`;
                } else {
                    resultText.innerText = `+$${Math.round(start).toLocaleString()}`;
                }
            }, interval);
        });
    }

    // 8. Live Market Prices Logic
    const marketData = {
        nairobi: [
            { crop: "🌾 Maize (Dry)", price: "3,200", trend: "up", trendIcon: "▲ +50" },
            { crop: "🥔 Irish Potatoes", price: "4,500", trend: "down", trendIcon: "▼ -200" },
            { crop: "🍅 Tomatoes", price: "6,800", trend: "stable", trendIcon: "− 0" },
            { crop: "🥬 Cabbages", price: "2,100", trend: "up", trendIcon: "▲ +100" }
        ],
        mombasa: [
            { crop: "🌾 Maize (Dry)", price: "3,500", trend: "stable", trendIcon: "− 0" },
            { crop: "🥔 Irish Potatoes", price: "5,000", trend: "up", trendIcon: "▲ +150" },
            { crop: "🍅 Tomatoes", price: "7,200", trend: "down", trendIcon: "▼ -100" },
            { crop: "🥬 Cabbages", price: "2,500", trend: "up", trendIcon: "▲ +50" }
        ],
        kisumu: [
            { crop: "🌾 Maize (Dry)", price: "3,000", trend: "down", trendIcon: "▼ -50" },
            { crop: "🥔 Irish Potatoes", price: "4,200", trend: "stable", trendIcon: "− 0" },
            { crop: "🍅 Tomatoes", price: "6,000", trend: "up", trendIcon: "▲ +300" },
            { crop: "🥬 Cabbages", price: "1,900", trend: "down", trendIcon: "▼ -50" }
        ],
        nakuru: [
            { crop: "🌾 Maize (Dry)", price: "2,900", trend: "stable", trendIcon: "− 0" },
            { crop: "🥔 Irish Potatoes", price: "3,800", trend: "down", trendIcon: "▼ -150" },
            { crop: "🍅 Tomatoes", price: "5,500", trend: "up", trendIcon: "▲ +200" },
            { crop: "🥬 Cabbages", price: "1,500", trend: "stable", trendIcon: "− 0" }
        ]
    };

    const marketSelect = document.getElementById('market-region');
    const marketTableBody = document.getElementById('market-data');

    function populateMarketData(region) {
        if (!marketTableBody) return;
        marketTableBody.innerHTML = ''; // Clear current
        
        const data = marketData[region];
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 600; color: #333;">${item.crop}</td>
                <td style="font-size: 1.1rem;">Ksh ${item.price}</td>
                <td class="trend-${item.trend}">${item.trendIcon}</td>
            `;
            marketTableBody.appendChild(tr);
        });
    }

    if (marketSelect) {
        // Initialize with default value
        populateMarketData(marketSelect.value);

        // Update on change
        marketSelect.addEventListener('change', (e) => {
            marketTableBody.style.opacity = '0';
            setTimeout(() => {
                populateMarketData(e.target.value);
                marketTableBody.style.opacity = '1';
                marketTableBody.style.transition = 'opacity 0.3s';
            }, 200);
        });
    }

    // 7. Scroll to Top Button
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        });

        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

});