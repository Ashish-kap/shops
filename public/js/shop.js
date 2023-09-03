// JS file
// const BaseUrl = `https://sugarcan-shop.onrender.com`
const dropdown = document.getElementById("timeRange");
const totalDailyProfit = document.getElementById("totalDailyProfit");
const totalDailyIncome = document.getElementById("totalDailyIncome");
const totalDailyExpense = document.getElementById("totalDailyExpense");
const shopName = document.getElementById('shopName')
const contactInformation = document.getElementById('contactInformation')
const address = document.getElementById('address')


const currentUrl = window.location.href;
const urlSegments = currentUrl.split("/");
const shopIndex = urlSegments.indexOf("shop-overview");
const shopId = urlSegments[shopIndex + 1];

// Function to fetch data from the API based on selected value
async function fetchData(selectedValue) {
  try {
    const response = await fetch(`https://sugarcan-shop.onrender.com/${selectedValue}-profit-by-shop/${shopId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Function to update the card container with fetched data
async function updateCardContainer() {
  const selectedValue = dropdown.value;
  const data = await fetchData(selectedValue);
  if (data) {
    shopName.textContent = data.name;
    address.textContent = data.address;
    contactInformation.textContent = data.contactInformation;
    totalDailyProfit.textContent = data.totalProfitByShop;
    totalDailyIncome.textContent = data.totalIncomeByShop;
    totalDailyExpense.textContent = data.totalExpenseByShop;
  }
}

// Event listener to handle user selection
dropdown.addEventListener("change", updateCardContainer);

// Initial update when the page loads with the default value (Daily)
updateCardContainer();



// ---------- Date range ------------

document.addEventListener("DOMContentLoaded", () => {
  const applyDateRangeButton = document.getElementById("applyDateRange");
  applyDateRangeButton.addEventListener("click", async () => {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    const apiUrl = `${BaseUrl}/select-period-for-shop/${shopId}?start=${startDate}&end=${endDate}`;
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const totalProfitElement = document.getElementById("totalDailyProfit");
      const totalIncomeElement = document.getElementById("totalDailyIncome");
      const totalExpenseElement = document.getElementById("totalDailyExpense");

      totalProfitElement.textContent = data.totalProfit;
      totalIncomeElement.textContent = data.totalIncome;
      totalExpenseElement.textContent = data.totalExpense;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
});


//  ----------- register employee modal --------
document.addEventListener('DOMContentLoaded', function() {
  const registerEmployeeButton = document.getElementById("registerEmployeeButton");
  const registerVendorButton = document.getElementById("registerVendorButton");
  const employeeModal = document.getElementById("employeeModal");
  const vendorModal = document.getElementById("vendorModal");
  const closeModal = document.getElementById("closeModal");
  const closeModalVendor = document.getElementById("closeModalVendor");

  //  View vendor and employee button
  const viewEmployeeButton = document.getElementById("viewEmployeeButton");
  const viewVendorButton = document.getElementById("viewVendorButton");


  registerEmployeeButton.addEventListener("click", function() {
    employeeModal.style.display = "flex";
  });

  registerVendorButton.addEventListener("click", function() {
    vendorModal.style.display = "flex";
  });

  closeModal.addEventListener("click", function() {
    employeeModal.style.display = "none";
  });

  closeModalVendor.addEventListener("click", function() {
    vendorModal.style.display = "none";
  });

  window.addEventListener('click', function(event) {
    if (event.target === employeeModal) {
      employeeModal.style.display = 'none';
    }
  });

   viewEmployeeButton.addEventListener('click', () => {
            window.location.href = `/all-employees/${shopId}`;
   });

   viewVendorButton.addEventListener('click', () => {
        window.location.href =  `/all-vendors/${shopId}`;
   });

});


// register employeee
const registerEmployee = async (employeeName,employeeAddress,phoneNumber,employeeSalary) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/register-employee/${shopId}`,
      data:{
        name:employeeName,
        address:employeeAddress,
        phoneNumber,
        salary:employeeSalary
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"Employee registered successfully!",
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


document.querySelector('.registerEmployeeForm').addEventListener('submit',e=>{
    e.preventDefault();
    const employeeName = document.getElementById('employeeName').value;
    const employeeAddress = document.getElementById('employeeAddress').value;
    const phoneNumber = document.getElementById('employeePhoneNumber').value;
    const employeeSalary = document.getElementById('employeeSalary').value;
    registerEmployee(employeeName,employeeAddress,phoneNumber,employeeSalary);
})


// register vendor
const registerVendor = async (VendorName,VendorAddress,ContactInformation) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/register-vendors/${shopId}`,
      data:{
        vendorName:VendorName,
        address:VendorAddress,
        contactInformation:ContactInformation,
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"Vendor registered successfully!",
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


document.querySelector('.registerVendorForm').addEventListener('submit',e=>{
    e.preventDefault();
    const VendorName = document.getElementById('vendorName').value;
    const VendorAddress = document.getElementById('vendorAddress').value;
    const ContactInformation = document.getElementById('vendorContactInformation').value;
    registerVendor(VendorName,VendorAddress,ContactInformation);
})


//  -------- OPEN Expense Modal ----------
// Get the modal and buttons
const modal = document.getElementById("expenseModal");

const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.getElementById("closeModalButton");


// Function to open the modal
openModalButton.addEventListener("click", () => {
  modal.style.display = "block";
});

// Function to close the modal
closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
});

//  basic expense modal
const basicExpenseModal = document.getElementById("basicExpenseModal");
const basicExpenseButton = document.getElementById("basicExpenseButton");
const closeBasicExpenseModalButton = document.getElementById("closeBasicExpenseModalButton");

// Function to open the basic expense modal
basicExpenseButton.addEventListener("click", () => {
  basicExpenseModal.style.display = "block";
});

closeBasicExpenseModalButton.addEventListener("click", () => {
  basicExpenseModal.style.display = "none";
});



// ----------- Employees ----------------------------

document.addEventListener("DOMContentLoaded", async function () {
  const employeeNameSelect = document.getElementById("employeeName");

  const response = await fetch(`${BaseUrl}/get-register-employee/64c634c3b26622a9ae9bea40`);
  const employees = await response.json();

  employees.forEach(function (employee) {
    const option = document.createElement("option");
    option.value = employee.name;
    option.text = employee.name;
    employeeNameSelect.appendChild(option);
  });

  employeeNameSelect.addEventListener("change", function () {
    const selectedEmployee = employees.find(employee => employee.name === employeeNameSelect.value);
    if (selectedEmployee) {
      document.getElementById("employeeAddress").value = selectedEmployee.address;
      document.getElementById("employeePhoneNumber").value = selectedEmployee.phoneNumber;
      document.getElementById("employeeSalary").value = selectedEmployee.salary;
    }
  });
});


// ----------------- INCOME MODAL ---------------------

// Get the income modal and buttons
const incomeModal = document.getElementById("incomeModal");
const openIncomeModalButton = document.getElementById("openIncomeModalButton");
const closeIncomeModalButton = document.getElementById("closeIncomeModalButton");

// Function to open the income modal
openIncomeModalButton.addEventListener("click", () => {
  incomeModal.style.display = "block";
});

// Function to close the income modal
closeIncomeModalButton.addEventListener("click", () => {
  incomeModal.style.display = "none";
});

// show all basic expenses tabel
async function fetchExpenses() {
    const response = await fetch(`${BaseUrl}/get-all-basic-expenses/${shopId}`);
    const data = await response.json();
    return data.allExpenses;
}


async function populateTable() {
    const expenses = await fetchExpenses();
    const expenseTableBody = document.getElementById("expenseTableBody");

    expenses.forEach(expense => {

        const row = document.createElement("tr");
        const expenseNameCell = document.createElement("td");
        expenseNameCell.textContent = expense.expenseName;
        row.appendChild(expenseNameCell);

        const amountCell = document.createElement("td");
        amountCell.textContent = expense.amount;
        row.appendChild(amountCell);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = expense.description;
        row.appendChild(descriptionCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = new Date(expense.date).toLocaleDateString('en-GB');
        row.appendChild(dateCell);

        const actionCell = document.createElement("td");
        const actionButtons = document.createElement("div");
        actionButtons.classList.add("action-buttons");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => openEditModal(expense));
        actionButtons.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteBasicExpense(expense._id));
        actionButtons.appendChild(deleteButton);

        actionCell.appendChild(actionButtons);
        row.appendChild(actionCell);

        expenseTableBody.appendChild(row);
    });
}


let expenseData = null
function openEditModal(expense) {

    expenseData = expense;
    const modal = document.getElementById("updateBasicExpenseModal");
    const expenseNameInput = document.getElementById("updateExpenseName");
    const expenseAmountInput = document.getElementById("updateExpenseAmount");
    const expenseDateInput = document.getElementById("updateExpenseDate");
    const expenseDescriptionInput = document.getElementById("updateExpenseDescription");

    const closeBasicExpenseModalButton = document.getElementById("closeUpdateBasicExpenseModalButton");

    expenseNameInput.value = expense.expenseName;
    expenseAmountInput.value = expense.amount;
    expenseDateInput.value = expense.date.substring(0, 10);
    expenseDescriptionInput.value = expense.description;

    modal.style.display = "block";
    closeBasicExpenseModalButton.addEventListener("click", () => {
       modal.style.display = "none";
    });
}

populateTable();



// fetch Income table
async function fetchIncome() {
            const response = await fetch(`${BaseUrl}/get-all-income/${shopId}`);
            const data = await response.json();
            return data.allIncome;
        }

        async function populateIncomeTable() {
            const income = await fetchIncome();
            const incomeTableBody = document.getElementById("incomeTableBody");

            income.forEach(item => {
                const row = document.createElement("tr");
                const amountCell = document.createElement("td");
                amountCell.textContent = item.amount;
                row.appendChild(amountCell);

                const ProductSoldQuantityCell = document.createElement("td");
                ProductSoldQuantityCell.textContent = item.ProductSoldQuantity;
                row.appendChild(ProductSoldQuantityCell);

                const incomeSourceCell = document.createElement("td");
                incomeSourceCell.textContent = item.incomeSource;
                row.appendChild(incomeSourceCell);

                const descriptionCell = document.createElement("td");
                descriptionCell.textContent = item.description;
                row.appendChild(descriptionCell);


                const dateCell = document.createElement("td");
                dateCell.textContent = new Date(item.date).toLocaleDateString('en-GB');
                row.appendChild(dateCell);

                const actionCell = document.createElement("td");
                const actionButtons = document.createElement("div");
                actionButtons.classList.add("action-buttons");

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.addEventListener("click", () => openEditIncomeModal(item));
                actionButtons.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", () => deleteIncome(item._id));
                actionButtons.appendChild(deleteButton);

                actionCell.appendChild(actionButtons);
                row.appendChild(actionCell);

                incomeTableBody.appendChild(row);
            });
}


let updateIncomeData=null;
function openEditIncomeModal(income) {
    updateIncomeData = income;
    const modal = document.getElementById("updateIncomeModal");
    const amountInput = document.getElementById("updateAmount");
    const dateInput = document.getElementById("updateDate");
    const ProductSoldQuantityInput = document.getElementById("updateProductSoldQuantity");
    const incomeSourceNameInput = document.getElementById("updateIncomeSourceName");
    const descriptionInput = document.getElementById("updateDescription");

    const closeIncomeModalButton = document.getElementById("closeUpdateIncomeModalButton");

    amountInput.value = income.amount;
    dateInput.value = income.date.substring(0, 10);
    descriptionInput.value = income.description;
    incomeSourceNameInput.value=income.incomeSource;
    ProductSoldQuantityInput.value=income.ProductSoldQuantity;

    modal.style.display = "block";

    closeIncomeModalButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
}

populateIncomeTable();


//  DOWNLOAD EXPENSE REPORT

// document.addEventListener('DOMContentLoaded', function() {
//   const downloadLink = document.getElementById('download-link');

//   downloadLink.addEventListener('click', async function(event) {
//     event.preventDefault(); // Prevent the default behavior of the anchor tag

//     const apiUrl = `${BaseUrl}/all-expenses-by-shop/${shopId}`;

//     try {
//       const response = await fetch(apiUrl);
//       const data = await response.json();
//       // Handle the data as needed
//       console.log(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   });
// });


document.addEventListener('DOMContentLoaded', function() {
  const downloadLink = document.getElementById('download-link');

  downloadLink.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    window.location.href=`${BaseUrl}/all-expenses-by-shop/${shopId}`
  });
});








