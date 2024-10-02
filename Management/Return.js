
function returnShow() {
    document.getElementById('returncontainer').style.display = 'block';
    document.getElementById('bookingcontainer').style.display = 'none';
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('customercontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'none';
}


function returnCar() {
    const returnNIC = document.getElementById('return-nic').value.trim();
    const returnRegNumber = document.getElementById('return-registration').value.trim();
    const returnDate = new Date(); 
    const returnDateISO = returnDate.toLocaleString (); 

    if (!returnNIC || !returnRegNumber) {
        alert('Please fill in all fields.');
        return;
    }

    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    let updated = false;
    let isOverdue = false;

    rentals = rentals.map(rental => {
        if (rental.regNumber === returnRegNumber) {
            if (rental.returnDate) {
                alert('Car has already been returned.');
                return rental;
            }

            const rentDate = new Date(rental.rentDate);
            const expectedReturnDate = new Date(rentDate);
            expectedReturnDate.setMinutes(expectedReturnDate.getMinutes() + 1);             
           
            if (returnDate > expectedReturnDate) {
                isOverdue = true;
            }
            
            rental.returnDate = returnDateISO;
            updated = true;
        }
        return rental;
    });

    if (!updated) {
        alert('Booking not found.');
        return;
    }

    localStorage.setItem('rentals', JSON.stringify(rentals));

    if (isOverdue) {
        alert('Car is overdue.');
        document.getElementById('dashboardcontainer').style.display = 'none';
        document.getElementById('bookingcontainer').style.display = 'none';
        document.getElementById('customercontainer').style.display = 'none';
        document.getElementById('returncontainer').style.display = 'none';
        document.getElementById('overduecontainer').style.display = 'block';
        loadOverdueBookings();
    } else {
        alert('Car returned successfully.');
    }

    updateBookingTable();
}
