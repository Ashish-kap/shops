const mysql = require("mysql2");

// Create and export the database connection
const connection = mysql.createConnection({
  host: "cloud.racknetweb.com",
  user: "erpmanifestsolut_root",
  password: "hwGBl5E9W+qz",
  database: "erpmanifestsolut_voiceoceanllp",
});

module.exports = connection;
