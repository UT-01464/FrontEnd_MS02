
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
        let serialNumber =index + 1;  // Serialized number auto-generated
        let regNo = "REG" + serialNumber;
        
        // Fetch car details
        let carDetails = JSON.parse(localStorage.getItem('cars')) || [];
        let car = carDetails.find(car => car.carRegNo === rental.carRegNo);
        let carRegNo = car ? car.carRegNo : 'N/A';  // Fetch car Reg No from dashboard
        let phoneNumber = loadUpdatedPhoneNumber(rental.nic);


        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${regNo}</td>  <!-- Serialized Reg No -->
            <td>${rental.nic}</td>
            <td>${rental.username}</td>
            <td>${phoneNumber}</td>
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

    updateOverdueDetails(rentals[index]);

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



// Function to update overdue details when rental is accepted
function updateOverdueDetails(rental) {
    const currentDate = new Date();
    const rentDate = new Date(rental.rentDate);
    const expectedReturnDate = new Date(rentDate);
    expectedReturnDate.setMinutes(rentDate.getMinutes() + 1); // Adjust this logic as needed

    const overdueTime = currentDate > expectedReturnDate ? Math.max(0, Math.floor((currentDate - expectedReturnDate) / (1000 * 60))) : 0;

    if (overdueTime > 0) {
        const overdueRentals = JSON.parse(localStorage.getItem('overdueRentals')) || [];
        overdueRentals.push({
            nic: rental.nic,
            username: rental.username,
            regNumber: rental.carRegNo,
            rentDate: rental.rentDate,
            returnDate: rental.returnDate || 'Not Returned',
            overdueTime
        });
        localStorage.setItem('overdueRentals', JSON.stringify(overdueRentals)); // Save updated overdue details
    }
}

function loadUpdatedPhoneNumber(nic) {
    // Fetch the updated phone numbers from local storage
    const updatedPhoneNumbers = JSON.parse(localStorage.getItem('updatedPhoneNumbers')) || [];
    const user = updatedPhoneNumbers.find(u => u.nic === nic);

    if (user) {
        return user.phone; // Return the updated phone number if it exists
    } else {
        return 'Phone number not found'; // Handle case where phone number is not updated
    }
}


// Initialize the rental display on page load

    displayrentals();



