document.addEventListener('DOMContentLoaded', () => {

    let CARS = JSON.parse(localStorage.getItem('cars')) || [];
    const carList = document.getElementById('car-list');


    function addCar() {
        CARS.forEach(car => {
            const newDiv = document.createElement('div');
            newDiv.classList.add('car-card');

            newDiv.innerHTML = `
            <div><img src='${car.image}' width=100px></div>
            <div class="car-details">
                    <h2>${car.brand}</h2>
                    <p>Type: ${car.modelName}</p>
                    <p>Brand: ${car.year}</p>
                    <p>Model Year: ${car.fuel}</p>
                    <p>${car.noOfPeople}</p>
                    <button class="rent-now">Rent Now</button>
                </div>`;

            
                carList.appendChild(newDiv);
            
        });
    }

    addCar();
});
