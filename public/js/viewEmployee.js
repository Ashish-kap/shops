// const BaseUrl = `https://sugarcan-shop.onrender.com`
// const BaseUrl = `http://localhost:3000`

const BaseUrl = window.config.BaseUrl;
const currentUrl = window.location.href;

// Use regular expressions to extract shopId and employeeId
const shopIdMatch = currentUrl.match(/\/shop\/([a-zA-Z0-9]+)/);
const employeeIdMatch = currentUrl.match(/\/employee-details\/([a-zA-Z0-9]+)/);

const shopId = shopIdMatch[1]; 
const employeeId = employeeIdMatch[1];

console.log(employeeId)

//Fetch Employer expense table
async function fetchEmployeeExpenses() {
            const defaultStartDate = new Date().toISOString().split('T')[0];
            const response = await fetch(`${BaseUrl}/shop/get-all-employee-expenses/${employeeId}?start=${defaultStartDate}&end=${defaultStartDate}`);
            const data = await response.json();
            return data.allExpenses;
        }

async function fetchEmployeeDetails() {
    const defaultStartDate = new Date().toISOString().split('T')[0];
    const response = await fetch(`${BaseUrl}/shop/get-all-employee-expenses/${employeeId}?start=${defaultStartDate}&end=${defaultStartDate}`);
    const data = await response.json();
    return data.employee;
}


async function populateEmployeeExpenseTable() {
            const employeeDetails = await fetchEmployeeDetails();
            const employeeExpenses = await fetchEmployeeExpenses();
            const employeeExpenseTableBody = document.getElementById("employeeExpenseTableBody");
           
            // Populate employee details
            const nameElement = document.getElementById('employeeName');
            const shopElement = document.getElementById('shopName');
            const salaryElement = document.getElementById('employeeSalary');
            const balancedElement = document.getElementById('employeeBalanced');
            const addressElement = document.getElementById('employeeAddress');
            const phoneElement = document.getElementById('employeePhoneNumber');
            const joinDateElement = document.getElementById('employeeJoinDate');

              const date = new Date(employeeDetails.joinDate);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it's 0-indexed
              const year = date.getFullYear();
              const formattedDate = `${year}-${month}-${day}`;

            nameElement.innerHTML = `<p><strong>Name:</strong> ${employeeDetails.name}</p>`;
            shopElement.innerHTML = `<p><strong>Shop Name:</strong> ${employeeDetails.shopName}</p>`;
            addressElement.innerHTML = `<p><strong>Address:</strong> ${employeeDetails.address}</p>`;
            phoneElement.innerHTML=  `<p><strong>Phone Number:</strong>  ${employeeDetails.phoneNumber}</p>`;
            joinDateElement.innerHTML=  `<p><strong>Join Date:</strong>  ${formattedDate}</p>`;
            salaryElement.innerHTML = `<p><strong>Salary: </strong> ${employeeDetails.salary.toLocaleString()} Rs</p>`;
            balancedElement.innerHTML=  `<p><strong>Balanced:</strong> ${employeeDetails.balanced.toLocaleString()} Rs</p>`;;



            employeeExpenses.forEach(item => {
                const row = document.createElement("tr");

                const salaryAmountCell = document.createElement("td");
                salaryAmountCell.textContent = item.salaryAmount;
                row.appendChild(salaryAmountCell);

                const whichMonthSalaryCell = document.createElement("td");
                whichMonthSalaryCell.textContent = item.whichMonthSalary;
                row.appendChild(whichMonthSalaryCell);


                const descriptionCell = document.createElement("td");
                descriptionCell.textContent = item.description;
                row.appendChild(descriptionCell);

                const paymentMethodCell = document.createElement("td");
                paymentMethodCell.textContent = item.paymentMethod;
                row.appendChild(paymentMethodCell);

                const dateCell = document.createElement("td");
                dateCell.textContent = new Date(item.date).toLocaleDateString('en-GB');;
                row.appendChild(dateCell);

                const actionCell = document.createElement("td");
                const actionButtons = document.createElement("div");
                actionButtons.classList.add("action-button");
                actionButtons.classList.add("action-buttons");

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.classList.add("edit-button");
                editButton.addEventListener("click", () => openEditEmployeeExpenseModal(item));
                actionButtons.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-button");
                deleteButton.addEventListener("click", () => deleteEmployerExpense(item.id));
                actionButtons.appendChild(deleteButton);

                actionCell.appendChild(actionButtons);
                row.appendChild(actionCell);

                employeeExpenseTableBody.appendChild(row);
            });
}

async function filterPopulateEmployeeTable() {
  const filterButtonEmployee = document.getElementById("filterEmployeeSource");
  filterButtonEmployee.addEventListener("click", async() => {
            const startDate = document.getElementById("filterStartDateEmployee");
            const endDate = document.getElementById("filterEndDateEmployee");

            const employeeExpenseTableBody = document.getElementById("employeeExpenseTableBody")
            employeeExpenseTableBody.innerHTML = '';


            const response = await fetch(`${BaseUrl}/shop/get-all-employee-expenses/${employeeId}?start=${startDate.value}&end=${endDate.value}`);
            const data = await response.json();
            const employeeExpenses= data.allExpenses;

            const employeeDetails = await fetchEmployeeDetails();
                      
            // Populate employee details
            const nameElement = document.getElementById('employeeName');
            const shopElement = document.getElementById('shopName');
            const salaryElement = document.getElementById('employeeSalary');
            const balancedElement = document.getElementById('employeeBalanced');
            const addressElement = document.getElementById('employeeAddress');
            const phoneElement = document.getElementById('employeePhoneNumber');
            const joinDateElement = document.getElementById('employeeJoinDate');

            const date = new Date(employeeDetails.joinDate);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it's 0-indexed
            const year = date.getFullYear();
            const formattedDate = `${year}-${month}-${day}`;

            nameElement.innerHTML = `<p><strong>Name:</strong> ${employeeDetails.name}</p>`;
            shopElement.innerHTML = `<p><strong>Shop Name:</strong> ${employeeDetails.shopName}</p>`;
            addressElement.innerHTML = `<p><strong>Address:</strong> ${employeeDetails.address}</p>`;
            phoneElement.innerHTML=  `<p><strong>Phone Number:</strong>  ${employeeDetails.phoneNumber}</p>`;
            joinDateElement.innerHTML=  `<p><strong>Join Date:</strong>  ${formattedDate}</p>`;
            salaryElement.innerHTML = `<p><strong>Salary: </strong> ${employeeDetails.salary.toLocaleString()} Rs</p>`;
            balancedElement.innerHTML=  `<p><strong>Balanced:</strong> ${employeeDetails.balanced.toLocaleString()} Rs</p>`;;



            employeeExpenses.forEach(item => {
                const row = document.createElement("tr");

                const salaryAmountCell = document.createElement("td");
                salaryAmountCell.textContent = item.salaryAmount;
                row.appendChild(salaryAmountCell);

                const whichMonthSalaryCell = document.createElement("td");
                whichMonthSalaryCell.textContent = item.whichMonthSalary;
                row.appendChild(whichMonthSalaryCell);


                const descriptionCell = document.createElement("td");
                descriptionCell.textContent = item.description;
                row.appendChild(descriptionCell);

                const paymentMethodCell = document.createElement("td");
                paymentMethodCell.textContent = item.paymentMethod;
                row.appendChild(paymentMethodCell);

                const dateCell = document.createElement("td");
                dateCell.textContent = new Date(item.date).toLocaleDateString('en-GB');;
                row.appendChild(dateCell);

                const actionCell = document.createElement("td");
                const actionButtons = document.createElement("div");
                actionButtons.classList.add("action-buttons");

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.addEventListener("click", () => openEditEmployeeExpenseModal(item));
                actionButtons.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", () => deleteEmployerExpense(item.id));
                actionButtons.appendChild(deleteButton);

                actionCell.appendChild(actionButtons);
                row.appendChild(actionCell);

                employeeExpenseTableBody.appendChild(row);
            });


  })
}

const clearButtonEmployeeTable = document.getElementById("clearEmployeeExpense");
clearButtonEmployeeTable.addEventListener("click", () => {
window.location.reload();
});

document.addEventListener('DOMContentLoaded', filterPopulateEmployeeTable);

let employeeExpenseData = null;
function openEditEmployeeExpenseModal(expense) {
    employeeExpenseData=expense
    const modal = document.getElementById("updateEmployeeExpenseModal");
  
    const salaryAmountInput = document.getElementById("updateSalaryAmount");
    const expenseDateInput = document.getElementById("updateEmployeeExpenseDates");
    const paymentMethodInput = document.getElementById("updatePaymentMethod");
    const expenseDescriptionInput = document.getElementById("updateEmployeeExpenseDescription");

    const updateFromMonthInput = document.getElementById("updateFromMonth");
    const updateToMonthInput = document.getElementById("updateToMonth");
  

    const closeEmployeeExpenseModalButton = document.getElementById("closeUpdateEmployeeExpenseModalButton");

    salaryAmountInput.value = expense.salaryAmount;

    const date = new Date(expense.date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it's 0-indexed
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    expenseDateInput.value = formattedDate;
    // expenseDateInput.value = expense.date.substring(0, 10);
    paymentMethodInput.value = expense.paymentMethod;
    expenseDescriptionInput.value = expense.description;
    if(expense.whichMonthSalary){
      updateFromMonthInput.value = expense.whichMonthSalary.split('-')[0];
      updateToMonthInput.value = expense.whichMonthSalary.split('-')[1];
    }
    modal.style.display = "block";
    closeEmployeeExpenseModalButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
}
populateEmployeeExpenseTable();


const updateEmployerExpense = async(salaryAmount,date,description,paymentMethod,updateFromMonthh,updateToMonthh,docId) => {
  try {
    console.log("here your date:"+ date)
    const res = await axios({
      method: 'PATCH',
      url: `${BaseUrl}/update-employee-salaries/${docId}/${employeeId}`,
      data:{
        salaryAmount,
        date,
        paymentMethod,
        description,
        whichMonthSalary:`${updateFromMonthh}-${updateToMonthh}`
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"updated successfully!",
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


document.querySelector('.update-employee-expense-form').addEventListener('submit',e=>{
    e.preventDefault();
    const docId = employeeExpenseData.id
    const salaryAmount = document.getElementById('updateSalaryAmount').value;
    const description = document.getElementById('updateEmployeeExpenseDescription').value;
    const date = document.getElementById('updateEmployeeExpenseDates').value;
    const paymentMethod = document.getElementById('updatePaymentMethod').value;
    const updateFromMonthh = document.getElementById("updateFromMonth").value;
    const updateToMonthh = document.getElementById("updateToMonth").value;
    console.log(`${updateFromMonthh-updateToMonthh}`)
    updateEmployerExpense(salaryAmount,date,description,paymentMethod,updateFromMonthh,updateToMonthh,docId);
})


// Delete Income
const deleteEmployerExpense = async (docId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `${BaseUrl}/delete-employee-salaries/${docId}/employee/${employeeId}`,
      data:{
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"Deleted successfully!",
            icon: "success",
            button: "OK",
        }).then(() => {
            location.reload()
        });
    }
  } catch (err) {
    console.log(err)
    swal({
      text:err.response.data.message,
      icon: "warning",
      button: "OK",
    })
  }
};


// update employee modal


async function populateShopNameForEmployeeModalUpdate() {
  const selectElement = document.getElementById('shopNameIncomeModall');
  try {
    const response = await fetch(`${BaseUrl}/all-shops`);

    if (!response.ok) {
      throw new Error('Failed to fetch shops');
    }
    var shopData = await response.json();
    
      shopData.forEach((shop) => {
      const option = document.createElement('option');
      option.value = shop.name;
      option.textContent= shop.name;
      option.className='select-shopNameIncomeModal';
      option.id='shopNameIncomeModall';
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    // Handle errors here, e.g., display an error message
  }
}

document.addEventListener('DOMContentLoaded', populateShopNameForEmployeeModalUpdate);

document.addEventListener('DOMContentLoaded', function() {
  const registerEmployeeButton = document.getElementById("employeEditButtonId");
  const employeeModal = document.getElementById("employeeModal");
  const closeModal = document.getElementById("employeeCloseModal");

  //  View vendor and employee button
  registerEmployeeButton.addEventListener("click", function() {
    employeeModal.style.display = "flex";
  });

  closeModal.addEventListener("click", function() {
    employeeModal.style.display = "none";
  });

  const apiUrl = `${BaseUrl}/get-one-employee/${employeeId}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const employee = data.result[0]; // Assuming there is only one result

      // Populate the modal fields with the API response
      document.getElementById('employeeNamee').value = employee.name;
      // document.getElementById('shopNameIncomeModall').value = employee.shopName;
      document.getElementById('employeeAddresss').value = employee.address;
      document.getElementById('employeePhoneNumberr').value = employee.phoneNumber;

      // Format the joinDate as YYYY-MM-DD for the input field
      const joinDate = new Date(employee.joinDate);
      const formattedJoinDate = joinDate.toISOString().split('T')[0];
      document.getElementById('employeeJoinDatee').value = formattedJoinDate;

      document.getElementById('employeeSalaryy').value = parseFloat(employee.salary).toFixed(2);
    })
    .catch((error) => {
      console.error('Error fetching employee data: ', error);
    });
});



const updateEmployee = async (employeeName,employeeAddress,phoneNumber,employeeSalary,shopName,employeeJoinDate) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${BaseUrl}/update-employee/${employeeId}`,
      data:{
        name:employeeName,
        address:employeeAddress,
        shopName,
        phoneNumber,
        salary:employeeSalary,
        joinDate:employeeJoinDate
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"Employee updated successfully!",
            icon: "success",
            button: "OK",
        }).then(() => {
            location.reload()
        });
    }
  } catch (err) {
    console.log(err)
    swal({
      text:err.response.data.message,
      icon: "warning",
      button: "OK",
    })
  }
};


document.querySelector('.registerEmployeeFormm').addEventListener('submit',e=>{
    e.preventDefault();
    const employeeName = document.getElementById('employeeNamee').value;
    const employeeAddress = document.getElementById('employeeAddresss').value;
    const phoneNumber = document.getElementById('employeePhoneNumberr').value;
    const shopName = document.getElementById('shopNameIncomeModall').value;
    const employeeSalary = document.getElementById('employeeSalaryy').value;
    const employeeJoinDate = document.getElementById('employeeJoinDatee').value;
    updateEmployee(employeeName,employeeAddress,phoneNumber,employeeSalary,shopName,employeeJoinDate);
})