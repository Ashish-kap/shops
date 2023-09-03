
const currentUrl = window.location.href;
const urlSegments = currentUrl.split("/");
const shopIndex = urlSegments.indexOf("all-vendors");
const shopId = urlSegments[shopIndex + 1];
var selectedEmployeeId;


document.addEventListener("DOMContentLoaded", function() {
  // Fetch employee data from the API
  const apiUrl = `http://localhost:3000/get-register-vendors/${shopId}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const vendorContainer = document.querySelector('.vendor-container');

      data.forEach(vendor => {
        const card = createvendorCard(vendor);
        vendorContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error fetching vendor data:', error);
    });


   // var selectedvendorId;
  // Helper function to create an vendor card
  function createvendorCard(vendor) {
    const card = document.createElement('div');
    card.className = 'vendor-card';
    card.innerHTML = `
      <img src="/images/vendor_photo.jpg" alt="vendor Photo" class="vendor-photo">
      <h2>${vendor.vendorName}</h2>
      <p><strong>Address:</strong> ${vendor.address}</p>
      <p><strong>Contact Information:</strong> ${vendor.contactInformation}</p>
      <button class="view-btn">View Details</button>
      <button class="pay-btn" id="paySalary">Pay Vendor</button>
    `;

    const viewDetailsButton = card.querySelector('.view-btn');

    // Add a click event listener to the button
    viewDetailsButton.addEventListener('click', () => {
        // Redirect to another site
        window.location.href = `http://localhost:3000/shop/${shopId}/vendor-details/${vendor._id}`; // Replace with your desired URL
    });

    // Add event listener to "Pay Salary" button on this vendor card
    const payButton = card.querySelector('.pay-btn');
    const vendorExpenseModal = document.getElementById('vendorExpenseModal');
    const closevendorExpenseModalButton = document.getElementById('closeVendorExpenseModalButton');

    payButton.addEventListener('click', function() {
      vendorExpenseModal.style.display = 'block';
      
      selectedvendorId = vendor._id; 
      console.log("Selected vendor ID:", selectedvendorId);
    });

    closevendorExpenseModalButton.addEventListener('click', function() {
      vendorExpenseModal.style.display = 'none';
    });

    return card;
}
});



const createVendorExpense = async (productName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus,vendorId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://localhost:3000/shops/${shopId}/vendor-expenses/${vendorId}`,
      data:{
        productName:productName,
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
    const vendorId = selectedvendorId;
    createVendorExpense(productName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus,vendorId);
})