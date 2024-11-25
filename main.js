const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'employee1', password: 'employee123', role: 'employee' }
];


let inventory = []; // Empty inventory initially

function authenticateUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadDashboard(user.role);
    } else {
        alert('Invalid credentials');
    }
}

function loadDashboard(role) {
    const dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = `<h1>${role.toUpperCase()} Dashboard</h1>`;

    if (role === 'admin' || role === 'employee') {
        dashboard.innerHTML += `
            <div id="filter-section">
                <input type="number" id="filter-quantity" placeholder="Enter quantity">
                <button onclick="filterStock()">Filter</button>
                <button onclick="exportToExcel()">Export to Excel</button>
                <button onclick="exportToPDF()">Export to PDF</button>
            </div>
            <div id="inventory-actions">
                <input type="text" id="item-name" placeholder="Item Name">
                <input type="number" id="item-quantity" placeholder="Quantity">
                <button onclick="addItem()">Add Item</button>
                <button onclick="deleteItem()">Delete Item</button>
                <button onclick="modifyItem()">Modify Item</button>
            </div>
            <table id="inventory-table">
                <tr><th>Product Name</th><th>Quantity</th></tr>
            </table>
            <canvas id="stockChart"></canvas>
        `;
        loadInventoryTable();
    }
}
function loadInventoryTable() {
    const table = document.getElementById('inventory-table');
    table.innerHTML = '<tr><th>Product Name</th><th>Quantity</th></tr>';
    inventory.forEach(item => {
        table.innerHTML += `<tr><td>${item.name}</td><td>${item.quantity}</td></tr>`;
    });
    renderChart();  // Update chart after table is loaded
}
function filterStock() {
    const threshold = parseInt(document.getElementById('filter-quantity').value);
    const filteredInventory = inventory.filter(item => item.quantity <= threshold);
    const table = document.getElementById('inventory-table');
    table.innerHTML = '<tr><th>Product Name</th><th>Quantity</th></tr>';
    filteredInventory.forEach(item => {
        table.innerHTML += `<tr><td>${item.name}</td><td>${item.quantity}</td></tr>`;
    });
}
function addItem() {
    const name = document.getElementById('item-name').value;
    const quantity = parseInt(document.getElementById('item-quantity').value);
    if (name && quantity >= 0) {
        inventory.push({ name, quantity });
        loadInventoryTable();
    } else {
        alert('Please enter valid item details.');
    }
}
function deleteItem() {
    const name = document.getElementById('item-name').value;
    inventory = inventory.filter(item => item.name !== name);
    loadInventoryTable();
}
function modifyItem() {
    const name = document.getElementById('item-name').value;
    const quantity = parseInt(document.getElementById('item-quantity').value);
    const item = inventory.find(item => item.name === name);
    if (item) {
        item.quantity = quantity;
        loadInventoryTable();
    } else {
        alert('Item not found.');
    }
}

function filterStock() {
    const threshold = parseInt(document.getElementById('filter-quantity').value);
    const filteredInventory = inventory.filter(item => item.quantity <= threshold);
    const table = document.getElementById('inventory-table');
    table.innerHTML = '<tr><th>Product Name</th><th>Quantity</th></tr>';
    filteredInventory.forEach(item => {
        table.innerHTML += `<tr><td>${item.name}</td><td>${item.quantity}</td></tr>`;
    });
}

function exportToExcel() {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(inventory);
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "inventory_report.xlsx");
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Inventory Report", 20, 10);
    inventory.forEach((item, index) => {
        doc.text(`${item.name}: ${item.quantity}`, 20, 20 + index * 10);
    });
    doc.save("inventory_report.pdf");
}

function renderChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');
    const labels = inventory.map(item => item.name);
    const data = inventory.map(item => item.quantity);

    // Destroy existing chart instance to prevent duplication
    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Quantity',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}