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
    const acreageSlider = document.getElementById('acreage');
    const acreageValDisplay = document.getElementById('acreage-val');
    const calcBtn = document.getElementById('calculate-btn');
    
    if (acreageSlider && acreageValDisplay) {
        acreageSlider.addEventListener('input', (e) => {
            acreageValDisplay.innerText = `${e.target.value} Acres`;
            // Auto calculate on slider move if result is visible
            if (document.getElementById('calc-result').style.display === 'block') {
                calcBtn.click();
            }
        });
    }

    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const acreage = document.getElementById('acreage').value;
            const equipType = document.getElementById('equipment-type').value;
            const resultDiv = document.getElementById('calc-result');
            const resultText = document.getElementById('result-text');
            const currentProfitEl = document.getElementById('current-profit');
            const newProfitEl = document.getElementById('new-profit');

            // Baseline profit per acre = Ksh 65,000
            const baselineProfit = acreage * 65000;
            let profitIncrease = 0;

            if (equipType === 'tractor') {
                profitIncrease = baselineProfit * 0.15;
            } else if (equipType === 'irrigation') {
                profitIncrease = (baselineProfit * 0.20) + (acreage * 6500); 
            } else if (equipType === 'harvester') {
                profitIncrease = baselineProfit * 0.10;
            }

            const totalNewProfit = baselineProfit + profitIncrease;

            resultDiv.style.display = 'block';
            resultDiv.style.animation = 'slideUp 0.5s ease-out';
            
            currentProfitEl.innerText = `Ksh ${Math.round(baselineProfit).toLocaleString()}`;
            newProfitEl.innerText = `Ksh ${Math.round(totalNewProfit).toLocaleString()}`;

            let start = 0;
            const duration = 1000;
            const interval = 10;
            const step = profitIncrease / (duration / interval);
            
            if(window.roiInterval) clearInterval(window.roiInterval);

            window.roiInterval = setInterval(() => {
                start += step;
                if (start >= profitIncrease) {
                    clearInterval(window.roiInterval);
                    resultText.innerText = `+Ksh ${Math.round(profitIncrease).toLocaleString()}`;
                } else {
                    resultText.innerText = `+Ksh ${Math.round(start).toLocaleString()}`;
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

    // 9. "What Should I Plant?" Advisor Logic
    const advisorData = {
        highlands: {
            "mar-may": [
                { name: "Maize (High Altitude)", icon: "🌽", days: "150-180 Days", soil: "Well-drained loam", desc: "Plant early. Excellent for commercial and subsistence." },
                { name: "Irish Potatoes", icon: "🥔", days: "90-120 Days", soil: "Loose, well-drained", desc: "High yield potential. Needs regular fungicide application." }
            ],
            "oct-dec": [
                { name: "Beans", icon: "🫘", days: "60-90 Days", soil: "Loam", desc: "Fast-maturing, perfect for short rains." },
                { name: "Cabbages", icon: "🥬", days: "90-100 Days", soil: "High organic matter", desc: "Good market prices during January/February." }
            ],
            "dry": [
                { name: "Tomatoes (Greenhouse)", icon: "🍅", days: "75-90 Days", soil: "Rich loam", desc: "Requires irrigation/greenhouse, but prices peak." }
            ]
        },
        rift: {
            "mar-may": [
                { name: "Wheat", icon: "🌾", days: "120-150 Days", soil: "Deep loam", desc: "Large scale commercial farming. Very profitable." },
                { name: "Maize (Hybrid)", icon: "🌽", days: "130-150 Days", soil: "Well-drained", desc: "Staple crop. Use certified seeds for high yield." }
            ],
            "oct-dec": [
                { name: "Garden Peas", icon: "🫛", days: "60-70 Days", soil: "Loam", desc: "Excellent cash crop during short rains." }
            ],
            "dry": [
                { name: "Onions", icon: "🧅", days: "120-150 Days", soil: "Sandy loam", desc: "Requires irrigation. Extremely lucrative off-season." }
            ]
        },
        coast: {
            "mar-may": [
                { name: "Cassava", icon: "🍠", days: "180-360 Days", soil: "Sandy", desc: "Drought resistant and highly adapted to coastal soils." },
                { name: "Green Grams (Ndengu)", icon: "🟢", days: "60-70 Days", soil: "Well-drained sandy", desc: "Fast maturing, good price per kg." }
            ],
            "oct-dec": [
                { name: "Cowpeas", icon: "🌱", days: "60-80 Days", soil: "Sandy loam", desc: "Grown for both leaves (mboga) and seeds." }
            ],
            "dry": [
                { name: "Watermelons", icon: "🍉", days: "80-100 Days", soil: "Sandy, well-drained", desc: "Needs irrigation, but thrives in coastal heat." }
            ]
        },
        lake: {
            "mar-may": [
                { name: "Sorghum", icon: "🌾", days: "90-120 Days", soil: "Clay loam", desc: "Bird-resistant varieties recommended. Excellent brewer market." },
                { name: "Rice (Paddy)", icon: "🍚", days: "120-150 Days", soil: "Heavy clay", desc: "Requires flooded conditions. Very high demand." }
            ],
            "oct-dec": [
                { name: "Groundnuts", icon: "🥜", days: "100-120 Days", soil: "Loose sandy loam", desc: "High value crop. Avoid waterlogged soils." }
            ],
            "dry": [
                { name: "Sweet Potatoes", icon: "🍠", days: "90-120 Days", soil: "Sandy loam", desc: "Drought tolerant. Vines can be used for fodder." }
            ]
        }
    };

    const adviseBtn = document.getElementById('advise-btn');
    const advisorResults = document.getElementById('advisor-results');

    if (adviseBtn) {
        adviseBtn.addEventListener('click', () => {
            const region = document.getElementById('advisor-region').value;
            const season = document.getElementById('advisor-month').value;
            
            const recommendations = advisorData[region][season];
            
            advisorResults.style.display = 'block';
            advisorResults.style.animation = 'slideUp 0.5s ease-out';
            
            if (!recommendations || recommendations.length === 0) {
                advisorResults.innerHTML = `<p style="text-align:center; color:#666;">No specific recommendations found. Consult your local agro-vet.</p>`;
                return;
            }

            let htmlStr = `<h3 style="margin-bottom:20px; color:var(--primary-color);">Top Recommendations:</h3>`;
            
            recommendations.forEach(crop => {
                htmlStr += `
                    <div class="crop-recommendation">
                        <div class="crop-icon">${crop.icon}</div>
                        <div class="crop-details">
                            <h3>${crop.name}</h3>
                            <p>${crop.desc}</p>
                            <div class="crop-tags">
                                <span class="crop-tag">⏱ ${crop.days}</span>
                                <span class="crop-tag">🌱 ${crop.soil}</span>
                            </div>
                        </div>
                    </div>
                `;
            });

            advisorResults.innerHTML = htmlStr;
        });
    }

    // 10. Finance Quiz Logic
    const quizSubmit = document.getElementById('quiz-submit');
    const quizResult = document.getElementById('quiz-result');

    if (quizSubmit && quizResult) {
        quizSubmit.addEventListener('click', () => {
            const size = document.getElementById('quiz-size').value;
            const organic = document.getElementById('quiz-organic').value;
            const goal = document.getElementById('quiz-goal').value;

            let recommendation = "";
            let amount = "";

            if (organic === 'yes') {
                recommendation = "Organic Farming Incentive";
                amount = "Up to Ksh 1,300,000 Subsidy";
            } else if (goal === 'equipment') {
                recommendation = "Tech Adoption Fund";
                amount = "Up to 50% Co-financing";
            } else if (size === 'large' || goal === 'expansion') {
                recommendation = "Agriculture Loan Assistance";
                amount = "Low-Interest Loan (Up to Ksh 6,500,000)";
            } else {
                recommendation = "Farm Subsidy Grant";
                amount = "Up to Ksh 650,000 Grant";
            }

            quizResult.style.display = 'block';
            quizResult.style.animation = 'slideUp 0.4s ease-out';
            quizResult.innerHTML = `
                <h3 style="color: var(--dark-color); margin-bottom: 10px;">Great news! You likely qualify for the:</h3>
                <h2 style="color: var(--primary-color); font-size: 1.8rem; margin-bottom: 5px;">${recommendation}</h2>
                <p style="font-weight: bold; color: var(--accent-color); margin-bottom: 15px;">${amount}</p>
                <p style="color: #666; margin-bottom: 20px;">Please prepare your land registration documents and click below to begin the official application process.</p>
                <a href="mailto:finance@kilimo.go.ke?subject=Application for ${recommendation}" class="cta-button" style="display: inline-block; padding: 10px 20px;">Apply Now via Email</a>
            `;
        });
    }

    // 11. Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (themeToggleBtn && currentTheme === 'dark') {
            themeToggleBtn.innerText = '☀️';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerText = '🌙';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerText = '☀️';
            }
        });
    }

    // 12. Leasing Modal Logic
    const leaseModal = document.getElementById('lease-modal');
    const closeLeaseModal = document.getElementById('close-modal');
    const leaseNowBtns = document.querySelectorAll('.lease-now-btn');
    const leaseCheckboxes = document.querySelectorAll('.lease-checkbox');
    const leaseDaysInput = document.getElementById('lease-days');
    const leaseTotalEl = document.getElementById('lease-total');
    const leaseDiscountMsg = document.getElementById('lease-discount-msg');

    function calculateLeaseTotal() {
        if(!leaseTotalEl) return;
        let totalPerDay = 0;
        let checkedCount = 0;

        leaseCheckboxes.forEach(cb => {
            if (cb.checked) {
                totalPerDay += parseInt(cb.getAttribute('data-price'));
                checkedCount++;
            }
        });

        let days = parseInt(leaseDaysInput.value) || 1;
        let subtotal = totalPerDay * days;
        
        if (checkedCount >= 2) {
            subtotal = subtotal * 0.9; // 10% discount
            leaseDiscountMsg.style.display = 'block';
        } else {
            leaseDiscountMsg.style.display = 'none';
        }

        leaseTotalEl.innerText = `Ksh ${Math.round(subtotal).toLocaleString()}`;
    }

    if (leaseModal) {
        // Open Modal and Pre-check item
        leaseNowBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const equip = btn.getAttribute('data-equipment');
                
                // Reset checkboxes
                leaseCheckboxes.forEach(cb => {
                    cb.checked = (cb.value === equip);
                });
                
                // Reset days
                leaseDaysInput.value = 1;
                
                // Set today as min date
                const dateInput = document.getElementById('lease-date');
                if(dateInput) {
                    const today = new Date().toISOString().split('T')[0];
                    dateInput.min = today;
                    dateInput.value = today;
                }

                calculateLeaseTotal();
                leaseModal.style.display = 'block';
            });
        });

        // Close Modal
        closeLeaseModal.addEventListener('click', () => {
            leaseModal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === leaseModal) {
                leaseModal.style.display = 'none';
            }
        });

        // Recalculate on input change
        leaseCheckboxes.forEach(cb => cb.addEventListener('change', calculateLeaseTotal));
        leaseDaysInput.addEventListener('input', calculateLeaseTotal);
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