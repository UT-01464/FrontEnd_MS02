function overdueShow() {
    document.getElementById('overduecontainer').style.display = 'block';
    document.getElementById('bookingcontainer').style.display = 'none';
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('customercontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    const overdueTableBody = document.getElementById('overdue-list');

    
    function calculateOverdue(booking) {
        const currentDate = new Date();
        const returnDate = new Date(booking.returnDate || currentDate);
        const expectedReturnDate = new Date(booking.rentDate);
        expectedReturnDate.setMinutes(expectedReturnDate.getMinutes() + 1); 

        if (returnDate > expectedReturnDate) {
            const overdueTime = Math.max(0, Math.floor((returnDate - expectedReturnDate) / (1000 * 60))); 
            return overdueTime;
        }
        return 0;
    }

    function markAsPaid(index) {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const booking = bookings[index];

        if (booking) {
         
            booking.paid = true;
            localStorage.setItem('bookings', JSON.stringify(bookings));

      
            loadOverdueBookings();
        }
    }

    function loadOverdueBookings() {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        console.log(bookings);
        overdueTableBody.innerHTML = '';

        bookings.forEach(function (booking, index) {
            const overdueMinutes = calculateOverdue(booking);
            if (overdueMinutes > 0) { 
                const newRow = overdueTableBody.insertRow();
                newRow.innerHTML = `
                    <td>${booking.nic}</td>
                    <td>${booking.name}</td>
                    <td>${booking.regNumber}</td>
                    <td>${booking.rentDate}</td>
                    <td>${booking.returnDate || 'Not Returned'}</td>
                    <td>${overdueMinutes} minutes</td>
                    <td>${booking.paid ? '' : '<button class="pay-btn" data-index="${index}">Pay</button>'}</td>
                `;
                console.log(`Car with registration number ${booking.regNumber} is overdue by ${overdueMinutes} minutes.`);
                if (!booking.paid) {
                    alert(`Car with registration number ${booking.regNumber} is overdue by ${overdueMinutes} minutes.`);
                }
            }
        });

   
        document.querySelectorAll('.pay-btn').forEach(button => {
            button.addEventListener('click', function () {
                markAsPaid(this.dataset.index);
                
            });
        });
    }

    loadOverdueBookings();
});
