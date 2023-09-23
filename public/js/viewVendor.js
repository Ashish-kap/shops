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
    const response = await fetch(`${BaseUrl}/shop/${shopId}/get-all-vendor-expenses/${vendorId}`);
    const data = await response.json();
    return data.vendor;
}


async function fetchVendorExpenses() {
    const response = await fetch(`${BaseUrl}/shop/${shopId}/get-all-vendor-expenses/${vendorId}`);
    const data = await response.json();
    return data.allExpenses;
}

async function populateVendorExpenseTable() {

            const vendorExpenses = await fetchVendorExpenses();
            const vendorExpenseTableBody = document.getElementById("vendorExpenseTableBody");
            const vendorDetails = await fetchvendorDetails();
           
            // Populate employee details
            const nameElement = document.getElementById('vendorName');
            const addressElement = document.getElementById('vendorAddress');
            const contactInfo = document.getElementById('vendorContactInformation');

            nameElement.innerHTML = `<p style="color:black"><strong>Name:</strong> ${vendorDetails.vendorName}</p>`;
            addressElement.innerHTML = `<p style="color:black"><strong>Address:</strong> ${vendorDetails.address}</p>`;
            contactInfo.innerHTML=  `<p style="color:black"><strong>Contact Information:</strong>  ${vendorDetails.contactInformation}</p>`;;

            vendorExpenses.forEach(item => {
                const row = document.createElement("tr");

                const productNameCell = document.createElement("td");
                productNameCell.textContent = item.productName;
                row.appendChild(productNameCell);

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
                editButton.addEventListener("click", () => openEditVendorExpenseModal(item));
                actionButtons.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", () => deleteVendorExpense(item._id));
                actionButtons.appendChild(deleteButton);

                actionCell.appendChild(actionButtons);
                row.appendChild(actionCell);

                vendorExpenseTableBody.appendChild(row);
    });
}


let vendorExpenseData = null
function openEditVendorExpenseModal(expense) {
    vendorExpenseData=expense
    const modal = document.getElementById("UpdateVendorExpenseModal");
    const productNameInput = document.getElementById("updateProductName");
    const quantityInput = document.getElementById("updateVendorQuantity");
    const amountInput = document.getElementById("updateVendorExpenseAmount");
    const expenseDateInput = document.getElementById("updateVendorExpenseDate");
    const paymentStatusInput = document.getElementById("updateVendorPaymentStatus");
    const paymentDueDateInput = document.getElementById("updateVendorPaymentDueDate");
    const descriptionInput = document.getElementById("updateVendorDescription");

    const closeVendorExpenseModalButton = document.getElementById("closeUpdateVendorExpenseModalButton");

    productNameInput.value = expense.productName;
    quantityInput.value = expense.quantity;
    amountInput.value = expense.amount;
    expenseDateInput.value = expense.date.substring(0, 10);
    paymentStatusInput.value = expense.paymentStatus;
    if(expense.paymentDueDate){
       paymentDueDateInput.value=expense.paymentDueDate.substring(0, 10);
    }
    descriptionInput.value = expense.description;
    modal.style.display = "block";

    closeVendorExpenseModalButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
}

populateVendorExpenseTable();

const updateVendorExpense = async (productName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus,docId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${BaseUrl}/vendor-expenses/${docId}`,
      data:{
        productName:productName,
        vendorName:vendorName,
        date:vendorExpenseDate,
        description:description,
        amount:vendorExpenseAmount,
        paymentStatus:vendorPaymentStatus,
        paymentDueDate:paymentDueDate,
        quantity:VendorQuantity
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
    const docId = vendorExpenseData._id
    const productName = document.getElementById('updateProductName').value;
    const description = document.getElementById('updateVendorDescription').value;
    const vendorExpenseDate = document.getElementById('updateVendorExpenseDate').value;
    const VendorQuantity = document.getElementById('updateVendorQuantity').value;
    const vendorExpenseAmount = document.getElementById('updateVendorExpenseAmount').value;
    const vendorPaymentStatus =  document.getElementById('updateVendorPaymentStatus').value;
    const paymentDueDate =  document.getElementById('updateVendorPaymentDueDate').value;
    updateVendorExpense(productName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus,docId);
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