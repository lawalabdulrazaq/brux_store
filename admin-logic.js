document.addEventListener('DOMContentLoaded', () => {
    // Basic Security Check: Block non-admins from entering manually
    if (localStorage.getItem('brux_role') !== 'admin') {
        alert("Unauthorized access attempt. Access Denied.");
        window.location.href = 'index.html';
        return;
    }

    loadDashboardInquiries();
    loadDashboardUsers();
});

// --- SECURED ADMIN DATA RETRIEVAL & CONTACT CONTROLLER ---
async function loadDashboardInquiries() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/admin/orders');
        const orders = await response.json();
        const tbody = document.getElementById('orders-tbody');
        if (!tbody) return;

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#666;">No luxury inquiries found in database.</td></tr>`;
            return;
        }

        tbody.innerHTML = orders.map(order => {
            const itemsList = order.items.map(item => item.name).join(', ');
            
            // Extract values securely, falling back to your email if missing for testing
            const email = order.clientEmail ? order.clientEmail.trim() : 'temitopelawal925@gmail.com';
            const name = order.clientName ? order.clientName.trim() : 'Valued Client';
            const orderId = order._id.substring(18).toUpperCase();

            return `
                <tr>
                    <td>#${order._id.substring(18)}</td>
                    <td>
                        <strong>${itemsList}</strong><br>
                        <small style="color:#aaa;">Buyer: ${name} (${email})</small>
                    </td>
                    <td style="color: var(--accent-gold); font-weight: bold;">$${order.totalValue.toLocaleString()}</td>
                    <td><span class="badge-status status-pending">${order.status}</span></td>
                    <td>
                        <button class="btn-small" onclick="initiateClientCorrespondence('${email}', '${name}', '${orderId}', '${itemsList}', ${order.totalValue})">
                            Contact Client
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error("Dashboard Engine Crash:", err);
    }
}

// --- NEW: Dynamic Mail Application Communication Handler ---
window.initiateClientCorrespondence = function(email, name, orderId, items, value) {
    console.log(`Initializing client outreach for: ${email}`);

    if (!email || email.includes('example.com')) {
        alert("System Warning: This order does not contain a valid client email. Please verify user details inside your MongoDB database collections.");
        return;
    }

    const subject = `Brux Abode Concierge - Inquiry #${orderId}`;
    const body = `Dear ${name},\n\n` +
                 `This is the Brux Abode Concierge Desk responding to your interest regarding your selection: ${items}.\n\n` +
                 `Our private portfolios list total investment valuations at $${value.toLocaleString()}.\n` +
                 `Please indicate your preferred viewing timeframe schedule below.\n\n` +
                 `Warm Regards,\n` +
                 `Brux Abode Management Desk`;

    // Format strings safely for system URL execution strings
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Fallback Verification: Try opening window socket. If blocked, force location shift
    const mailWindow = window.open(mailtoUrl, '_blank');
    if (!mailWindow || mailWindow.closed) {
        window.location.href = mailtoUrl;
    }
};

// Fetch and Render Users + Promotion Action
async function loadDashboardUsers() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/admin/users');
        const users = await response.json();
        const tbody = document.getElementById('users-tbody');
        if (!tbody) return;

        tbody.innerHTML = users.map(user => {
            return `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td><strong style="text-transform: uppercase; font-size: 0.8rem;">${user.role}</strong></td>
                    <td>
                        ${user.role === 'user' ? `
                            <button class="btn-small" onclick="alterUserPrivilege('${user._id}', 'staff')">Make Staff</button>
                            <button class="btn-small" onclick="alterUserPrivilege('${user._id}', 'admin')">Make Admin</button>
                        ` : `<span style="color: #666; font-size: 0.85rem;">Access Elite Level</span>`}
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error("Failed loading user profiles:", err);
    }
}

// Action Function to give staff/admin rights
window.alterUserPrivilege = async function(userId, newRole) {
    if (!confirm(`Are you sure you want to change this profile access tier to ${newRole}?`)) return;

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/admin/promote/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetRole: newRole })
        });

        if (response.ok) {
            alert("Privilege updated successfully!");
            window.location.reload(); // Refresh the control list view
        }
    } catch (err) {
        alert("Operation update failed.");
    }
};