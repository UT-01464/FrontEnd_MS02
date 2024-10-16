function overdueShow() {
    document.getElementById('overduecontainer').style.display = 'block';
    document.getElementById('bookingcontainer').style.display = 'none';
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('customercontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';
}

document.addEventListener('DOMContentLoaded',function(){
    const overdueTableBody = document.getElementById('overdue-list');
  

    function calculateOverdue(booking) {
        const currentDate = new Date();
        const returnDate = new Date(booking.returnDate || currentDate);
        const expectedReturnDate = new Date(booking.rentDate);
        // expectedReturnDate.setDate(expectedReturnDate.getDate() + 7);
        expectedReturnDate.setMinutes(expectedReturnDate.getMinutes() + 1);

        if (returnDate > expectedReturnDate) {
            const overdueTime = Math.max(0, Math.floor((returnDate - expectedReturnDate) / (1000 * 60)));
            return overdueTime;
        }
        return 0;
    }



    function loadOverduerentals() {
        const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
        const overdueRentals = [];
        overdueTableBody.innerHTML = '';

        rentals.forEach(function (booking) {

            if (booking.status === 'Accepted') {
                const overdueDays = calculateOverdue(booking);
                console.log(booking);
                if (overdueDays > 0) {
                    const newRow = overdueTableBody.insertRow();
                    newRow.innerHTML = `
                    <td>${booking.nic}</td>
                    <td>${booking.username}</td>
                    <td>${booking.carRegNo}</td>
                    <td>${booking.rentDate}</td>
                    <td>${booking.returnDate || 'Not Returned'}</td>
                    <td>${overdueDays} days</td>
                `;
                    overdueRentals.push({
                        regNumber: booking.regNumber,
                        overdueDays,
                        username: booking.username,
                        nic:booking.nic,
                        carRegNo: booking.carRegNo
                    });
                }
            }
        });

        localStorage.setItem('overdueRentals', JSON.stringify(overdueRentals));
    }
    loadOverduerentals();
});
