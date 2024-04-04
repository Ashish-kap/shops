const express = require("express");
const artist = require("../controller/artist.js");
const category = require("../controller/category.js");
const language = require("../controller/language.js");
const voiceSample = require("../controller/voiceSample.js");
const upload = require("../controller/upload.js");
const quotation = require("../controller/quotation.js");


const router = express.Router();

// artist
router.post("/create/artists", artist.addArtist);
router.get("/artists", artist.getArtist);
router.get("/artists/profile/:artistId",artist.getArtistData)
router.patch("/update/artist/:artistId", artist.updateArtist);
router.delete("/delete/artist/:artistId", artist.deleteArtist);

router.get("/get/all/artists",artist.getAllArtist)
router.get('/search/artist', artist.searchArtist)

// voice samples
router.get("/get/languages/and/category",voiceSample.getLanguagesAndCategory)
router.delete('/delete/voice/sample/:sampleId',voiceSample.deleteVoiceSample)
router.get("/get/all/voice/samples", voiceSample.getAllVoiceSample);
router.patch(
  "/update/voice/sample/:sampleId",
  upload.single("sample"),
  voiceSample.updateVoiceSample
);
router.post(
  "/add/voice/samples",
  upload.single("sample"),
  voiceSample.addVoiceSample
);

// language
router.post("/add/languages", language.addLanguage);
router.delete("/delete/language/:languageId", language.deleteLanguage)

// category
router.post("/add/category", category.addCategory);
router.delete("/delete/category/:categoryId", category.deleteCategory);


// quotation
router.post("/get/quotation", quotation.addQuotation);
router.get("/get/all/quotations",quotation.getAllQuotations)
router.patch("/update/quotation/:quotationId",quotation.updateQuotation);
router.delete("/delete/order/:orderId",quotation.deleteOrder)

// dashboard API
router.get("/dashboard/data", quotation.dashboardAPI);


module.exports = router;
