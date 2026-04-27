const properties = [
    { 
        id: 1, 
        name: "Azure Glass Villa", 
        location: "Malibu, CA",
        price: 4250000, 
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=600" 
    },
    { 
        id: 2, 
        name: "The Obsidian Suite", 
        location: "New York, NY",
        price: 2100000, 
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600" 
    },
    { 
        id: 3, 
        name: "Grand Living Room", 
        location: "Malibu, CA",
        price: 8500000, 
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" 
    },
    { 
        id: 4, 
        name: "Infinity Estate", 
        location: "Beverly Hills, CA",
        price: 12400000, 
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200" 
    },
    { 
        id: 5, 
        name: "Ethereal Heights", 
        location: "London, UK",
        price: 6800000, 
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" 
    }
];

let interestList = JSON.parse(localStorage.getItem('brux_interests')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderListings();
    updateUI();
    setupNavigation();
});

// 3. Render Houses
function renderListings() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = properties.map((prop, index) => `
        <div class="card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <img src="${prop.image}" alt="${prop.name}">
            <div class="card-info">
                <p class="location-tag">${prop.location}</p>
                <h3>${prop.name}</h3>
                <p class="price">$${prop.price.toLocaleString()}</p>
                <button class="btn-primary add-to-cart" onclick="addToInterest(${prop.id})">
                    Save to Interest
                </button>
            </div>
        </div>
    `).join('');
}

// 4. Button Functions
window.addToInterest = function(id) {
    const property = properties.find(p => p.id === id);
    
    // Prevent duplicates
    if (interestList.some(item => item.id === id)) {
        alert("This property is already in your interest list.");
        return;
    }

    interestList.push(property);
    saveAndRefresh();
    
    // Show success feedback
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "SAVED ✓";
    btn.style.background = "#fff";
    btn.style.color = "#0a0a0a";
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "var(--accent-gold)";
        btn.style.color = "#0a0a0a";
    }, 2000);
};

function saveAndRefresh() {
    localStorage.setItem('brux_interests', JSON.stringify(interestList));
    updateUI();
}

function updateUI() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.innerText = interestList.length;
    }
}

// 5. Navigation & Hero Buttons
function setupNavigation() {
    // "View Collection" Hero Button
    const viewBtn = document.querySelector('.hero .btn-primary');
    if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // "Contact/Private Showing" Button
    const contactBtn = document.querySelector('.btn-agent');
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Our concierge will contact you shortly to arrange a private viewing.");
        });
    }

    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (interestList.length === 0) {
                alert("Your interest list is empty.");
            } else {
                const names = interestList.map(item => `• ${item.name} (${item.location})`).join('\n');
                alert(`Properties you are interested in:\n\n${names}`);
            }
        });
    }
}