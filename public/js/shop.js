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
    const response = await fetch(`${BaseUrl}/${selectedValue}-profit-by-shop/${shopId}`);
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



//  -------- OPEN Expense Modal ----------
// Get the modal and buttons
const modal = document.getElementById("basicExpenseModal");
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

  const response = await fetch(`${BaseUrl}/get-register-employee`);
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
// async function fetchExpenses() {
//     const startDate = document.getElementById("filterStartDate");
//     const endDate = document.getElementById("filterEndDate");
//     const expenseType = document.getElementById("filterExpenseTypeName");
//     const employeeName = document.getElementById("filterbasicExpenseForWhomName");

//     const selectedExpenseType = expenseType.value;
//     console.log(selectedExpenseType)
//     // &forWhichEmployee=${employeeName.value}
//     if (selectedExpenseType !== 'Select an expenseType') {
//       const response = await fetch(`${BaseUrl}/get-all-basic-expenses/${shopId}?start=${startDate.value}&end=${endDate.value}&expenseName=${selectedExpenseType}`);
//       const data = await response.json();
//       console.log(data);
//       return data.allExpenses;
//     }
// }
// document.addEventListener('DOMContentLoaded', fetchExpenses);


async function populateBillNumberForIncomeModal() {
  const selectElement = document.getElementById('billNumberNameForIncomeModal');
  try {
      const response = await fetch(`${BaseUrl}/get/all/billnumbers`);

      if (!response.ok) {
        throw new Error('Failed to fetch bill number');
      }
      var billNumberData = await response.json();
    
    // Iterate through the expense types and create options for the select element
      billNumberData.billNumbers.forEach((billNumber) => {
      const option = document.createElement('option');
      option.value = billNumber.BillNumber;
      option.textContent= billNumber.BillNumber;
      option.className='select-option-billNumber';
      option.id='billNumberName';
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    // Handle errors here, e.g., display an error message
  }
}

document.addEventListener('DOMContentLoaded', populateBillNumberForIncomeModal);


async function populateTable() {
    // const expenses = await fetchExpenses();
    const expenseTableBody = document.getElementById("expenseTableBody");

    const defaultStartDate = new Date().toISOString().split('T')[0];
    const response = await fetch(`${BaseUrl}/get-all-basic-expenses/${shopId}?start=${defaultStartDate}&end=${defaultStartDate}`);
    const data = await response.json();
    const expenses = data.allExpenses;
    
    expenses.forEach(expense => {
        const row = document.createElement("tr");
        const expenseNameCell = document.createElement("td");
        expenseNameCell.textContent = expense.expenseName;
        row.appendChild(expenseNameCell);

        const amountCell = document.createElement("td");
        amountCell.textContent = expense.amount;
        row.appendChild(amountCell);

        const forWhichEmployeeCell = document.createElement("td");
        forWhichEmployeeCell.textContent = expense.forWhichEmployee;
        row.appendChild(forWhichEmployeeCell);

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
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", () => openEditModal(expense));
        actionButtons.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => deleteBasicExpense(expense.id));
        actionButtons.appendChild(deleteButton);

        actionCell.appendChild(actionButtons);
        row.appendChild(actionCell);

        expenseTableBody.appendChild(row);
    });
}


async function filterPopulateTable() {
const filterButton = document.getElementById("filterBasicExpense");
filterButton.addEventListener("click", async() => {
    // const expenses = await fetchExpenses();
    const startDate = document.getElementById("filterStartDate");
    const endDate = document.getElementById("filterEndDate");
    const expenseType = document.getElementById("filterExpenseTypeName");
    const employeeName = document.getElementById("filterbasicExpenseForWhomName");
    const expenseTableBody = document.getElementById("expenseTableBody");

    // Clear existing rows in the table
    expenseTableBody.innerHTML = '';

    const selectedExpenseType = expenseType.value;

    const startDateValue = startDate.value 
    const endDateValue = endDate.value 

   

    console.log(selectedExpenseType)
    const response = await fetch(`${BaseUrl}/get-all-basic-expenses/${shopId}?start=${startDateValue}&end=${endDateValue}&forWhichEmployee=${employeeName.value}&expenseName=${selectedExpenseType}`);
    const data = await response.json();
    
    const expenses = data.allExpenses;
    
      expenses.forEach(expense => {
        const row = document.createElement("tr");
        const expenseNameCell = document.createElement("td");
        expenseNameCell.textContent = expense.expenseName;
        row.appendChild(expenseNameCell);

        const amountCell = document.createElement("td");
        amountCell.textContent = expense.amount;
        row.appendChild(amountCell);

        const forWhichEmployeeCell = document.createElement("td");
        forWhichEmployeeCell.textContent = expense.forWhichEmployee;
        row.appendChild(forWhichEmployeeCell);

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
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", () => openEditModal(expense));
        actionButtons.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => deleteBasicExpense(expense.id));
        actionButtons.appendChild(deleteButton);

        actionCell.appendChild(actionButtons);
        row.appendChild(actionCell);

        expenseTableBody.appendChild(row);
    });
});
}

const clearButton = document.getElementById("clearBasicExpense");
clearButton.addEventListener("click", () => {
window.location.reload();
});

// document.addEventListener('DOMContentLoaded', populateTable);
document.addEventListener('DOMContentLoaded', filterPopulateTable);


let expenseData = null
function openEditModal(expense) {
    expenseData = expense;
    const modal = document.getElementById("updateBasicExpenseModal");
    const expenseNameInput = document.getElementById("updateExpenseName");
    const expenseAmountInput = document.getElementById("updateExpenseAmount");
    const forWhichEmployeeInput = document.getElementById("updateBasicExpenseForWhomName");
    const expenseDateInput = document.getElementById("updateExpenseDate");
    const expenseDescriptionInput = document.getElementById("updateExpenseDescription");

    const closeBasicExpenseModalButton = document.getElementById("closeUpdateBasicExpenseModalButton");


    const date = new Date(expense.date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it's 0-indexed
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    expenseNameInput.value = expense.expenseName;
    expenseAmountInput.value = expense.amount;
    forWhichEmployeeInput.value = expense.forWhichEmployee
    expenseDateInput.value = formattedDate;
    expenseDescriptionInput.value = expense.description;

    modal.style.display = "block";
    closeBasicExpenseModalButton.addEventListener("click", () => {
       modal.style.display = "none";
    });
}

populateTable();




async function populateIncomeTable() {
    // const income = await fetchIncome();
    const incomeTableBody = document.getElementById("incomeTableBody");
    const defaultStartDate = new Date().toISOString().split('T')[0];
    const response = await fetch(`${BaseUrl}/get-all-income/${shopId}?start=${defaultStartDate}&end=${defaultStartDate}`);
    const data = await response.json();
    const income = data.allIncome;
    income.forEach(item => {
    const row = document.createElement("tr");
                const amountCell = document.createElement("td");
                amountCell.textContent = item.amount;
                row.appendChild(amountCell);

                const ProductSoldQuantityCell = document.createElement("td");
                ProductSoldQuantityCell.textContent = item.ProductSoldQuantity;
                row.appendChild(ProductSoldQuantityCell);

                const billNumberCell = document.createElement("td");
                billNumberCell.textContent = item.billNumber;
                row.appendChild(billNumberCell);

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
                editButton.classList.add("edit-button");
                editButton.addEventListener("click", () => openEditIncomeModal(item));
                actionButtons.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-button");
                deleteButton.addEventListener("click", () => deleteIncome(item.id));
                actionButtons.appendChild(deleteButton);

                actionCell.appendChild(actionButtons);
                row.appendChild(actionCell);

                incomeTableBody.appendChild(row);
    });
}


async function filterPopulateIncomeTable() {

const filterButtonIncome = document.getElementById("filterIncomeSource");
filterButtonIncome.addEventListener("click", async() => {
    // const expenses = await fetchExpenses();
    const startDate = document.getElementById("filterStartDateIncome");
    const endDate = document.getElementById("filterEndDateIncome");
    const incomeSource = document.getElementById("incomeSourceName");
    // const billNumber = document.getElementById("billNumberName");
    const billNumber = document.getElementById("searchInput");
    const incomeTableBody = document.getElementById("incomeTableBody");

    // Clear existing rows in the table
    incomeTableBody.innerHTML = '';

    const response = await fetch(`${BaseUrl}/get-all-income/${shopId}?start=${startDate.value}&end=${endDate.value}&incomeSource=${incomeSource.value}&billNumber=${billNumber.value}`);
    const data = await response.json();
    const income = data.allIncome;

    income.forEach(item => {
    const row = document.createElement("tr");
                const amountCell = document.createElement("td");
                amountCell.textContent = item.amount;
                row.appendChild(amountCell);

                const ProductSoldQuantityCell = document.createElement("td");
                ProductSoldQuantityCell.textContent = item.ProductSoldQuantity;
                row.appendChild(ProductSoldQuantityCell);

                const billNumberCell = document.createElement("td");
                billNumberCell.textContent = item.billNumber;
                row.appendChild(billNumberCell);

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
                editButton.classList.add("edit-button");
                editButton.addEventListener("click", () => openEditIncomeModal(item));
                actionButtons.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-button");
                deleteButton.addEventListener("click", () => deleteIncome(item.id));
                actionButtons.appendChild(deleteButton);

                actionCell.appendChild(actionButtons);
                row.appendChild(actionCell);

                incomeTableBody.appendChild(row);
    });
    
});
}

const clearButtonIncomeTable = document.getElementById("clearIncomeExpense");
clearButtonIncomeTable.addEventListener("click", () => {
window.location.reload();
});


document.addEventListener('DOMContentLoaded', populateIncomeTable);
document.addEventListener('DOMContentLoaded', filterPopulateIncomeTable);

let updateIncomeData=null;
function openEditIncomeModal(income) {
    updateIncomeData = income;
    const modal = document.getElementById("updateIncomeModal");
    const amountInput = document.getElementById("updateAmount");
    const dateInput = document.getElementById("updateDate");
    const ProductSoldQuantityInput = document.getElementById("updateProductSoldQuantity");
    // const billNumberInput = document.getElementById("updateBillNumberName");
    const billNumberInput = document.getElementById("searchInputForIncomeModalUpdate");

    const incomeSourceNameInput = document.getElementById("updateIncomeSourceName");
    const descriptionInput = document.getElementById("updateDescription");

    const closeIncomeModalButton = document.getElementById("closeUpdateIncomeModalButton");

    
    amountInput.value = income.amount;


    const date = new Date(income.date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it's 0-indexed
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    dateInput.value = formattedDate;
    descriptionInput.value = income.description;
    incomeSourceNameInput.value=income.incomeSource;
    ProductSoldQuantityInput.value=income.ProductSoldQuantity;
    billNumberInput.value=income.billNumber;
    modal.style.display = "block";

    closeIncomeModalButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
}




// Bill Summary Table
async function populateBillSummaryTable() {
    const incomeTableBody = document.getElementById("billSummaryTableBody");
    const defaultStartDate = new Date().toISOString().split('T')[0];
    const response = await fetch(`${BaseUrl}/get/hisab/${shopId}?start=${defaultStartDate}&end=${defaultStartDate}`);
    const data = await response.json();

    data.forEach(item => {
    const row = document.createElement("tr");
                const billNumberCell = document.createElement("td");
                billNumberCell.textContent = item.billNumber;
                row.appendChild(billNumberCell);

                const CASHTotalCell = document.createElement("td");
                CASHTotalCell.textContent = item.CASHTotal;
                row.appendChild(CASHTotalCell);

                const GooglePayTotalCell = document.createElement("td");
                GooglePayTotalCell.textContent = item.GooglePayTotal;
                row.appendChild(GooglePayTotalCell);

                const BankTransferTotalCell = document.createElement("td");
                BankTransferTotalCell.textContent = item.BankTransferTotal;
                row.appendChild(BankTransferTotalCell);

                const GrandTotalCell = document.createElement("td");
                GrandTotalCell.textContent = item.GrandTotal;
                row.appendChild(GrandTotalCell);

                const TotalProductQuantityCell = document.createElement("td");
                TotalProductQuantityCell.textContent = item.TotalProductQuantity;
                row.appendChild(TotalProductQuantityCell);


                const GrandTotalPerProductCell = document.createElement("td");
                GrandTotalPerProductCell.textContent = item.GrandTotalPerProduct
                row.appendChild(GrandTotalPerProductCell);

                incomeTableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', populateBillSummaryTable);

async function filterPopulateBillSummary() {
const filterButtonBillSummary = document.getElementById("filterBillSummary");
filterButtonBillSummary.addEventListener("click", async() => {

    const incomeTableBody = document.getElementById("billSummaryTableBody");
    incomeTableBody.innerHTML = '';

    const startDate = document.getElementById("filterStartDateBillSummary");
    const endDate = document.getElementById("filterEndDateBillSummary");
    const billNumber = document.getElementById("searchInput");

    const response = await fetch(`${BaseUrl}/get/hisab/${shopId}?start=${startDate.value}&end=${endDate.value}&billNumber=${billNumber.value}`);
    const data = await response.json();

    data.forEach(item => {
    const row = document.createElement("tr");
                const billNumberCell = document.createElement("td");
                billNumberCell.textContent = item.billNumber;
                row.appendChild(billNumberCell);

                const CASHTotalCell = document.createElement("td");
                CASHTotalCell.textContent = item.CASHTotal;
                row.appendChild(CASHTotalCell);

                const GooglePayTotalCell = document.createElement("td");
                GooglePayTotalCell.textContent = item.GooglePayTotal;
                row.appendChild(GooglePayTotalCell);

                const BankTransferTotalCell = document.createElement("td");
                BankTransferTotalCell.textContent = item.BankTransferTotal;
                row.appendChild(BankTransferTotalCell);

                const GrandTotalCell = document.createElement("td");
                GrandTotalCell.textContent = item.GrandTotal;
                row.appendChild(GrandTotalCell);

                const TotalProductQuantityCell = document.createElement("td");
                TotalProductQuantityCell.textContent = item.TotalProductQuantity;
                row.appendChild(TotalProductQuantityCell);


                const GrandTotalPerProductCell = document.createElement("td");
                GrandTotalPerProductCell.textContent = item.GrandTotalPerProduct
                row.appendChild(GrandTotalPerProductCell);

                incomeTableBody.appendChild(row);
    });
    
});
}

const clearBillSummary = document.getElementById("clearBillSummary");
clearBillSummary.addEventListener("click", () => {
window.location.reload();
});

document.addEventListener('DOMContentLoaded', filterPopulateBillSummary);


// bill number summary using search bar
async function populateBillNumberSummary() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestions');

    try {
        const response = await fetch(`${BaseUrl}/get/all/billnumbers`);
        if (!response.ok) {
            throw new Error('Failed to fetch bill numbers');
        }

        const billNumberData = await response.json();
        const availableBillNumbers = billNumberData.billNumbers.map(item => item.BillNumber);

        // Handle user input
        searchInput.addEventListener('input', (event) => {
            const inputValue = event.target.value.toLowerCase();
            const filteredOptions = availableBillNumbers.filter(option => option.toLowerCase().includes(inputValue));

            // Display or hide suggestions
            if (inputValue.length > 0) {
                suggestionsContainer.innerHTML = '';
                filteredOptions.forEach(option => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = option;
                    suggestion.addEventListener('click', () => {
                        searchInput.value = option;
                        suggestionsContainer.style.display = 'none';
                    });
                    suggestionsContainer.appendChild(suggestion);
                });
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (event) => {
            if (event.target !== searchInput && event.target !== suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
        });
    } catch (error) {
        console.error(error);
        // Handle errors here, e.g., display an error message
    }
}

populateBillNumberSummary();


// bill Number search for income Table
async function populateBillNumberSearchForIncome() {
    const searchInput = document.getElementById('searchInputForIncomeTable');
    const suggestionsContainer = document.getElementById('suggestionsForIncomeTable');
    try {
        const response = await fetch(`${BaseUrl}/get/all/billnumbers`);
        if (!response.ok) {
            throw new Error('Failed to fetch bill numbers');
        }

        const billNumberData = await response.json();
        const availableBillNumbers = billNumberData.billNumbers.map(item => item.BillNumber);

        // Handle user input
        searchInput.addEventListener('input', (event) => {
            const inputValue = event.target.value.toLowerCase();
            const filteredOptions = availableBillNumbers.filter(option => option.toLowerCase().includes(inputValue));

            // Display or hide suggestions
            if (inputValue.length > 0) {
                suggestionsContainer.innerHTML = '';
                filteredOptions.forEach(option => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = option;
                    suggestion.addEventListener('click', () => {
                        searchInput.value = option;
                        suggestionsContainer.style.display = 'none';
                    });
                    suggestionsContainer.appendChild(suggestion);
                });
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (event) => {
            if (event.target !== searchInput && event.target !== suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
        });
    } catch (error) {
        console.error(error);
        // Handle errors here, e.g., display an error message
    }
}

populateBillNumberSearchForIncome();


// bill Number search for income modal
async function populateBillNumberForIncomeModal() {
    const searchInput = document.getElementById('searchInputForIncomeModal');
    const suggestionsContainer = document.getElementById('suggestionsForIncomeModal');
    try {
        const response = await fetch(`${BaseUrl}/get/all/billnumbers`);
        if (!response.ok) {
            throw new Error('Failed to fetch bill numbers');
        }

        const billNumberData = await response.json();
        const availableBillNumbers = billNumberData.billNumbers.map(item => item.BillNumber);

        // Handle user input
        searchInput.addEventListener('input', (event) => {
            const inputValue = event.target.value.toLowerCase();
            const filteredOptions = availableBillNumbers.filter(option => option.toLowerCase().includes(inputValue));

            // Display or hide suggestions
            if (inputValue.length > 0) {
                suggestionsContainer.innerHTML = '';
                filteredOptions.forEach(option => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = option;
                    suggestion.addEventListener('click', () => {
                        searchInput.value = option;
                        suggestionsContainer.style.display = 'none';
                    });
                    suggestionsContainer.appendChild(suggestion);
                });
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (event) => {
            if (event.target !== searchInput && event.target !== suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
        });
    } catch (error) {
        console.error(error);
        // Handle errors here, e.g., display an error message
    }
}

populateBillNumberForIncomeModal();


// bill search for update income modal

async function populateBillNumberForIncomeModalUpdate() {
    const searchInput = document.getElementById('searchInputForIncomeModalUpdate');
    const suggestionsContainer = document.getElementById('suggestionsForIncomeModalUpdate');
    try {
        const response = await fetch(`${BaseUrl}/get/all/billnumbers`);
        if (!response.ok) {
            throw new Error('Failed to fetch bill numbers');
        }

        const billNumberData = await response.json();
        const availableBillNumbers = billNumberData.billNumbers.map(item => item.BillNumber);

        // Handle user input
        searchInput.addEventListener('input', (event) => {
            const inputValue = event.target.value.toLowerCase();
            const filteredOptions = availableBillNumbers.filter(option => option.toLowerCase().includes(inputValue));

            // Display or hide suggestions
            if (inputValue.length > 0) {
                suggestionsContainer.innerHTML = '';
                filteredOptions.forEach(option => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = option;
                    suggestion.addEventListener('click', () => {
                        searchInput.value = option;
                        suggestionsContainer.style.display = 'none';
                    });
                    suggestionsContainer.appendChild(suggestion);
                });
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (event) => {
            if (event.target !== searchInput && event.target !== suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
        });
    } catch (error) {
        console.error(error);
    }
}
populateBillNumberForIncomeModalUpdate();


// document.addEventListener('DOMContentLoaded', populateBillNumberSummary);
async function populateBillNumber() {
  const selectElement = document.getElementById('billNumberName');
  try {
    const response = await fetch(`${BaseUrl}/get/all/billnumbers`);

    if (!response.ok) {
      throw new Error('Failed to fetch bill number');
    }
    var billNumberData = await response.json();
    
    // Iterate through the expense types and create options for the select element
      billNumberData.billNumbers.forEach((billNumber) => {
      const option = document.createElement('option');
      option.value = billNumber.BillNumber;
      option.textContent= billNumber.BillNumber;
      option.className='select-option-billNumber';
      option.id='billNumberName';
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}


async function populateBillNumberUpdate() {
  const selectElement = document.getElementById('updateBillNumberName');
  try {
    const response = await fetch(`${BaseUrl}/get/all/billnumbers`);

    if (!response.ok) {
      throw new Error('Failed to fetch bill number');
    }
    var billNumberData = await response.json();
    // Iterate through the expense types and create options for the select element
      billNumberData.billNumbers.forEach((billNumber) => {
      const option = document.createElement('option');
      option.value = billNumber.BillNumber;
      option.textContent= billNumber.BillNumber;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', populateBillNumber);
document.addEventListener('DOMContentLoaded', populateBillNumberUpdate);


// populate employees name in basic expense
async function populateEmployeesNameInBasicExpense() {
  const selectElement = document.getElementById('basicExpenseForWhomName');
  try {
    const response = await fetch(`${BaseUrl}/get-register-employee`);

    if (!response.ok) {
      throw new Error('Failed to fetch Employees');
    }
    var EmployeeData = await response.json();
    // Iterate through the expense types and create options for the select element
      EmployeeData.forEach((Employee) => {
      const option = document.createElement('option');
      option.value = Employee.name;
      option.textContent= Employee.name;
      option.className='select-option-basicExpenseForWhom';
      option.id='select-option-basicExpenseForWhom';
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}


async function filterEmployeesNameInBasicExpense() {
  const selectElement1 = document.getElementById('filterbasicExpenseForWhomName');
  try {
    const response = await fetch(`${BaseUrl}/get-register-employee`);

    if (!response.ok) {
      throw new Error('Failed to fetch Employees');
    }
    var EmployeeData = await response.json();
    // Iterate through the expense types and create options for the select element
      EmployeeData.forEach((Employee) => {
      const option = document.createElement('option');
      option.value = Employee.name;
      option.textContent= Employee.name;
      option.className='filter-option-basicExpenseForWhom';
      option.id='filter-option-basicExpenseForWhom';
      selectElement1.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}




async function populateEmployeesNameInBasicExpenseUpdate() {
  const selectElement = document.getElementById('updateBasicExpenseForWhomName');
  try {
    const response = await fetch(`${BaseUrl}/get-register-employee`);

    if (!response.ok) {
      throw new Error('Failed to fetch bill number');
    }
    var EmployeeData = await response.json();
    // Iterate through the expense types and create options for the select element
      EmployeeData.forEach((Employee) => {
      const option = document.createElement('option');
      option.value = Employee.name;
      option.textContent= Employee.name;
      option.className='select-option-basicExpenseForWhom';
      // option.id='';
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    // Handle errors here, e.g., display an error message
  }
}


document.addEventListener('DOMContentLoaded', populateEmployeesNameInBasicExpense);
document.addEventListener('DOMContentLoaded', populateEmployeesNameInBasicExpenseUpdate);
document.addEventListener('DOMContentLoaded', filterEmployeesNameInBasicExpense);



// DOWNLOAD EXPENSE REPORT
// document.addEventListener('DOMContentLoaded', function() {
//   const downloadLink = document.getElementById('download-link');
//   const modal = document.getElementById('expenseReportModal');
//   const closeModal = document.getElementById('closeExpenseReportModal')
//   downloadLink.addEventListener('click', async function(event) {
//     modal.style.display = "block";
//   });

//   closeModal.addEventListener('click', async function(event) {
//     modal.style.display = "none";
//   });

//   const applyDateRangeButton = document.getElementById("ExpenseApplyDateRange");
//   applyDateRangeButton.addEventListener("click", async () => {
//     const startDate = document.getElementById("expenseStartDate").value;
//     const endDate = document.getElementById("ExpenseEndDate").value;
//     event.preventDefault(); 
//     window.location.href=`${BaseUrl}/download/excel/${shopId}?start=${startDate}&end=${endDate}`
//   });

// });



async function filterExpenseTypes() {
  const selectElement = document.getElementById('filterExpenseTypeName');
  try {
    const response = await fetch(`${BaseUrl}/get-expense-type`);
    if (!response.ok) {
      throw new Error('Failed to fetch expense types');
    }
    var expenseTypeData = await response.json();
    // Iterate through the expense types and create options for the select element
    expenseTypeData.expenseTypes.forEach((expenseType) => {
      const option = document.createElement('option');
      option.value = expenseType.name;
      option.textContent= expenseType.name;
      option.className='filter-option-expenseType';
      option.id='filter-option-expenseType';
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}


async function populateExpenseTypes() {
  const expenseTypesContainer = document.getElementById('expenseTypesContainer');
  try {
    const response = await fetch(`${BaseUrl}/get-expense-type`);
    if (!response.ok) {
      throw new Error('Failed to fetch expense types');
    }
    var expenseTypeData = await response.json();
    // Iterate through the expense types and create options for the select element
    expenseTypeData.expenseTypes.forEach((expenseType) => {
      const expenseTypeDiv = document.createElement('div');
      expenseTypeDiv.className = 'expense-type-section';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'checkbox-expense';
      checkbox.id=`expenseName_${expenseType.name}`;
      checkbox.value=expenseType.name;
      expenseTypeDiv.appendChild(checkbox);

      const label = document.createElement('label');
      label.htmlFor = `expenseTypeCheckbox_${expenseType.name}`;
      label.className = 'lable-expense';
      label.textContent = expenseType.name;
      expenseTypeDiv.appendChild(label);

      const amountInput = document.createElement('input');
      amountInput.type = 'number';
      amountInput.className = 'expense-amount';
      amountInput.name = `expenseAmount_check`;
      amountInput.id = `expenseAmount_${expenseType.name}`;
      amountInput.placeholder = 'Enter amount'; 
      // amountInput.required = true; 
      expenseTypeDiv.appendChild(amountInput);

      expenseTypesContainer.appendChild(expenseTypeDiv);

    });
  } catch (error) {
    console.error(error);
  }
}




async function populateExpenseTypesTwo() {
  const selectElement = document.getElementById('updateExpenseName');
  try {
    const response = await fetch(`${BaseUrl}/get-expense-type`);
    if (!response.ok) {
      throw new Error('Failed to fetch expense types');
    }
    var expenseTypeData = await response.json();
    
    // Iterate through the expense types and create options for the select element
    expenseTypeData.expenseTypes.forEach((expenseType) => {
      const option = document.createElement('option');
      option.value = expenseType.name;
      option.textContent= expenseType.name;
      option.id='expenseName';
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    // Handle errors here, e.g., display an error message
  }
}

// Call the function to populate expense types when the page loads
document.addEventListener('DOMContentLoaded', populateExpenseTypes);
document.addEventListener('DOMContentLoaded', filterExpenseTypes);
document.addEventListener('DOMContentLoaded', populateExpenseTypesTwo);

// Define a variable to store the selected expense type ID
let expenseTypeId;

// Function to handle the click event on the "Delete Expense Type" button
const deleteButton = document.getElementById('deleteExpenseType');
deleteButton.addEventListener('click', () => {
  // Check if an expense type is selected
  if (expenseTypeId) {
    const apiUrl = `${BaseUrl}/delete-expense-type/${expenseTypeId}`;
    
    const xhr = new XMLHttpRequest();
    
    xhr.open('DELETE', apiUrl, true);
    
    xhr.onload = function () {
      if (xhr.status === 200) {
        swal({
            text:"Expense type deleted successfully!",
            icon: "success",
            button: "OK",
        }).then(() => {
            location.reload()
        });
      } else {
        console.error('Failed to delete expense type');
          swal({
            text:"Failed to delete expense type!",
            icon: "warning",
            button: "OK",
          })
      }
    };
    xhr.send();
  } else {
    // Handle the case where no expense type is selected, e.g., display an error message
    console.error('No expense type selected');
  }
});

// // Function to update the selected expense type ID when the dropdown value changes
const selectElement = document.getElementById('updateExpenseName');
selectElement.addEventListener('change', () => {
  expenseTypeId = selectElement.value;
  console.log(expenseTypeId)
});

// const selectElement2 = document.getElementById('ExpenseName');
// selectElement2.addEventListener('change', () => {
//   expenseTypeId = selectElement2.value;
//   console.log(expenseTypeId)
// });


const addExpenseType = async(name)=>{
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/push-expense-type`,
      data:{
        name:name,
      }
    });
    if (res.data.status==='success') {
        swal({
            text:"expense type added successfully",
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


document.querySelector('.expenseTypeForm').addEventListener('submit',e=>{
    e.preventDefault();
    const name = document.getElementById('expenseTypeName').value;
    addExpenseType(name);
})



// vendor expense
const vendorSelect = document.getElementById('vendorSelect');
let selectedVendorId;
fetch(`${BaseUrl}/get-register-vendors`)
    .then(response => response.json())
    .then(apiResponse => {
        // Loop through the API response and add options to the select dropdown
        apiResponse.forEach(vendor => {
            const option = document.createElement('option');
            option.value = vendor.id; // You can set the value to the vendor ID if needed
            option.text = vendor.vendorName;
            vendorSelect.appendChild(option);
        });
    })
.catch(error => console.error('Error fetching data:', error));


// Update the selectedVendorId when the dropdown value changes
vendorSelect.addEventListener('change', () => {
    selectedVendorId = vendorSelect.value;
});

const createVendorExpense = async(productName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus,vendorId,billNumber) => {
  try {
    const data = {
      productName: productName,
      date: vendorExpenseDate,
      description: description,
      amount: vendorExpenseAmount,
      paymentStatus: vendorPaymentStatus,
      quantity: VendorQuantity,
      billNumber
    };

    if (paymentDueDate.trim() !== '') {
      data.paymentDueDate = paymentDueDate;
    }

    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/shops/vendor-expenses/${vendorId}`,
      data: data
    });

    if (res.data.status === 'success') {
        swal({
            text:"Vendor expense Added successfully!",
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


document.querySelector('.vendor-expense-form').addEventListener('submit',e=>{
    e.preventDefault();
    const productName = document.getElementById('productName').value;
    const description = document.getElementById('vendorDescription').value;
    const vendorExpenseDate = document.getElementById('vendorExpenseDate').value;
    const VendorQuantity = document.getElementById('vendorQuantity').value;
    const vendorExpenseAmount = document.getElementById('vendorExpenseAmount').value;
    const vendorPaymentStatus =  document.getElementById('vendorPaymentStatus').value;
    const paymentDueDate =  document.getElementById('vendorPaymentDueDate').value;
    const billNumber =  document.getElementById('billNumberVendor').value;
    const vendorId = selectedVendorId;
    createVendorExpense(productName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus,vendorId,billNumber);
})


