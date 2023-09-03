const PDFDocument = require('pdfkit');
const fs = require('fs');

// Sample response JSON
const response = {
  "basicExpenses": [
        {
            "_id": "64cea36aab0b2b83fdcded1a",
            "expenseName": "biryani",
            "amount": 60,
            "date": "2024-08-28T00:00:00.000Z",
            "description": "im going to it birayani todya... hurrey.. lots of fun.. hurrey..",
            "shopId": "64c634c3b26622a9ae9bea40",
            "createdAt": "2023-08-05T19:30:50.554Z",
            "__v": 0
        },
        {
            "_id": "64cea692ab0b2b83fdcded2c",
            "expenseName": "biryani",
            "amount": 60,
            "date": "2024-08-28T00:00:00.000Z",
            "description": "im going to it birayhurrey..",
            "shopId": "64c634c3b26622a9ae9bea40",
            "createdAt": "2023-08-05T19:44:18.800Z",
            "__v": 0
        },
        {
            "_id": "64cea695ab0b2b83fdcded30",
            "expenseName": "biryani",
            "amount": 60,
            "date": "2024-08-28T00:00:00.000Z",
            "description": "im going to it birayhurrey..",
            "shopId": "64c634c3b26622a9ae9bea40",
            "createdAt": "2023-08-05T19:44:21.056Z",
            "__v": 0
        }
    ],
    "vendorExpenses": [
        {
            "_id": "64ce7380068059f61e26b3b5",
            "productName": "Notebook",
            "description": "Pack of 10 college-ruled notebooks",
            "quantity": "100",
            "date": "2023-07-30T00:00:00.000Z",
            "amount": 15,
            "vendorName": "Office Supplies Inc.",
            "paymentDueDate": "2023-08-15T00:00:00.000Z",
            "paymentStatus": "Unpaid",
            "shopId": "64c634c3b26622a9ae9bea40",
            "createdAt": "2023-08-05T16:06:24.296Z",
            "__v": 0
        },
        {
            "_id": "64cebee9f7c96a031bfec0d5",
            "productName": "Notebook",
            "description": "Pack of 10 college-ruled notebooks",
            "quantity": "100",
            "date": "2023-07-30T00:00:00.000Z",
            "amount": 15,
            "vendorName": "Office Supplies Inc.",
            "paymentDueDate": "2023-08-15T00:00:00.000Z",
            "paymentStatus": "Unpaid",
            "shopId": "64c634c3b26622a9ae9bea40",
            "createdAt": "2023-08-05T21:28:09.709Z",
            "__v": 0
        },
        {
            "_id": "64cebef9f7c96a031bfec0d9",
            "productName": "Notebook",
            "description": "line is perpendicular to the surface or another line that serves as the base. Vertical lines in coordinate ge. A vertical line is always a line that runs from top to bottom, or, from bottom to top. Standing lines are also a type of vertical",
            "quantity": "100",
            "date": "2023-07-30T00:00:00.000Z",
            "amount": 15,
            "vendorName": "Office Supplies Inc.",
            "paymentDueDate": "2023-08-15T00:00:00.000Z",
            "paymentStatus": "Unpaid",
            "shopId": "64c634c3b26622a9ae9bea40",
            "createdAt": "2023-08-05T21:28:25.158Z",
            "__v": 0
        }
    ],
    "employeeExpenses": [
        {
            "_id": "64cfbdf15f0cee07cf9bf72f",
            "employeeName": "JEnn",
            "salaryAmount": 290,
            "date": "2023-08-06T00:00:00.000Z",
            "description": "here you go..",
            "paymentMethod": "Cash",
            "shopId": "64c634c3b26622a9ae9bea40",
            "createdAt": "2023-08-06T15:36:17.524Z",
            "__v": 0
        }
    ]
};

// Create a new PDF document
const doc = new PDFDocument();
const output = fs.createWriteStream('expenses_report.pdf');

doc.pipe(output);

// Generate PDF content
doc.font('Helvetica-Bold').fontSize(20).text('Expenses Report', { align: 'center' });
doc.moveDown();

function generateSection(sectionTitle, expenses) {
  doc.font('Helvetica-Bold').fontSize(16).text(sectionTitle, { underline: true });
  
  expenses.forEach(expense => {
    doc.font('Helvetica').fontSize(12);
    for (const key in expense) {
      doc.text(`${key}: ${expense[key]}`);
    }
    doc.moveDown();
  });
  doc.moveDown();
}

generateSection('Basic Expenses', response.basicExpenses);
generateSection('Vendor Expenses', response.vendorExpenses);
generateSection('Employee Expenses', response.employeeExpenses);

// Finalize PDF
doc.end();
