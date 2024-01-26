// const BaseUrl = `https://sugarcan-shop.onrender.com`
// const BaseUrl = `http://localhost:3000`

const BaseUrl = window.config.BaseUrl;

const currentUrl = window.location.href;
const urlSegments = currentUrl.split("/");
const shopIndex = urlSegments.indexOf("all-employees");
const shopId = urlSegments[shopIndex + 1];
var selectedEmployeeId;


document.addEventListener("DOMContentLoaded", function() {
  // Fetch employee data from the API
  const apiUrl = `${BaseUrl}/get-register-employee`;
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
      <img src='/images/bin.png' class="deleteemployeeId" style='float:right'>
      <img src="/images/employee_photo.jpg" alt="Employee Photo" class="employee-photo">
      <h2>${employee.name}</h2>
      <p><strong>Shop Name:</strong> ${employee.shopName}</p>
      <p><strong>Salary:</strong> ${employee.salary.toLocaleString()} Rs</p>
      <p><strong>Balanced:</strong> ${employee.balanced.toLocaleString()} Rs</p>
      <button class="view-btn">View Details</button>
      <button class="pay-btn" id="paySalary">Pay Salary</button>
    `;

      // <p><strong>Address:</strong> ${employee.address}</p>
      // <p><strong>Phone:</strong> ${employee.phoneNumber}</p>

    // delete employee
    const deleteemployee = card.querySelector('.deleteemployeeId')
    deleteemployee.addEventListener('click', () => {
        deleteEmployee(employee.id)
    });

    const viewDetailsButton = card.querySelector('.view-btn');

    // Add a click event listener to the button
    viewDetailsButton.addEventListener('click', () => {
        // Redirect to another site
        window.location.href = `${BaseUrl}/shop/employee-details/${employee.id}`; // Replace with your desired URL
    });

    // Add event listener to "Pay Salary" button on this employee card
    const payButton = card.querySelector('.pay-btn');
    const employeeExpenseModal = document.getElementById('employeeExpenseModal');
    const closeEmployeeExpenseModalButton = document.getElementById('closeEmployeeExpenseModalButton');

    payButton.addEventListener('click', function() {
      employeeExpenseModal.style.display = 'block';
      
      selectedEmployeeId = employee.id; 
      console.log("Selected employee ID:", selectedEmployeeId);
    });

    closeEmployeeExpenseModalButton.addEventListener('click', function() {
      employeeExpenseModal.style.display = 'none';
    });

    return card;
}
});


const deleteEmployee = async (employeeId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `${BaseUrl}/delete-employee/${employeeId}`,
      data:{
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"employee deleted successfully!",
            icon: "success",
            button: "OK",
        }).then(() => {
            location.reload()
        });
    }
  } catch (err) {
    swal({
      text:err.response.data.message,
      icon: "warning",
      button: "OK",
    })
  }
};



const createEmployerExpensee = async (salaryAmount,date,description,paymentMethod,employeeId,whichMonthSalary) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/create-employee-salaries/employee/${employeeId}`,
      data:{
        salaryAmount,
        date,
        paymentMethod,
        description,
        whichMonthSalary:whichMonthSalary
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
    const fromWhichMonth = document.getElementById('fromMonth').value;
    const toWhichMonth = document.getElementById('toMonth').value;
    const whichMonthSalary = `${fromWhichMonth}-${toWhichMonth}`
    createEmployerExpensee(salaryAmount,date,description,paymentMethod,employeeId,whichMonthSalary);
})


