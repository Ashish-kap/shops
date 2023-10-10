// const BaseUrl = `https://sugarcan-shop.onrender.com`
// const BaseUrl = `http://localhost:3000`

const BaseUrl = window.config.BaseUrl;

const currentUrll = window.location.href;
const urlSegmentss = currentUrll.split("/");
const shopIndexx = urlSegmentss.indexOf("shop-overview");
const shopIdd = urlSegmentss[shopIndexx + 1];


const createIncome = async (amount,date,description,incomeSource,ProductSoldQuantity,billNumber) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/create-income/${shopIdd}`,
      data:{
        amount,
        date,
        description,
        incomeSource,
        ProductSoldQuantity,
        billNumber
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"Income Added successfully!",
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


document.querySelector('.incomeForm').addEventListener('submit',e=>{
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const incomeSource = document.getElementById('incomeSourceName').value;
    const ProductSoldQuantity = document.getElementById('ProductSoldQuantity').value;
    const billNumber = document.getElementById('billNumberName').value;
    createIncome(amount,date,description,incomeSource,ProductSoldQuantity,billNumber);
})


// Update Income

const updateIncome = async (amount,date,description,docId,incomeSource,ProductSoldQuantity,billNumber) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${BaseUrl}/update-income/${docId}`,
      data:{
        amount,
        date,
        incomeSource,
        description,
        ProductSoldQuantity,
        billNumber
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"Updated successfully!",
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


document.querySelector('.update-incomeForm').addEventListener('submit',e=>{
    e.preventDefault();
    const docId = updateIncomeData._id
    const amount = document.getElementById('updateAmount').value;
    const date = document.getElementById('updateDate').value;
    const description = document.getElementById('updateDescription').value;
    const incomeSource = document.getElementById('updateIncomeSourceName').value;
    const ProductSoldQuantity = document.getElementById('updateProductSoldQuantity').value;
    const billNumber = document.getElementById('updateBillNumberName').value;
    updateIncome(amount,date,description,docId,incomeSource,ProductSoldQuantity,billNumber);
})


// Delete Income
const deleteIncome = async (docId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `${BaseUrl}/delete-income/${docId}`,
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


// create basic expense
// const createBasicExpense = async (expenseName,expenseAmount,date,description,forWhichEmployee) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: `${BaseUrl}/create-basic-expenses/${shopIdd}`,
//       data:{
//         expenseName,
//         amount:expenseAmount,
//         date,
//         description,
//         forWhichEmployee
//       }
//     });
//     if (res.data.status === 'success') {
//         swal({
//             text:"Baisc Expense Added successfully!",
//             icon: "success",
//             button: "OK",
//         }).then(() => {
//             location.reload()
//         });
//     }
//   } catch (err) {
//     swal({
//       text:err.response.data.message,
//       icon: "warning",
//       button: "OK",
//     })
//   }
// };


// document.querySelector('.basic-expense-form').addEventListener('submit',e=>{
//     e.preventDefault();
//     const expenseName = document.getElementById('expenseName').value;
//     const expenseAmount = document.getElementById('expenseAmount').value;
//     const description = document.getElementById('expenseDescription').value;
//     const date = document.getElementById('expenseDate').value;
//     const forWhichEmployee = document.getElementById('basicExpenseForWhomName').value;
//     createBasicExpense(expenseName,expenseAmount,date,description,forWhichEmployee);
// })



async function createBasicExpense(amountsAndNames, date, description, forWhichEmployee) {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/create-basic-expenses/${shopIdd}`,
      data: {
        amountsAndNames,
        date,
        description,
        forWhichEmployee
      }
    });
    if (res.data.status === 'success') {
      swal({
        text: "Basic Expense Added successfully!",
        icon: "success",
        button: "OK",
      }).then(() => {
        location.reload();
      });
    }
  } catch (err) {
    swal({
      text: err.response.data.message,
      icon: "warning",
      button: "OK",
    });
  }
}


document.querySelector('.basic-expense-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const checkedExpenses = [];

  console.log(checkedExpenses)

  // Get all checkboxes and amount inputs
  const checkboxes = document.querySelectorAll('.checkbox-expense');
  const amountInputs = document.querySelectorAll('.expense-amount');

  // Iterate through checkboxes and collect checked ones with their respective amounts
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const expenseName = checkbox.value;
      const amount = parseFloat(amountInputs[index].value); // Parse as float to ensure it's a number
      if (!isNaN(amount)) {
        checkedExpenses.push({ amount, expenseName });
      }
    }
  });

  const description = document.getElementById('expenseDescription').value;
  const date = document.getElementById('expenseDate').value;
  const forWhichEmployee = document.getElementById('basicExpenseForWhomName').value;

  try {
    // Pass the checkedExpenses array to the createBasicExpense function
    await createBasicExpense(checkedExpenses, date, description, forWhichEmployee);

    // Reset form fields or perform other actions as needed
    document.querySelector('.basic-expense-form').reset();
  } catch (err) {
    swal({
      text: err.response.data.message,
      icon: "warning",
      button: "OK",
    });
  }
});


//  Update basic expense
const updateBasicExpense = async (expenseName,expenseAmount,date,description,docId,forWhichEmployee) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${BaseUrl}/update-basic-expenses/${docId}`,
      data:{
        expenseName,
        amount:expenseAmount,
        date,
        description,
        forWhichEmployee
      }
    });
    if (res.data.status === 'success') {
        swal({
            text:"Updated successfully!",
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


document.querySelector('.update-basic-expense-form').addEventListener('submit',e=>{
    e.preventDefault();
    const expenseName = document.getElementById('updateExpenseName').value;
    const expenseAmount = document.getElementById('updateExpenseAmount').value;
    const description = document.getElementById('updateExpenseDescription').value;
    const date = document.getElementById('updateExpenseDate').value;
    const forWhichEmployee = document.getElementById('updateBasicExpenseForWhomName').value;
    const docId = expenseData._id;
    updateBasicExpense(expenseName,expenseAmount,date,description,docId,forWhichEmployee);
})


// Delete basic Expense
const deleteBasicExpense = async (docId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `${BaseUrl}/delete-basic-expenses/${docId}`,
      data:{
        amount,
        date,
        description 
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



// Update employer expense...

// const updateEmployerExpense = async (employeeName,salaryAmount,date,description,paymentMethod,docId) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: `http://localhost:3000/update-employee-salaries/${docId}`,
//       data:{
//         employeeName,
//         salaryAmount,
//         date,
//         paymentMethod,
//         description
//       }
//     });
//     if (res.data.status === 'success') {
//         swal({
//             text:"updated successfully!",
//             icon: "success",
//             button: "OK",
//         }).then(() => {
//             location.reload()
//         });
//     }
//   } catch (err) {
//     swal({
//       text:err.response.data.message,
//       icon: "warning",
//       button: "OK",
//     })
//   }
// };


// document.querySelector('.update-employee-expense-form').addEventListener('submit',e=>{
//     e.preventDefault();
//     const docId = employeeExpenseData._id
//     const employeeName = document.getElementById('updateEmployeeName').value;
//     const salaryAmount = document.getElementById('updateSalaryAmount').value;
//     const description = document.getElementById('updateEmployeeExpenseDescription').value;
//     const date = document.getElementById('updateEmployeeExpenseDate').value;
//     const paymentMethod = document.getElementById('updatePaymentMethod').value;
//     updateEmployerExpense(employeeName,salaryAmount,date,description,paymentMethod,docId);
// })



// // Delete Income
// const deleteEmployerExpense = async (docId) => {
//   try {
//     const res = await axios({
//       method: 'DELETE',
//       url: `http://localhost:3000/delete-employee-salaries/${docId}`,
//       data:{
       
//       }
//     });
//     if (res.data.status === 'success') {
//         swal({
//             text:"Deleted successfully!",
//             icon: "success",
//             button: "OK",
//         }).then(() => {
//             location.reload()
//         });
//     }
//   } catch (err) {
//     swal({
//       text:err.response.data.message,
//       icon: "warning",
//       button: "OK",
//     })
//   }
// };



// // Vendor Expense
// const createVendorExpense = async (productName,vendorName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: `http://localhost:3000/shops/${shopIdd}/vendor-expenses`,
//       data:{
//         productName:productName,
//         vendorName:vendorName,
//         date:vendorExpenseDate,
//         description:description,
//         amount:vendorExpenseAmount,
//         paymentStatus:vendorPaymentStatus,
//         paymentDueDate:paymentDueDate,
//         quantity:VendorQuantity
//       }
//     });
//     if (res.data.status === 'success') {
//         swal({
//             text:"Vendor expense Added successfully!",
//             icon: "success",
//             button: "OK",
//         }).then(() => {
//             location.reload()
//         });
//     }
//   } catch (err) {
//     swal({
//       text:err.response.data.message,
//       icon: "warning",
//       button: "OK",
//     })
//   }
// };


// document.querySelector('.vendor-expense-form').addEventListener('submit',e=>{
//     e.preventDefault();
//     const productName = document.getElementById('productName').value;
//     const vendorName = document.getElementById('vendorName').value;
//     const description = document.getElementById('vendorDescription').value;
//     const vendorExpenseDate = document.getElementById('vendorExpenseDate').value;
//     const VendorQuantity = document.getElementById('vendorQuantity').value;
//     const vendorExpenseAmount = document.getElementById('vendorExpenseAmount').value;
//     const vendorPaymentStatus =  document.getElementById('vendorPaymentStatus').value;
//     const paymentDueDate =  document.getElementById('vendorPaymentDueDate').value;
//     createVendorExpense(productName,vendorName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus);
// })



// // Update vendor expense
// const updateVendorExpense = async (productName,vendorName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus,docId) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: `http://localhost:3000/vendor-expenses/${docId}`,
//       data:{
//         productName:productName,
//         vendorName:vendorName,
//         date:vendorExpenseDate,
//         description:description,
//         amount:vendorExpenseAmount,
//         paymentStatus:vendorPaymentStatus,
//         paymentDueDate:paymentDueDate,
//         quantity:VendorQuantity
//       }
//     });
//     if (res.data.status === 'success') {
//         swal({
//             text:"updated successfully!",
//             icon: "success",
//             button: "OK",
//         }).then(() => {
//             location.reload()
//         });
//     }
//   } catch (err) {
//     swal({
//       text:err.response.data.message,
//       icon: "warning",
//       button: "OK",
//     })
//   }
// };


// document.querySelector('.udpate-vendor-expense-form').addEventListener('submit',e=>{
//     e.preventDefault();
//     const docId = vendorExpenseData._id
//     const productName = document.getElementById('updateProductName').value;
//     const vendorName = document.getElementById('updateVendorName').value;
//     const description = document.getElementById('updateVendorDescription').value;
//     const vendorExpenseDate = document.getElementById('updateVendorExpenseDate').value;
//     const VendorQuantity = document.getElementById('updateVendorQuantity').value;
//     const vendorExpenseAmount = document.getElementById('updateVendorExpenseAmount').value;
//     const vendorPaymentStatus =  document.getElementById('updateVendorPaymentStatus').value;
//     const paymentDueDate =  document.getElementById('updateVendorPaymentDueDate').value;
//     updateVendorExpense(productName,vendorName,vendorExpenseDate,description,paymentDueDate,VendorQuantity,vendorExpenseAmount,vendorPaymentStatus,docId);
// })



// const deleteVendorExpense = async (docId) => {
//   try {
//     const res = await axios({
//       method: 'DELETE',
//       url: `http://localhost:3000/delete-vendor-expenses/${docId}`,
//       data:{
       
//       }
//     });
//     if (res.data.status === 'success') {
//         swal({
//             text:"Deleted successfully!",
//             icon: "success",
//             button: "OK",
//         }).then(() => {
//             location.reload()
//         });
//     }
//   } catch (err) {
//     swal({
//       text:err.response.data.message,
//       icon: "warning",
//       button: "OK",
//     })
//   }
// };