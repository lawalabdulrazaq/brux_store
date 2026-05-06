const properties = [
    { 
        id: 1, 
        name: "Azure Glass Villa", 
        location: "Malibu, CA",
        price: 4250000,
        type: 'sale',
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=600" 
    },
    { 
        id: 2, 
        name: "Master Suite", 
        location: "London, UK",
        price: 3800000,
        type: 'sale',
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200" 
    },
    { 
        id: 3, 
        name: "Grand Living Room", 
        location: "Malibu, CA",
        price: 8500000,
        type: 'sale', 
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" 
    },
    { 
        id: 4, 
        name: "Infinity Estate", 
        location: "Beverly Hills, CA",
        price: 12400000,
        type: 'sale',
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200" 
    },
    { 
        id: 5, 
        name: "Ethereal Heights", 
        location: "London, UK",
        price: 6800000,
        type: 'sale',
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" 
    },

    // Rentals
    {
        id: 6, 
        name: "The Penthouse Suite", 
        location: "Lekki, NG", 
        price: 190, 
        type: 'rent', 
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200"
    },
    {
        id: 7, 
        name: "Skyline Studio", 
        location: "Manhattan, NY", 
        price: 350, 
        type: 'rent', 
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200"
    },
    {
        id: 8, 
        name: "Waterfront Condo", 
        location: "VI, Lagos", 
        price: 250, 
        type: 'rent', 
        image: "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&q=80&w=1200"
    },
    {
        id: 9, 
        name: "The Glass Loft", 
        location: "Ikoyi, NG", 
        price: 215, 
        type: 'rent', 
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200"
    },
    {
        id: 10, 
        name: "Zen Garden Villa", 
        location: "Ubud, Bali", 
        price: 180, 
        type: 'rent', 
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200"
    },
    {
        id: 11, 
        name: "The Safari Lodge", 
        location: "Nairobi, KE", 
        price: 155, 
        type: 'rent', 
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1200"
    },
];

let interestList = JSON.parse(localStorage.getItem('brux_interests')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderListings();
    updateUI();
    setupNavigation();
});

// async function processOrder() {
//     const totalValue = interestList.reduce((sum, item) => sum + item.price, 0);

//     const response = await fetch('http://localhost:5000/api/orders', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             items: interestList,
//             totalValue: totalValue
//         })
//     });

//     if (response.ok) {
//         alert("Success! Your luxury inquiry has been saved to our database.");
//         interestList = []; // Clear the cart
//         saveAndRefresh();
//         window.location.href = 'index.html';
//     }
// }

async function processOrder() {
    const totalValue = interestList.reduce((sum, item) => sum + item.price, 0);

    const orderData = {
        items: interestList,
        totalValue: totalValue
    };

    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Inquiry sent! Order ID: ${result.orderId}`);
            localStorage.removeItem('brux_interests');
            window.location.href = 'index.html';
        } else {
            alert("Failed to process inquiry: " + result.error);
        }
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Server is offline. Please start your Express backend.");
    }
}

function renderListings(filter = 'all') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // Filter the array based on user choice
    const filteredData = filter === 'all' 
        ? properties 
        : properties.filter(p => p.type === filter);

    grid.innerHTML = filteredData.map((prop, index) => {
        const isRent = prop.type === 'rent';
        return `
            <div class="card" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="card-badge">${isRent ? 'For Rent' : 'For Sale'}</div>
                
                <!-- Added: Link to details page with ID -->
                <a href="product-details.html?id=${prop.id}" style="text-decoration:none; color:inherit;">
                    <img src="${prop.image}" alt="${prop.name}">
                    <div class="card-info">
                        <p class="location-tag">${prop.location}</p>
                        <h3>${prop.name}</h3>
                        <p class="price">$${prop.price.toLocaleString()}${isRent ? ' / night' : ''}</p>
                    </div>
                </a>
                
                <div style="padding: 0 25px 25px;">
                    <button class="btn-primary add-to-cart" onclick="addToInterest(${prop.id})">
                        ${isRent ? 'Book Now' : 'Save Interest'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Initial Call
document.addEventListener('DOMContentLoaded', () => {
    renderListings('all'); // Show everything on Home
});

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

function setupNavigation() {
    const modal = document.getElementById('cart-modal');
    const cartBtn = document.getElementById('cart-btn');
    const closeBtn = document.querySelector('.close-modal');

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            renderCartItems(); // Render before showing
            modal.style.display = "block";
        });
    }

    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }

    // Close modal if user clicks outside of it
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    }
}

function renderFullCartPage() {
    const container = document.getElementById('cart-items-list');
    const summaryCount = document.getElementById('summary-count');
    const summaryTotal = document.getElementById('summary-total');

    if (!container) return; // Exit if not on the cart page

    if (interestList.length === 0) {
        container.innerHTML = `<h2 style="color:var(--text-muted);">Your collection is empty. <a href="index.html" style="color:var(--accent-gold);">Go back to explore.</a></h2>`;
        summaryCount.innerText = "0";
        summaryTotal.innerText = "$0";
        return;
    }

    let totalValue = 0;

    container.innerHTML = interestList.map(item => {
        totalValue += item.price;
        return `
        <div class="cart-item-wide" data-aos="fade-right">
            <img src="${item.image}" alt="${item.name}">
            <div style="flex-grow: 1;">
                <p style="color:var(--accent-gold); font-size:0.7rem; font-weight:bold;">${item.location}</p>
                <h3 style="color:#fff; font-size:1.4rem;">${item.name}</h3>
                <p class="price">$${item.price.toLocaleString()}</p>
            </div>
            <button class="btn-delete" onclick="removeFromInterest(${item.id}); renderFullCartPage();">Remove Item</button>
        </div>
        `;
    }).join('');

    summaryCount.innerText = interestList.length;
    summaryTotal.innerText = `$${totalValue.toLocaleString()}`;
}

const cartBtn = document.getElementById('cart-btn');
if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
        window.location.href = 'cart.html';
    });
}

function renderDetailsPage() {
    const container = document.getElementById('product-details-content');
    if (!container) return;

    // Get the ID from the URL (?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    const prop = properties.find(p => p.id === productId);

    if (!prop) {
        container.innerHTML = `<div class="container"><h1>Property Not Found</h1></div>`;
        return;
    }

    const isRent = prop.type === 'rent';

    container.innerHTML = `
        <div class="container details-container">
            <div class="details-image" data-aos="fade-right">
                <img src="${prop.image}" alt="${prop.name}">
            </div>
            <div class="details-info" data-aos="fade-left">
                <p class="location-tag">${prop.location}</p>
                <h1>${prop.name}</h1>
                <p class="price-large">$${prop.price.toLocaleString()}${isRent ? ' / night' : ''}</p>
                
                <p class="description">
                    This exquisite ${isRent ? 'short-let' : 'estate'} represents the pinnacle of luxury living. 
                    Featuring world-class architecture, premium finishes, and breathtaking views of ${prop.location}.
                </p>

                <div class="amenities-grid">
                    <div class="amenity-item"><i data-lucide="maximize"></i> 4,500 Sq Ft</div>
                    <div class="amenity-item"><i data-lucide="bed"></i> 5 Bedrooms</div>
                    <div class="amenity-item"><i data-lucide="droplets"></i> Infinity Pool</div>
                    <div class="amenity-item"><i data-lucide="shield"></i> 24/7 Security</div>
                </div>

                <button class="btn-primary" style="width:100%; padding: 20px;" onclick="addToInterest(${prop.id})">
                    ${isRent ? 'Secure Booking' : 'Express Interest'}
                </button>
            </div>
        </div>
    `;
    lucide.createIcons(); // Refresh icons for the new content
}

window.filterRentals = function() {
    const grid = document.getElementById('product-grid');
    const rentals = properties.filter(p => p.type === 'rent');
    
    // We reuse the rendering logic but only for rentals
    grid.innerHTML = rentals.map(prop => `
        <div class="card" data-aos="fade-up">
            <img src="${prop.image}" alt="${prop.name}">
            <div class="card-info">
                <p class="location-tag">${prop.location}</p>
                <h3>${prop.name}</h3>
                <p class="price">$${prop.price.toLocaleString()} / night</p>
                <button class="btn-primary add-to-cart" onclick="addToInterest(${prop.id})">Book Now</button>
            </div>
        </div>
    `).join('');
};

window.setActiveFilter = function(element, type) {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    // Add to clicked button
    element.classList.add('active');
    // Re-render the grid
    renderListings(type);
};

window.removeFromInterest = function(id) {
    // Filter out the item with the matching ID
    interestList = interestList.filter(item => item.id !== id);
    
    // Save to LocalStorage and update the Header count
    saveAndRefresh();
    
    // Refresh the items inside the open modal
    renderCartItems();
};