document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

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
    console.log(currentUser.username);
    
    // Customer page functionality
    const availablecarBody = document.getElementById('car-list');
    const myRentalsTableBody = document.getElementById('myRentalsTableBody');

    // Display available motorbikes with search filtering
    function displayAvailablecar() {
        const searchBar = document.getElementById('searchBar');
        const searchQuery = searchBar.value.toLowerCase(); // Get and normalize the search query

        availablecarBody.innerHTML = ''; // Clear previous content
 console.log(cars)
        cars.forEach(car => {
            // Check if the motorbike matches the search query and is not rented
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
            availablecarBody.appendChild(carBox); // Append bike card to container
            }
        });
    }

    // Event listener to trigger the display function when the search query changes
    document.getElementById('searchBar').addEventListener('input', displayAvailablecar);



    // Check if a motorbike is currently rented
    function iscarRented(carRegNo) {
        return rentals.some(rental => rental.carRegNo === carRegNo);
    }

    // Rent a motorbike
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
        displayAvailablecar(); // Refresh available motorbikes display
     // Refresh user's rentals display
    };

    // Display user's rentals in a modal window
    function displayMyRentals() {
        document.getElementById('profileModal').style.display = 'none';

        if (!myRentalsTableBody) return; // Check if myRentalsTableBody exists
        myRentalsTableBody.innerHTML = ''; // Clear previous content

        rentals.forEach((rental, index) => {
            if (rental.username === currentUser.username) {
                const car = cars.find(c => c.regNumber === rental.regNumber);
                if (car) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${car.regNumber}</td>
                        <td>${car.brand}</td>
                        <td>${car.model}</td>
                        <td>${car.category}</td>
                        <td>${rental.rentDate}</td>
                <td>${rental.status}</td> <!-- Display the rental status -->

                    `;
                    console.log(rental.status);
                    
                    myRentalsTableBody.appendChild(row); // Append row to rentals table
                }
            }
        });

        rentalsModal.style.display = 'block'; // Show the modal
    }

    // Event listener to close the modal
    closeRentalsModal.addEventListener('click', function () {
        rentalsModal.style.display = 'none'; // Hide the modal
    });

    // Optional: Close the modal if the user clicks outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === rentalsModal) {
            rentalsModal.style.display = 'none'; // Hide the modal
        }
    });

    document.getElementById('rentalhistory').addEventListener('click', displayMyRentals);
 // Initial display of user's rentals


    // Initialize displays on page load
    window.onload = function () {
        displayMyRentals(); 
        displayAvailablecar(); // Initial display of available motorbikes
    };
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

        // Get updated user information from form fields
        const updatedUser = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };

        // Update session storage with the new user information
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Update user info on the page
        userInfo.textContent = updatedUser.username;

        // Close the modal
        closeProfileModal();

        alert('Profile updated successfully!');
    });
});

