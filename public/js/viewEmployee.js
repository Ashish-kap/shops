const BaseUrl = `https://sugarcan-shop.onrender.com`
// const BaseUrl = `http://localhost:3000`


const currentUrl = window.location.href;

// Use regular expressions to extract shopId and employeeId
const shopIdMatch = currentUrl.match(/\/shop\/([a-zA-Z0-9]+)/);
const employeeIdMatch = currentUrl.match(/\/employee-details\/([a-zA-Z0-9]+)/);

const shopId = shopIdMatch[1]; 
const employeeId = employeeIdMatch[1];



//Fetch Employer expense table
async function fetchEmployeeExpenses() {
            const response = await fetch(`${BaseUrl}/shop/${shopId}/get-all-employee-expenses/${employeeId}`);
            const data = await response.json();
            return data.allExpenses;
        }

async function fetchEmployeeDetails() {
    const response = await fetch(`${BaseUrl}/shop/${shopId}/get-all-employee-expenses/${employeeId}`);
    const data = await response.json();
    return data.employee;
}


    async function populateEmployeeExpenseTable() {
            const employeeDetails = await fetchEmployeeDetails();
            const employeeExpenses = await fetchEmployeeExpenses();
            const employeeExpenseTableBody = document.getElementById("employeeExpenseTableBody");
           
            // Populate employee details
            const nameElement = document.getElementById('employeeName');
            const salaryElement = document.getElementById('employeeSalary');
            const balancedElement = document.getElementById('employeeBalanced');
            const addressElement = document.getElementById('employeeAddress');
            const phoneElement = document.getElementById('employeePhoneNumber');

            nameElement.innerHTML = `<p style="color:black"><strong>Name:</strong> ${employeeDetails.name}</p>`;
            salaryElement.innerHTML = `<p style="color:black"><strong>Salary: </strong> ${employeeDetails.salary.toLocaleString()} Rs</p>`;
            balancedElement.innerHTML=  `<p style="color:black"><strong>Balanced:</strong> ${employeeDetails.balanced.toLocaleString()} Rs</p>`;;
            addressElement.innerHTML = `<p style="color:black"><strong>Address:</strong> ${employeeDetails.address}</p>`;
            phoneElement.innerHTML=  `<p style="color:black"><strong>Phone Number:</strong>  ${employeeDetails.phoneNumber}</p>`;;


            employeeExpenses.forEach(item => {
                const row = document.createElement("tr");

                const salaryAmountCell = document.createElement("td");
                salaryAmountCell.textContent = item.salaryAmount;
                row.appendChild(salaryAmountCell);

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
                deleteButton.addEventListener("click", () => deleteEmployerExpense(item._id));
                actionButtons.appendChild(deleteButton);

                actionCell.appendChild(actionButtons);
                row.appendChild(actionCell);

                employeeExpenseTableBody.appendChild(row);
            });
        }

let employeeExpenseData = null;
function openEditEmployeeExpenseModal(expense) {
    employeeExpenseData=expense
    const modal = document.getElementById("updateEmployeeExpenseModal");
  
    const salaryAmountInput = document.getElementById("updateSalaryAmount");
    const expenseDateInput = document.getElementById("updateEmployeeExpenseDate");
    const paymentMethodInput = document.getElementById("updatePaymentMethod");
    const expenseDescriptionInput = document.getElementById("updateEmployeeExpenseDescription");

    const closeEmployeeExpenseModalButton = document.getElementById("closeUpdateEmployeeExpenseModalButton");

    salaryAmountInput.value = expense.salaryAmount;
    expenseDateInput.value = expense.date.substring(0, 10);
    paymentMethodInput.value = expense.paymentMethod;
    expenseDescriptionInput.value = expense.description;

    modal.style.display = "block";
    closeEmployeeExpenseModalButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
}

populateEmployeeExpenseTable();



const updateEmployerExpense = async (salaryAmount,date,description,paymentMethod,docId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${BaseUrl}/update-employee-salaries/${docId}`,
      data:{
        salaryAmount,
        date,
        paymentMethod,
        description
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
    const docId = employeeExpenseData._id
    const salaryAmount = document.getElementById('updateSalaryAmount').value;
    const description = document.getElementById('updateEmployeeExpenseDescription').value;
    const date = document.getElementById('updateEmployeeExpenseDate').value;
    const paymentMethod = document.getElementById('updatePaymentMethod').value;
    updateEmployerExpense(salaryAmount,date,description,paymentMethod,docId);
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