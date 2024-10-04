document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.sidebar-toggle');
    toggleButton.addEventListener('click', () => sidebar.classList.toggle('open'));

    const customerDetailsTableBody = document.getElementById('customerDetails');
    const carTableBody = document.querySelector('#carTable tbody');
    const carForm = document.getElementById('addCarForm');
    const carImageInput = document.getElementById('carImage');
    const sections = document.querySelectorAll('.content-section');
    const links = document.querySelectorAll('.sidebar a');
    let cars = JSON.parse(localStorage.getItem('cars')) || [];
    let editCarId = null;

    // Display logged-in customer's details
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        customerDetailsTableBody.innerHTML = `
            <tr>
                <td><strong>NIC Number:</strong></td>
                <td>${currentUser.nicNumber}</td>
            </tr>
            <tr>
                <td><strong>Email:</strong></td>
                <td>${currentUser.email}</td>
            </tr>
        `;
    } else {
        customerDetailsTableBody.innerHTML = '<tr><td colspan="2">No user is currently logged in.</td></tr>';
    }

    // Function to update the car table
    function updateCarTable() {
        carTableBody.innerHTML = '';
        cars.forEach(car => {
            carTableBody.innerHTML += `
                <tr data-id="${car.id}">
                    <td>${car.id}</td>
                    <td>${car.name}</td>
                    <td>${car.type}</td>
                    <td>${car.brand}</td>
                    <td>${car.modelYear}</td>
                    <td>${car.model}</td>
                    <td>${car.Category}</td>
                    <td>${car.description}</td>
                    <td><img src="${car.image}" alt="${car.name} Image" style="width: 100px; height: auto;"></td>
                    <td>
                        <button class="edit-btn" data-id="${car.id}">Edit</button>
                        <button class="delete-btn" data-id="${car.id}">Delete</button>
                    </td>
                </tr>
            `;
        });

        document.querySelectorAll('.edit-btn').forEach(button => button.addEventListener('click', handleEdit));
        document.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', handleDelete));
    }

    // Handle editing a car
    function handleEdit(event) {
        const carId = parseInt(event.target.getAttribute('data-id'));
        const car = cars.find(c => c.id === carId);

        if (car) {
            document.getElementById('carIdInput').value = car.id;
            document.getElementById('carName').value = car.name;
            document.getElementById('carType').value = car.type;
            document.getElementById('carBrand').value = car.brand;
            document.getElementById('carModelYear').value = car.modelYear;
            document.getElementById('Category').value = car.Category;
            document.getElementById('carModel').value = car.carModel;
            document.getElementById('carDescription').value = car.description;
            carImageInput.value = "";
            editCarId = carId;
        }
    }

    // Handle deleting a car
    function handleDelete(event) {
        const carId = parseInt(event.target.getAttribute('data-id'));

        if (confirm('Are you sure you want to delete this car?')) {
            cars = cars.filter(car => car.id !== carId);
            localStorage.setItem('cars', JSON.stringify(cars));
            updateCarTable();
            updateCustomerCarList(); // Ensure the customer side is updated
        }
    }

    // Handle form submission for adding/updating cars
    carForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const id = parseInt(document.getElementById('carIdInput').value.trim());
        const name = document.getElementById('carName').value.trim();
        const type = document.getElementById('carType').value.trim();
        const brand = document.getElementById('carBrand').value.trim();
        const modelYear = parseInt(document.getElementById('carModelYear').value.trim());
        const Category = document.getElementById('Category').value.trim(); // No parseInt if this is a string
        const model = document.getElementById('carModel').value.trim(); // No parseInt if this is a string
        const description = document.getElementById('carDescription').value.trim();
        const imageInput = document.getElementById('carImage');

        if (!name || !type || !brand || isNaN(modelYear) || !description || imageInput.files.length === 0 || !model || !Category) {
            alert("All fields are required.");
            return;
        }

        const file = imageInput.files[0];
        const reader = new FileReader();

        reader.onloadend = async function () {
            try {
                console.log('File read successfully:', reader.result); // Debug statement
                // Compress image data
                const compressedImage = await compressImage(reader.result);
                console.log('Compressed image:', compressedImage); // Debug statement

                if (editCarId) {
                    cars = cars.map(car => car.id === editCarId ? { id, name, type, brand, model, modelYear, Category, description, image: compressedImage } : car);
                    editCarId = null;
                } else {
                    cars.push({ id: Date.now(), name, type, brand, model, modelYear, Category, description, image: compressedImage });
                }

                // Save to localStorage
                try {
                    localStorage.setItem('cars', JSON.stringify(cars));
                    console.log('Cars saved to localStorage'); // Debug statement
                } catch (e) {
                    if (e.name === 'QuotaExceededError') {
                        alert('LocalStorage quota exceeded. Please clear some data and try again.');
                    } else {
                        console.error('An error occurred while saving data:', e);
                    }
                    return; // Exit the function to prevent further actions
                }

                carForm.reset();
                updateCarTable();
                updateCustomerCarList(); // Ensure the customer side is updated

            } catch (e) {
                console.error('An error occurred while compressing the image:', e);
            }
        };

        // Function to compress image data
        async function compressImage(imageData) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxWidth = 800;  // Max width for compression
                    const scaleSize = maxWidth / img.width;
                    canvas.width = maxWidth;
                    canvas.height = img.height * scaleSize;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedImage);
                };
                img.onerror = function (e) {
                    reject(e);
                };
                img.src = imageData;
            });
        }

        reader.onerror = function () {
            alert('Failed to read the image file.');
        };

        reader.readAsDataURL(file);
    });

    // Function to show a specific section
    function showSection(sectionId) {
        sections.forEach(section => section.style.display = section.id === sectionId ? 'block' : 'none');
    }

    // Handle sidebar link clicks
    links.forEach(link => link.addEventListener('click', (event) => {
        event.preventDefault();
        const sectionId = link.id.replace('-link', '');
        showSection(sectionId);
    }));

    // Initialize
    updateCarTable();
    showSection('dashboard');
});

// Function to update customer car list (on customer page)
function updateCustomerCarList() {
    // This function should be called from the customer page as well
    // Make sure it reflects the updated car data
    // Example implementation might involve fetching data from localStorage and updating the customer view
    // Use the same logic as in admin to populate car list
}







document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('car-form');
    let cars = JSON.parse(localStorage.getItem('cars')) || [];

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('car-name').value;
        const image = document.getElementById('car-image').value;
        const type = document.getElementById('car-type').value;
        const brand = document.getElementById('car-brand').value;
        const modelYear = document.getElementById('car-model-year').value;
        const model = document.getElementById('car-model').value;
        const Category = document.getElementById('car-Category').value;
        const description = document.getElementById('car-description').value;

        const newCar = {
            name,
            image,
            type,
            brand,
            modelYear,
            model,
            Category,
            description
        };

        cars.push(newCar);
        localStorage.setItem('cars', JSON.stringify(cars));

        alert('Car added successfully!');
        form.reset();
    });
});






// ------------------------------Report



document.addEventListener('DOMContentLoaded', () => {
    const orderHistoryTableBody = document.getElementById('orderHistoryTableBody');
    const logoutBtn = document.getElementById('logoutBtn');

    // Load and display order history
    function loadOrderHistory() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const ctuser =JSON.parse(localStorage.getItem('currentUser'))||[];
        orderHistoryTableBody.innerHTML = '';

        orders.forEach(order => {
            const orderRow = document.createElement('tr');
            orderRow.innerHTML = `
                <td>${ctuser.nicNumber}</td>
                <td>${order.carId}</td>
                <td>${order.brand}</td>
                <td>${order.model}</td>
                <td>${new Date(order.rentDate).toLocaleString()}</td>
                <td>${order.returnDate ? new Date(order.returnDate).toLocaleString() : 'Not Returned'}</td>
            `;
            orderHistoryTableBody.appendChild(orderRow);
        });
    }

    // Initial load
    loadOrderHistory();

    // Handle logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
});

