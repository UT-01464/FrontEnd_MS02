function customersShow() {
    document.getElementById('customercontainer').style.display = 'block';
    document.getElementById('bookingcontainer').style.display = 'none';
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';

    populateCustomerTable();
}



function populateCustomerTable() {
    const customerBody = document.getElementById('customer-body');
    customerBody.innerHTML = '';

    const users = JSON.parse(localStorage.getItem('users')) || [];

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.nic}</td>
            <td>${user.licence}</td>
            <td>${user.Email}</td>
            <td><button class="viewBtn" onclick="viewRentalHistory('${user.nicNumber}')">View</button></td>
        `;

        customerBody.appendChild(row);
    });
}

function viewRentalHistory(nicNumber) {
    
    alert(`Showing rental history for NIC: ${nicNumber}`);
}
