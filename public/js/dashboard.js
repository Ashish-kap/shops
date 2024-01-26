// JS file
// const BaseUrl = `http://localhost:3000`
// const BaseUrl = `https://sugarcan-shop.onrender.com`

const BaseUrl = window.config.BaseUrl;


const dropdown = document.getElementById("timeRange");

const totalDailyProfit = document.getElementById("totalDailyProfit");
const totalDailyIncome = document.getElementById("totalDailyIncome");
const totalDailyExpense = document.getElementById("totalDailyExpense");

// Function to fetch data from the API based on selected value
async function fetchData(selectedValue) {
  try {
    const response = await fetch(`${BaseUrl}/${selectedValue}-profit`);
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
    totalDailyProfit.textContent = data.totalProfit;
    totalDailyIncome.textContent = data.totalIncome;
    totalDailyExpense.textContent = data.totalExpense;
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

    const apiUrl = `${BaseUrl}/select-period?start=${startDate}&end=${endDate}`;
    
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


async function populateShopNameForEmployeeModal() {
  const selectElement = document.getElementById('shopNameIncomeModal');
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
      option.id='shopNameIncomeModal';
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    // Handle errors here, e.g., display an error message
  }
}

document.addEventListener('DOMContentLoaded', populateShopNameForEmployeeModal);


// Get the modal and the button that opens it
const modal = document.getElementById("addShopModal");
const btn = document.getElementById("addShopBtn");
const closeBtn = document.getElementById("closeModal");

// When the user clicks the button, open the modal
btn.addEventListener("click", function () {
    modal.style.display = "block";
});

// When the user clicks on the close button, close the modal
closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

// When the user clicks outside the modal, close it
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


const createShop = async (shopName,contactInformation,address) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/create-shop`,
      data:{
        name:shopName,
        contactInformation,
        address 
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"Shop created successfully!",
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


document.querySelector('.create-shop').addEventListener('submit',e=>{
    e.preventDefault();
    const shopName = document.getElementById('shopName').value;
    const contactInformation = document.getElementById('contactInformation').value;
    const address = document.getElementById('address').value;
    createShop(shopName,contactInformation,address);
})


//--------- rendering shops dynamically -------------------

// Function to fetch data from the API
async function fetchShops() {
    try {
        const response = await fetch(`${BaseUrl}/all-shops`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const shops = await response.json();
        return shops;
    } catch (error) {
        console.error('Error fetching shops:', error);
        return [];
    }
}

// Function to populate the shop cards
async function populateShopCards() {
    const shopRow = document.getElementById('shopRow');
    const shops = await fetchShops();

    // Clear any existing shop cards
    shopRow.innerHTML = '';

    // Populate shop cards with data from the API response
    shops.forEach(shop => {
        const shopCard = document.createElement('div');
        shopCard.className = 'shop-card';

        const shopImage = document.createElement('img');
        shopImage.className = 'shop-image';
        shopImage.src = '/images/shops.jpg';
        shopImage.alt = 'Shop Image';
        shopCard.appendChild(shopImage);

        const shopName = document.createElement('h2');
        shopName.textContent = shop.name;
        shopCard.appendChild(shopName);

        const contactInfo = document.createElement('p');
        contactInfo.textContent = `Contact Information: ${shop.contactInformation}`;
        shopCard.appendChild(contactInfo);

        const address = document.createElement('p');
        address.textContent = `Address: ${shop.address}`;
        shopCard.appendChild(address);

        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.style.marginLeft = '10px'; 
        viewButton.addEventListener('click', () => {
            window.location.href = `/shop-overview/${shop.id}`;
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteShop(shop.id)
        });

        shopCard.appendChild(deleteButton);
        shopCard.appendChild(viewButton);
        shopRow.appendChild(shopCard);
    });
}

// Call the function to populate shop cards when the page loads
populateShopCards();




const deleteShop = async (shopId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `${BaseUrl}/delete-shop/${shopId}`,
      data:{
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"Shop deleted successfully!",
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

// register vendor

//  ----------- register employee modal --------
document.addEventListener('DOMContentLoaded', function() {
  const registerVendorButton = document.getElementById("registerVendorButton");
  const vendorModal = document.getElementById("vendorModal");
  const closeModal = document.getElementById("closeModal");
  const closeModalVendor = document.getElementById("closeModalVendor");

  //  View vendor and employee button
  const viewVendorButton = document.getElementById("viewVendorButton");


  registerVendorButton.addEventListener("click", function() {
    vendorModal.style.display = "flex";
  });

  closeModalVendor.addEventListener("click", function() {
    vendorModal.style.display = "none";
  });

  viewVendorButton.addEventListener('click', () => {
        window.location.href =  `/all-vendors`;
  });

});



// register vendor
const registerVendor = async (VendorName,VendorAddress,ContactInformation) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/register-vendors`,
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



  // ----------- register employee modal --------
document.addEventListener('DOMContentLoaded', function() {
  const registerEmployeeButton = document.getElementById("registerEmployeeButton");
  const employeeModal = document.getElementById("employeeModal");
  const closeModal = document.getElementById("employeeCloseModal");

  //  View vendor and employee button
  const viewEmployeeButton = document.getElementById("viewEmployeeButton");

  registerEmployeeButton.addEventListener("click", function() {
    employeeModal.style.display = "flex";
  });


  closeModal.addEventListener("click", function() {
    employeeModal.style.display = "none";
  });

  viewEmployeeButton.addEventListener('click', () => {
      window.location.href = `/all-employees`;
   });

});


// register employeee
const registerEmployee = async (employeeName,employeeAddress,phoneNumber,employeeSalary,shopName,employeeJoinDate) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/register-employee`,
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
    const shopName = document.getElementById('shopNameIncomeModal').value;
    const employeeSalary = document.getElementById('employeeSalary').value;
    const employeeJoinDate = document.getElementById('employeeJoinDate').value;

    registerEmployee(employeeName,employeeAddress,phoneNumber,employeeSalary,shopName,employeeJoinDate);
})



// ---------------- download report - modal --------------------

var customModal = document.getElementById("customModal");

var customButton = document.getElementById("downloadReport");

var closeModalSpan = document.getElementsByClassName("closeModal")[0];

customButton.onclick = function() {
  customModal.style.display = "block";
};

closeModalSpan.onclick = function() {
  closeCustomModal();
};

window.onclick = function(event) {
  if (event.target === customModal) {
    closeCustomModal();
  }
};

// Function to close the modal
function closeCustomModal() {
  customModal.style.display = "none";
}


// shop selection
async function populateShopNameForEmployeeModalCustom() {
  const selectElement = document.getElementById('customShopName');
  try {
    const response = await fetch(`${BaseUrl}/all-shops`);

    if (!response.ok) {
      throw new Error('Failed to fetch shops');
    }
    var shopData = await response.json();
      shopData.forEach((shop) => {
      const option = document.createElement('option');
      option.value = shop.id;
      option.textContent= shop.name;
      option.className='customSelectShopName';
      option.id='customShopName';
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    // Handle errors here, e.g., display an error message
  }
}

document.addEventListener('DOMContentLoaded', populateShopNameForEmployeeModalCustom);



const vendorSelect = document.getElementById('customVendorSelect');
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



async function populateEmployeesNameInBasicExpenseUpdate() {
  const selectElement = document.getElementById('customBasicExpenseForWhom');
  try {
    const response = await fetch(`${BaseUrl}/get-register-employee`);

    if (!response.ok) {
      throw new Error('Failed to fetch bill number');
    }
    var EmployeeData = await response.json();
      EmployeeData.forEach((Employee) => {
      const option = document.createElement('option');
      option.value = Employee.id;
      option.textt= Employee.name;
      option.className='select-option-basicExpenseForWhom';
      // option.id='';
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', populateEmployeesNameInBasicExpenseUpdate);


const applyDateRangeButton = document.getElementById("downloadPdf");
applyDateRangeButton.addEventListener("click", async () => {
    const shopId = document.getElementById("customShopName").value;
    const employeeId = document.getElementById("customBasicExpenseForWhom").value;
    const venderId = document.getElementById("customVendorSelect").value;
    const startDate = document.getElementById("customStartDate").value;
    const endDate = document.getElementById("customEndDate").value;
    const expenseType =document.getElementById("customExpenseType").value; 

    event.preventDefault(); 
    window.location.href=`${BaseUrl}/download/excel?type=${expenseType}&shopId=${shopId}&vendorId=${venderId}&employeeId=${employeeId}&start=${startDate}&end=${endDate}`
});