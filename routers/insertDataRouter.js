const express = require("express");
const insertData = require("../controllers/insertData");

const router = express.Router();

router.route("/insertProducts").post(insertData.insertProducts);
router.route("/insertProductCategory").post(insertData.insertProductCategory);
router.route("/insertBrands").post(insertData.insertBrands);
module.exports = router;
