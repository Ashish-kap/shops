const connection = require("../db.js");
const shortUUID = require("short-uuid");

exports.getAllArtist = (req, res) => {
  const sql = "SELECT * FROM artists";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching artists:", err);
      res.status(500).send("Error fetching artists");
      return;
    }
    res.status(200).json(results);
  });
};

exports.addArtist = (req, res) => {
  const {
    name,
    address,
    gender,
    profile_photo,
    accents,
    roles,
    styles,
    microphone,
    services_offered,
    availability_days,
    availability_time,
    title,
    description,
    languages,
    category,
  } = req.body;

  if (!name || !gender) {
    res.status(400).send("Artist name or gender is missing.");
    return;
  }

  if (gender !== "Male" && gender !== "Female") {
    res
      .status(400)
      .send("Wrong gender field value. It must be 'Male' or 'Female'.");
    return;
  }

  const artistId = shortUUID.generate();
  const sql =
    "INSERT INTO artists (id, name, gender, address, profile_photo, accents, roles, styles, microphone, services_offered, availability_days, availability_time,title,description,languages,category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [
      artistId,
      name,
      gender,
      address,
      profile_photo,
      accents,
      roles,
      styles,
      microphone,
      services_offered,
      availability_days,
      availability_time,
      title,
      description,
      languages,
      category,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting artist:", err);
        res.status(500).send("Error inserting artist");
        return;
      }
      console.log("Artist added successfully");
      res.status(200).send("Artist added successfully");
    }
  );
};

exports.getArtist = (req, res) => {
  const { language, category, gender } = req.query;

  let sql = `
    SELECT artists.id, artists.name, artists.gender, artists.address, artists.profile_photo, voice_samples.sample, voice_samples.language AS sample_language, voice_samples.category
    FROM artists
    INNER JOIN voice_samples ON artists.id = voice_samples.artist_id
    WHERE 1=1
  `;
  // INNER JOIN languages ON artists.id = languages.artist_id

  const params = [];

  // if (language) {
  //   sql += " AND languages.language = ?";
  //   params.push(language);
  // }

  if (category) {
    sql += " AND voice_samples.category = ?";
    params.push(category);
  }

  if (gender) {
    sql += " AND artists.gender = ?";
    params.push(gender);
  }

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching artists:", err);
      res.status(500).send("Error fetching artists");
      return;
    }

    // Group artists' voice samples by artist ID
    const artistsData = {};
    results.forEach((row) => {
      const {
        id,
        name,
        gender,
        address,
        profile_photo,
        sample,
        sample_language,
        category,
      } = row;
      if (!artistsData[id]) {
        artistsData[id] = {
          id,
          name,
          gender,
          address,
          profile_photo,
          voice_samples: [],
        };
      }
      if (
        (!language || sample_language === language) &&
        (!category || row.category === category)
      ) {
        artistsData[id].voice_samples.push({
          sample: `${req.protocol}://${req.get("host")}/${sample}`,
          language: sample_language,
          category: category,
        });
      }
    });

    // Convert object to array of artists
    const artistsArray = Object.values(artistsData);
    res.status(200).json(artistsArray);
  });
};

exports.getArtistData = (req, res) => {
  const { artistId } = req.params;

  if (!artistId) {
    res.status(400).send("Artist ID is missing.");
    return;
  }

  const artistQuery = "SELECT * FROM artists WHERE id = ?";
  connection.query(artistQuery, [artistId], (err, artistResults) => {
    if (err) {
      console.error("Error fetching artist:", err);
      res.status(500).send("Error fetching artist");
      return;
    }

    if (artistResults.length === 0) {
      res.status(404).send("Artist not found.");
      return;
    }

    const artist = artistResults[0];

    const languagesQuery = "SELECT * FROM languages WHERE artist_id = ?";
    const categoriesQuery = "SELECT * FROM category WHERE artist_id = ?";
    const voiceSamplesQuery = "SELECT * FROM voice_samples WHERE artist_id = ?";

    connection.query(languagesQuery, [artistId], (err, languagesResults) => {
      if (err) {
        console.error("Error fetching languages:", err);
        res.status(500).send("Error fetching languages");
        return;
      }

      connection.query(
        categoriesQuery,
        [artistId],
        (err, categoriesResults) => {
          if (err) {
            console.error("Error fetching categories:", err);
            res.status(500).send("Error fetching categories");
            return;
          }

          connection.query(
            voiceSamplesQuery,
            [artistId],
            (err, voiceSamplesResults) => {
              if (err) {
                console.error("Error fetching voice samples:", err);
                res.status(500).send("Error fetching voice samples");
                return;
              }

              const artistData = {
                artist,
                languages: languagesResults,
                categories: categoriesResults,
                voiceSamples: voiceSamplesResults,
              };

              res.status(200).json(artistData);
            }
          );
        }
      );
    });
  });
};

// update artist
exports.updateArtist = (req, res) => {
  const { artistId } = req.params;
  const fields = [
    "name",
    "address",
    "gender",
    "profile_photo",
    "accents",
    "roles",
    "styles",
    "languages",
    "category",
    "microphone",
    "services_offered",
    "availability_days",
    "availability_time",
    "title",
    "description",
  ];

  if (!artistId) {
    res.status(400).send("Artist ID is missing.");
    return;
  }

  const fieldsToUpdate = [];
  const params = [];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      fieldsToUpdate.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  });

  if (fieldsToUpdate.length === 0) {
    res.status(400).send("No fields to update.");
    return;
  }
  params.push(artistId);
  const setClause = fieldsToUpdate.join(", ");
  const sql = `UPDATE artists SET ${setClause} WHERE id = ?`;
  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating artist:", err);
      res.status(500).send("Error updating artist");
      return;
    }
    console.log("Artist updated successfully");
    res.status(200).send("Artist updated successfully");
  });
};

// delete artist
exports.deleteArtist = (req, res) => {
  const { artistId } = req.params; // Assuming artistId is passed in the URL parameters

  if (!artistId) {
    res.status(400).send("Artist ID is missing.");
    return;
  }

  const sql = "DELETE FROM artists WHERE id = ?";

  connection.query(sql, [artistId], (err, result) => {
    if (err) {
      console.error("Error deleting artist:", err);
      res.status(500).send("Error deleting artist");
      return;
    }
    console.log("Artist deleted successfully");
    res.status(200).send("Artist deleted successfully");
  });
};


