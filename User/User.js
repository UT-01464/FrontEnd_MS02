document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const availablecarBody = document.getElementById('car-list');
    const myRentalsTableBody = document.getElementById('myRentalsTableBody');
    const closeRentalsModal = document.getElementById('closeRentalsModal');
    const searchBar = document.getElementById('searchBar');
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const rentalsModal = document.getElementById('rentalsModal');
    
    let cars = JSON.parse(localStorage.getItem('cars')) || [];
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('currentUser'); // Remove user session data
            window.location.href = '../Home.html'; // Redirect to the greeting page
        });
    }

    // Display user information if available
    if (userInfo && currentUser) {
        userInfo.textContent = `${currentUser.username}`;
    }
    console.log(currentUser?.username);

    // Display available cars with search filtering
    function displayAvailablecar() {
        const searchQuery = searchBar ? searchBar.value.toLowerCase() : ''; // Get and normalize the search query

        availablecarBody.innerHTML = ''; // Clear previous content

        cars.forEach(car => {
            // Check if the car matches the search query and is not rented
            if (!iscarRented(car.carRegNo) &&
                (car.fuel.toLowerCase().includes(searchQuery) ||
                 car.fuelConsumption.toLowerCase().includes(searchQuery) ||
                 car.modelName.toLowerCase().includes(searchQuery) ||
                 car.brand.toLowerCase().includes(searchQuery) ||
                 car.price.toLowerCase().includes(searchQuery))) {

                const carBox = document.createElement('div');
                carBox.classList.add('rent-box');
                carBox.innerHTML = `
                    <img src="${car.image}" alt="${car.modelName}">
                    <div class="rent-layer">
                        <h4>${car.carRegNo}</h4>
                        <p>${car.fuelConsumption}</p>
                        <p>Model: ${car.modelName}</p>
                        <p>Brand: ${car.brand}</p>
                        <p>Category: ${car.price}</p>
                        <a href="#" onclick="rentcar('${car.carRegNo}')"><i class='bx bx-link-external'></i></a>
                    </div>
                `;
                availablecarBody.appendChild(carBox); // Append car card to container
            }
        });
    }

    // Event listener to trigger the display function when the search query changes
    if (searchBar) {
        searchBar.addEventListener('input', displayAvailablecar);
    }

    // Check if a car is currently rented
    function iscarRented(carRegNo) {
        return rentals.some(rental => rental.carRegNo === carRegNo);
    }

    // Rent a car
    window.rentcar = function (carRegNo) {
        const rental = {
            carRegNo,
            username: currentUser.username,

            nic: currentUser.nic,
            rentDate: new Date().toLocaleDateString(),
            status: "Pending" // Set initial status as "Pending"
        };
        rentals.push(rental); // Add new rental
        localStorage.setItem('rentals', JSON.stringify(rentals)); // Save rentals to local storage
        displayAvailablecar(); // Refresh available cars display
    };

    // Display user's rentals in a modal window
    function displayMyRentals() {
        document.getElementById('profileModal').style.display = 'none';

        if (!myRentalsTableBody) return; // Check if myRentalsTableBody exists
        myRentalsTableBody.innerHTML = ''; // Clear previous content

        rentals.forEach((rental, index) => {
            if (rental.username === currentUser.username) {
                const car = cars.find(c => c.carRegNo === rental.carRegNo);
                if (car) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${car.carRegNo}</td>
                        <td>${car.brand}</td>
                        <td>${car.modelName}</td>
                        <td>${car.price}</td>
                        <td>${rental.rentDate}</td>
                        <td>${rental.status}</td> <!-- Display the rental status -->
                    `;
                    myRentalsTableBody.appendChild(row); // Append row to rentals table
                }
            }
        });

        rentalsModal.style.display = 'block'; // Show the modal
    }

    // Event listener to close the rentals modal
    if (closeRentalsModal) {
        closeRentalsModal.addEventListener('click', function () {
            rentalsModal.style.display = 'none'; // Hide the modal
        });
    }

    // Close the modal if the user clicks outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === rentalsModal) {
            rentalsModal.style.display = 'none'; // Hide the modal
        }
    });

    // Event listener for rental history
    const rentalHistoryBtn = document.getElementById('rentalhistory');
    if (rentalHistoryBtn) {
        rentalHistoryBtn.addEventListener('click', displayMyRentals);
    }





    
    // Initialize displays on page load
    displayMyRentals();
    displayAvailablecar(); // Initial display of available cars
});



document.addEventListener('DOMContentLoaded', function () {
    const profileModal = document.getElementById('profileModal');
    const editProfileForm = document.getElementById('editProfileForm');
    const closeBtn = document.querySelector('.close');
    const userInfo = document.getElementById('userInfo');



    // Retrieve current user information from session storage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // Function to open the modal and populate the form
    function openProfileModal() {
        document.getElementById('rentalsModal').style.display = 'none';

        if (currentUser) {
            document.getElementById('username').value = currentUser.username || '';
            document.getElementById('nic').value = currentUser.nic || '';
            document.getElementById('number').value = currentUser.number || '';
            document.getElementById('password').value = currentUser.password || '';
        }
        profileModal.style.display = 'block'; // Show the modal
    }

    // Function to close the modal
    function closeProfileModal() {
        profileModal.style.display = 'none'; // Hide the modal
    }

    // Event listener for profile link to open the modal
    userInfo.addEventListener('click', openProfileModal);

    // Event listener for close button to close the modal
    closeBtn.addEventListener('click', closeProfileModal);

    // Event listener to close the modal if clicked outside of the content area
    window.addEventListener('click', function (event) {
        if (event.target === profileModal) {
            closeProfileModal();
        }
    });

    // Handle form submission for editing profile
    editProfileForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission
    
        // Retrieve current user from session storage
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
        // Get updated phone number from form
        const updatedPhoneNumber = {
            nic: document.getElementById('nic').value, // Use NIC to associate the phone number
            phone: document.getElementById('number').value
        };
    
        // Push the updated phone number to a separate local storage array
        let updatedPhoneNumbers = JSON.parse(localStorage.getItem('updatedPhoneNumbers')) || [];
        const index = updatedPhoneNumbers.findIndex(user => user.nic === updatedPhoneNumber.nic);
    
        if (index > -1) {
            // Update existing phone number entry
            updatedPhoneNumbers[index].phone = updatedPhoneNumber.phone;
        } else {
            // Add new entry for the updated phone number
            updatedPhoneNumbers.push(updatedPhoneNumber);
        }
    
        // Save the updated array back to local storage
        localStorage.setItem('updatedPhoneNumbers', JSON.stringify(updatedPhoneNumbers));
    
        // Notify the user and close the modal
        alert('Phone number updated successfully!');
        closeProfileModal();
    });


let customerID = currentUser.nic; 
let overdueRentals = JSON.parse(localStorage.getItem('overdueRentals')) || [];
let customerOverdueRentals = overdueRentals.filter(rental => rental.nic === customerID);

let overdueAlertMessage = document.getElementById('overdue-alert-message');
let rentalsTableBody = document.getElementById('overdue-rentals-table').getElementsByTagName('tbody')[0];

if (customerOverdueRentals.length > 0) {
    overdueAlertMessage.textContent = `You have ${customerOverdueRentals.length} overdue rental(s).`;

    // Clear previous rows
    rentalsTableBody.innerHTML = '';
console.log(customerOverdueRentals);
    // Populate the table with overdue rentals
    customerOverdueRentals.forEach(rental => {
        let row = rentalsTableBody.insertRow();

        let cellRentalID = row.insertCell(0);
        let cellItemName = row.insertCell(1);
        let cellDueDate = row.insertCell(2);

        cellRentalID.textContent = rental.carRegNo;  
        cellItemName.textContent = rental.username;  
        cellDueDate.textContent = rental.overdueDays;    
    });
} else {
    overdueAlertMessage.textContent = 'You have no overdue rentals.';
    // Clear previous rows if no overdue rentals
    rentalsTableBody.innerHTML = '';
}

    
});

