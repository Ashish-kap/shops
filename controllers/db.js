const mysql = require('mysql2');

function createDbConnection() {
  // const connection = mysql.createConnection({
  //   host: 'localhost',
  //   user: 'root',
  //   password: 'pass1234',
  //   database: 'sugarcaneco',
  // }); 

  const connection = mysql.createConnection({
    host: 'cloud.racknetweb.com',
    user: 'erpmanifestsolut_root',
    password: 'Erpsolution@123',
    database: 'erpmanifestsolut_nodejs',
  })

  return connection;
}

module.exports = createDbConnection;
