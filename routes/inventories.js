const e = require("express");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

//inventories route

router.get("/inventories", (req, res) => {
  fs.readFile("./data/inventories.json", "utf-8", (err, data) => {
    const allInventory = JSON.parse(data);
    if (err) {
      res.send("error reading inventory data");
    } else {
      res.send(allInventory);
    }
  });
});



module.exports = router;
