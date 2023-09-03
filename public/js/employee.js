
const currentUrl = window.location.href;
const urlSegments = currentUrl.split("/");
const shopIndex = urlSegments.indexOf("all-employees");
const shopId = urlSegments[shopIndex + 1];
var selectedEmployeeId;


document.addEventListener("DOMContentLoaded", function() {
  // Fetch employee data from the API
  const apiUrl = `http://localhost:3000/get-register-employee/${shopId}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const employeeContainer = document.querySelector('.employee-container');

      data.forEach(employee => {
        const card = createEmployeeCard(employee);
        employeeContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error fetching employee data:', error);
    });


   // var selectedEmployeeId;
  // Helper function to create an employee card
  function createEmployeeCard(employee) {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.innerHTML = `
      <img src="/images/employee_photo.jpg" alt="Employee Photo" class="employee-photo">
      <h2>${employee.name}</h2>
      <p><strong>Address:</strong> ${employee.address}</p>
      <p><strong>Phone:</strong> ${employee.phoneNumber}</p>
      <p><strong>Salary:</strong> ${employee.salary.toLocaleString()} Rs</p>
      <p><strong>Balanced:</strong> ${employee.balanced.toLocaleString()} Rs</p>
      <button class="view-btn">View Details</button>
      <button class="pay-btn" id="paySalary">Pay Salary</button>
    `;

    const viewDetailsButton = card.querySelector('.view-btn');

    // Add a click event listener to the button
    viewDetailsButton.addEventListener('click', () => {
        // Redirect to another site
        window.location.href = `http://localhost:3000/shop/${shopId}/employee-details/${employee._id}`; // Replace with your desired URL
    });

    // Add event listener to "Pay Salary" button on this employee card
    const payButton = card.querySelector('.pay-btn');
    const employeeExpenseModal = document.getElementById('employeeExpenseModal');
    const closeEmployeeExpenseModalButton = document.getElementById('closeEmployeeExpenseModalButton');

    payButton.addEventListener('click', function() {
      employeeExpenseModal.style.display = 'block';
      
      selectedEmployeeId = employee._id; 
      console.log("Selected employee ID:", selectedEmployeeId);
    });

    closeEmployeeExpenseModalButton.addEventListener('click', function() {
      employeeExpenseModal.style.display = 'none';
    });

    return card;
}
});



const createEmployerExpensee = async (salaryAmount,date,description,paymentMethod,employeeId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://localhost:3000/create-employee-salaries/${shopId}/employee/${employeeId}`,
      data:{
        salaryAmount,
        date,
        paymentMethod,
        description
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"Employee expense Added successfully!",
            icon: "success",
            button: "OK",
        }).then(() => {
            location.reload()
        });
    }
  } catch (err) {
    // swal({
    //   text:err.response.data.message,
    //   icon: "warning",
    //   button: "OK",
    // })
    console.log(err)
  }
};


document.querySelector('.employee-expense-form').addEventListener('submit',e=>{
    e.preventDefault();
    const salaryAmount = document.getElementById('salaryAmount').value;
    const description = document.getElementById('employeeExpenseDescription').value;
    const date = document.getElementById('employeeExpenseDate').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const employeeId = selectedEmployeeId;
    createEmployerExpensee(salaryAmount,date,description,paymentMethod,employeeId);
})


