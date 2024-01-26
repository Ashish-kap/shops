// const BaseUrl = `https://sugarcan-shop.onrender.com`
//const BaseUrl = `http://localhost:3000`


const BaseUrl = window.config.BaseUrl;

const currentUrl = window.location.href;

// Use regular expressions to extract shopId and employeeId
const shopIdMatch = currentUrl.match(/\/shop\/([a-zA-Z0-9]+)/);
const vendorIdMatch = currentUrl.match(/\/vendor-details\/([a-zA-Z0-9]+)/);

const shopId = shopIdMatch[1]; 
const vendorId = vendorIdMatch[1];


async function fetchvendorDetails() {
    const response = await fetch(`${BaseUrl}/shop/get-all-vendor-expenses/${vendorId}`);
    const data = await response.json();
    return data.vendor;
}


async function populateVendorExpenseTable() {
            const vendorExpenseTableBody = document.getElementById("vendorExpenseTableBody");
            const defaultStartDate = new Date().toISOString().split('T')[0];
            const response = await fetch(`${BaseUrl}/shop/get-all-vendor-expenses/${vendorId}?start=${defaultStartDate}&end=${defaultStartDate}`);
            const data = await response.json();
            const vendorExpenses = data.allExpenses;
            
            const vendorDetails = await fetchvendorDetails();
           
            // Populate employee details
            const nameElement = document.getElementById('vendorName');
            const addressElement = document.getElementById('vendorAddress');
            const contactInfo = document.getElementById('vendorContactInformation');

            nameElement.innerHTML = `<p><strong>Name:</strong>${vendorDetails.vendorName}</p>`;
            addressElement.innerHTML = `<p><strong>Address:</strong> ${vendorDetails.address}</p>`;
            contactInfo.innerHTML=  `<p><strong>Contact Information:</strong>  ${vendorDetails.contactInformation}</p>`;;


            vendorExpenses.forEach(item => {
                const row = document.createElement("tr");

                const productNameCell = document.createElement("td");
                productNameCell.textContent = item.productName;
                row.appendChild(productNameCell);

                const billNumberCell = document.createElement("td");
                billNumberCell.textContent = item.billNumber;
                row.appendChild(billNumberCell);

                const descriptionCell = document.createElement("td");
                descriptionCell.textContent = item.description;
                row.appendChild(descriptionCell);

                const quantityCell = document.createElement("td");
                quantityCell.textContent = item.quantity;
                row.appendChild(quantityCell);

                const amountCell = document.createElement("td");
                amountCell.textContent = item.amount;
                row.appendChild(amountCell);

                const paymentDueDateCell = document.createElement("td");
                paymentDueDateCell.textContent = item.paymentDueDate;
                if(item.paymentDueDate){
                    paymentDueDateCell.textContent = new Date(item.paymentDueDate).toLocaleDateString('en-GB');
                }
                row.appendChild(paymentDueDateCell);
                const paymentStatusCell = document.createElement("td");
                paymentStatusCell.textContent = item.paymentStatus;
                row.appendChild(paymentStatusCell);

                const dateCell = document.createElement("td");
                dateCell.textContent = new Date(item.date).toLocaleDateString('en-GB');
                row.appendChild(dateCell);

                const actionCell = document.createElement("td");
                const actionButtons = document.createElement("div");
                actionButtons.classList.add("action-buttons");

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.classList.add("edit-button");
                editButton.addEventListener("click", () => openEditVendorExpenseModal(item));
                actionButtons.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-button");
                deleteButton.addEventListener("click", () => deleteVendorExpense(item.id));
                actionButtons.appendChild(deleteButton);

                actionCell.appendChild(actionButtons);
                row.appendChild(actionCell);

                vendorExpenseTableBody.appendChild(row);
    });
}

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
    console.error(error);
    // Handle errors here, e.g., display an error message
  }
}
document.addEventListener('DOMContentLoaded', populateBillNumber);

async function filterPopulateVendorTable() {
const filterButtonVendor = document.getElementById("filterVendorSource");
filterButtonVendor.addEventListener("click", async() => {
            const startDate = document.getElementById("filterStartDateVendor");
            const endDate = document.getElementById("filterEndDateVendor");
            const paymentStatus=document.getElementById("paymentStatusName");
            const billNumber = document.getElementById("billNumberName");

            const vendorExpenseTableBody = document.getElementById("vendorExpenseTableBody")
            vendorExpenseTableBody.innerHTML = '';


            const response = await fetch(`${BaseUrl}/shop/get-all-vendor-expenses/${vendorId}?start=${startDate.value}&end=${endDate.value}&billNumber=${billNumber.value}&paymentStatus=${paymentStatus.value}`);
            const data = await response.json();
            const vendorExpenses = data.allExpenses;

            const vendorDetails = await fetchvendorDetails();
           

            // Populate employee details
            const nameElement = document.getElementById('vendorName');
            const addressElement = document.getElementById('vendorAddress');
            const contactInfo = document.getElementById('vendorContactInformation');

            nameElement.innerHTML = `<p style="color:black"><strong>Name:</strong> ${vendorDetails.vendorName}</p>`;
            addressElement.innerHTML = `<p style="color:black"><strong>Address:</strong> ${vendorDetails.address}</p>`;
            contactInfo.innerHTML=  `<p style="color:black"><strong>Contact Information:</strong>  ${vendorDetails.contactInformation}</p>`;

            vendorExpenses.forEach(item => {
                const row = document.createElement("tr");

                const productNameCell = document.createElement("td");
                productNameCell.textContent = item.productName;
                row.appendChild(productNameCell);

                const billNumberCell = document.createElement("td");
                billNumberCell.textContent = item.billNumber;
                row.appendChild(billNumberCell);

                const descriptionCell = document.createElement("td");
                descriptionCell.textContent = item.description;
                row.appendChild(descriptionCell);

                const quantityCell = document.createElement("td");
                quantityCell.textContent = item.quantity;
                row.appendChild(quantityCell);

                const amountCell = document.createElement("td");
                amountCell.textContent = item.amount;
                row.appendChild(amountCell);

                const paymentDueDateCell = document.createElement("td");
                paymentDueDateCell.textContent = item.paymentDueDate;
                if(item.paymentDueDate){
                    paymentDueDateCell.textContent = new Date(item.paymentDueDate).toLocaleDateString('en-GB');
                }
                row.appendChild(paymentDueDateCell);
                const paymentStatusCell = document.createElement("td");
                paymentStatusCell.textContent = item.paymentStatus;
                row.appendChild(paymentStatusCell);

                const dateCell = document.createElement("td");
                dateCell.textContent = new Date(item.date).toLocaleDateString('en-GB');
                row.appendChild(dateCell);

                const actionCell = document.createElement("td");
                const actionButtons = document.createElement("div");
                actionButtons.classList.add("action-buttons");

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.classList.add("edit-button");
                editButton.addEventListener("click", () => openEditVendorExpenseModal(item));
                actionButtons.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-button");
                deleteButton.addEventListener("click", () => deleteVendorExpense(item.id));
                actionButtons.appendChild(deleteButton);

                actionCell.appendChild(actionButtons);
                row.appendChild(actionCell);

                vendorExpenseTableBody.appendChild(row);

    })
})
}


const clearButtonIncomeTable = document.getElementById("clearVendorExpense");
clearButtonIncomeTable.addEventListener("click", () => {
window.location.reload();
});

document.addEventListener('DOMContentLoaded', filterPopulateVendorTable);

let vendorExpenseData = null
function openEditVendorExpenseModal(expense) {
    vendorExpenseData=expense
    const modal = document.getElementById("UpdateVendorExpenseModal");
    const productNameInput = document.getElementById("updateProductName");
    const BillNumberInput = document.getElementById("updateBillNumber");
    const quantityInput = document.getElementById("updateVendorQuantity");
    const amountInput = document.getElementById("updateVendorExpenseAmount");
    const expenseDateInput = document.getElementById("updateVendorExpenseDate");
    const paymentStatusInput = document.getElementById("updateVendorPaymentStatus");
    const paymentDueDateInput = document.getElementById("updateVendorPaymentDueDate");
    const descriptionInput = document.getElementById("updateVendorDescription");

    const closeVendorExpenseModalButton = document.getElementById("closeUpdateVendorExpenseModalButton");

    productNameInput.value = expense.productName;
    BillNumberInput.value = expense.billNumber
    quantityInput.value = expense.quantity;
    amountInput.value = expense.amount;

    const date = new Date(expense.date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    expenseDateInput.value = formattedDate;
    paymentStatusInput.value = expense.paymentStatus;
    if(expense.paymentDueDate){
      const date = new Date(expense.paymentDueDate);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it's 0-indexed
      const year = date.getFullYear();
      const formattedDate1 = `${year}-${month}-${day}`;
       paymentDueDateInput.value=formattedDate1;
    }
    descriptionInput.value = expense.description;
    modal.style.display = "block";

    closeVendorExpenseModalButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
}

populateVendorExpenseTable();

const updateVendorExpense = async (productName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus,docId,billNumber) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${BaseUrl}/vendor-expenses/${docId}`,
      data:{
        productName:productName,
        // vendorName:vendorName,
        date:vendorExpenseDate,
        description:description,
        amount:vendorExpenseAmount,
        paymentStatus:vendorPaymentStatus,
        paymentDueDate:paymentDueDate,
        quantity:VendorQuantity,
        billNumber
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


document.querySelector('.udpate-vendor-expense-form').addEventListener('submit',e=>{
    e.preventDefault();
    const docId = vendorExpenseData.id
    const productName = document.getElementById('updateProductName').value;
    const description = document.getElementById('updateVendorDescription').value;
    const vendorExpenseDate = document.getElementById('updateVendorExpenseDate').value;
    const VendorQuantity = document.getElementById('updateVendorQuantity').value;
    const vendorExpenseAmount = document.getElementById('updateVendorExpenseAmount').value;
    const vendorPaymentStatus =  document.getElementById('updateVendorPaymentStatus').value;
    const paymentDueDate =  document.getElementById('updateVendorPaymentDueDate').value;
    const billNumber =  document.getElementById('updateBillNumber').value;
    updateVendorExpense(productName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus,docId,billNumber);
})


const deleteVendorExpense = async (docId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `${BaseUrl}/delete-vendor-expenses/${docId}`,
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
    swal({
      text:err.response.data.message,
      icon: "warning",
      button: "OK",
    })
  }
};