const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8000;
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());
const shortUUID = require("short-uuid");
const multer = require("multer");
const Routes = require("./routes/routes");
const connection = require("./db.js");
const cron = require("node-cron");

app.use("/voice_samples", express.static("voice_samples"));
app.use(cors());
app.use(cookieParser());
app.use((req, res, next) => {
  req.requestTime = new Date().toTimeString();
  console.log(req.headers);
  next();
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "voice_samples");
  },
  filename: function (req, file, cb) {
    const sampleId = shortUUID.generate();
    const ext = file.originalname.split(".").pop();
    cb(null, sampleId + "." + ext);
  },
});

const upload = multer({ storage: storage });

// app.post("/add/voice/samples",upload.single("sample"), (req, res) => {
//     const { language, artistId } = req.body;
//     const sampleFile = req.file; // Get the uploaded file

//     if (!language || !artistId || !sampleFile) {
//       // If any required field is missing
//       res.status(400).send("language, artistId, or sample is missing");
//       return;
//     }

//     const sampleId = shortUUID.generate(); // Generate unique sample ID
//     const ext = sampleFile.originalname.split(".").pop(); // Get file extension
//     const samplePath = `voice_samples/${sampleId}.${ext}`; // Construct file path

//     const artistCheckQuery = "SELECT id FROM artists WHERE id = ?";
//     connection.query(artistCheckQuery, [artistId], (err, results) => {
//       if (err) {
//         console.error("Error checking artist:", err);
//         res.status(500).send("Error checking artist");
//         return;
//       }

//       if (results.length === 0) {
//         res.status(400).send("Artist ID does not exist");
//         return;
//       }

//       // Move the uploaded file to the voice_samples folder
//       fs.rename(sampleFile.path, samplePath, (err) => {
//         if (err) {
//           console.error("Error moving sample file:", err);
//           res.status(500).send("Error adding voice sample");
//           return;
//         }

//         // Insert the sample information into the database
//         const insertSampleQuery =
//           "INSERT INTO voice_samples (id, language, artist_id, sample) VALUES (?, ?, ?, ?)";
//         connection.query(
//           insertSampleQuery,
//           [sampleId, language, artistId, samplePath],
//           (err, result) => {
//             if (err) {
//               console.error("Error adding voice sample:", err);
//               res.status(500).send("Error adding voice sample");
//               return;
//             }
//             console.log("Voice sample added successfully");
//             res.status(200).send("Voice sample added successfully");
//           }
//         );
//       });
//     });
//   });

app.get("/", (req, res) => {
  res.status(200).json("success");
});

app.use("/", Routes);

app.get("/server", (req, res) => {
  res.send("server is running");
});

cron.schedule("* * * * *", () => {
  axios
    .get(`https://voiceocean.onrender.com/server`)
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error));
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("database connection successful");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
});
