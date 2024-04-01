const connection = require("../db.js");
const fs = require("fs");
const shortUUID = require("short-uuid");

exports.getAllVoiceSample = (req, res) => {
  const sql = "SELECT * FROM voice_samples";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching voice samples:", err);
      res.status(500).json("Error fetching voice samples");
      return;
    }

    const modifiedResults = results.map((result) => ({
      ...result,
      sample: `${req.protocol}://${req.get("host")}/${result.sample}`,
    }));

    res.status(200).json(modifiedResults);
  });
};

exports.addVoiceSample = (req, res) => {
  const { language, artist_id, category, title } = req.body;
  const sampleFile = req.file;

  if (!language || !artist_id || !sampleFile || !category) {
    res.status(400).json("language, artist_id, category or sample is missing");
    return;
  }

  const sampleId = shortUUID.generate(); // Generate unique sample ID
  const ext = sampleFile.originalname.split(".").pop(); // Get file extension
  const samplePath = `voice_samples/${sampleId}.${ext}`; // Construct file path

  const artistCheckQuery = "SELECT id FROM artists WHERE id = ?";
  connection.query(artistCheckQuery, [artist_id], (err, results) => {
    if (err) {
      console.error("Error checking artist:", err);
      res.status(500).json("Error checking artist");
      return;
    }

    if (results.length === 0) {
      res.status(400).json("Artist ID does not exist");
      return;
    }

    // Move the uploaded file to the voice_samples folder
    fs.rename(sampleFile.path, samplePath, (err) => {
      if (err) {
        console.error("Error moving sample file:", err);
        res.status(500).json("Error adding voice sample");
        return;
      }

      // Insert the sample information into the database
      const insertSampleQuery =
        "INSERT INTO voice_samples (id, language, artist_id, sample,category,title) VALUES (?, ?, ?, ?,?,?)";
      connection.query(
        insertSampleQuery,
        [sampleId, language, artist_id, samplePath, category, title],
        (err, result) => {
          if (err) {
            console.error("Error adding voice sample:", err);
            res.status(500).json("Error adding voice sample");
            return;
          }
          console.log("Voice sample added successfully");
          res.status(200).json("Voice sample added successfully");
        }
      );
    });
  });
};

// update voice sample
exports.updateVoiceSample = (req, res) => {
  const { language, artist_id, category, title } = req.body;
  const sampleId = req.params.sampleId; // Assuming sampleId is passed in the URL
  const sampleFile = req.file;

  const sampleCheckQuery = "SELECT * FROM voice_samples WHERE id = ?";
  connection.query(sampleCheckQuery, [sampleId], (err, results) => {
    if (err) {
      console.error("Error checking voice sample:", err);
      res.status(500).json("Error checking voice sample");
      return;
    }

    if (results.length === 0) {
      res.status(404).json("Voice sample not found");
      return;
    }

    let samplePath = results[0].sample; // Get the current sample path from the database

    // If a new sample file is provided, upload it and update the sample path
    if (sampleFile) {
      const ext = sampleFile.originalname.split(".").pop(); // Get file extension
      samplePath = `voice_samples/${shortUUID.generate()}.${ext}`; // Construct file path

      fs.rename(sampleFile.path, samplePath, (err) => {
        if (err) {
          console.error("Error moving sample file:", err);
          res.status(500).json("Error updating voice sample");
          return;
        }
        console.log("Sample file updated successfully");
      });
    }

    // Update the sample information in the database
    let updateSampleQuery = "UPDATE voice_samples SET ";
    const queryParams = [];
    if (language) {
      updateSampleQuery += "language = ?, ";
      queryParams.push(language);
    }
    if (artist_id) {
      updateSampleQuery += "artist_id = ?, ";
      queryParams.push(artist_id);
    }
    if (samplePath) {
      updateSampleQuery += "sample = ?, ";
      queryParams.push(samplePath);
    }
    if (category) {
      updateSampleQuery += "category = ?, ";
      queryParams.push(category);
    }

    if (title) {
      updateSampleQuery += "title = ?, ";
      queryParams.push(title);
    }
    // Remove the trailing comma and space
    updateSampleQuery = updateSampleQuery.slice(0, -2);
    updateSampleQuery += " WHERE id = ?";
    queryParams.push(sampleId);

    connection.query(updateSampleQuery, queryParams, (err, result) => {
      if (err) {
        console.error("Error updating voice sample:", err);
        res.status(500).json("Error updating voice sample");
        return;
      }
      console.log("Voice sample updated successfully");
      res.status(200).json("Voice sample updated successfully");
    });
  });
};

// delete voice sample
exports.deleteVoiceSample = (req, res) => {
  const sampleId = req.params.sampleId;

  if (!sampleId) {
    res.status(400).json("Sample ID is missing");
    return;
  }

  
  const deleteSampleQuery = "DELETE FROM voice_samples WHERE id = ?";

  connection.query(deleteSampleQuery, [sampleId], (err, result) => {
    if (err) {
      console.error("Error deleting voice sample:", err);
      res.status(500).json("Error deleting voice sample");
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json("Voice sample not found");
      return;
    }

    console.log("Voice sample deleted successfully");
    res.status(200).json("Voice sample deleted successfully");
  });
};
