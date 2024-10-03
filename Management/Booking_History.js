
function bookingHistoryShow() {
    document.getElementById('bookingcontainer').style.display = 'block';
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('customercontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';
}


// Function to display all rentals in the manager's dashboard
function displayrentals() {
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const rentalTable = document.getElementById('rental-body');
    rentalTable.innerHTML = '';

    rentals.forEach((rental, index) => {
        // Generate a serialized Reg No
        let serialNumber = index + 1;  // Serialized number auto-generated
        
        // Fetch car details
        let carDetails = JSON.parse(localStorage.getItem('cars')) || [];
        let car = carDetails.find(car => car.carRegNo === rental.carRegNo);
        let carRegNo = car ? car.carRegNo : 'N/A';  // Fetch car Reg No from dashboard

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${serialNumber}</td>  <!-- Serialized Reg No -->
            <td>${rental.nic}</td>
            <td>${rental.username}</td>
            <td>${rental.number}</td>
            <td>${carRegNo}</td>  <!-- Car Reg No from dashboard -->
            <td>${rental.rentDate}</td>
            <td>${rental.status}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="acceptRental(${index})">Accept</button>
                <button class="btn btn-danger btn-sm" onclick="rejectRental(${index})">Reject</button>
            </td>
        `;
        rentalTable.appendChild(row);
    });

    if (rentals.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7">No rentals found.</td>';
        rentalTable.appendChild(row);
    }
}


// Function to accept a rental request
function acceptRental(index) {
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    rentals[index].status = "Accepted";
    localStorage.setItem('rentals', JSON.stringify(rentals));
    displayrentals(); // Refresh the manager's rental table
}

// Function to reject a rental request
function rejectRental(index) {
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    rentals.splice(index, 1); // Remove the rental from the array
    localStorage.setItem('rentals', JSON.stringify(rentals));
    displayrentals(); // Refresh the manager's rental table
}

// Initialize the rental display on page load

    displayrentals();



