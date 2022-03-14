const express = require("express");
const fs = require("fs");
const router = express.Router();

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

router.get("/inventories/:id", (req, res) => {
  fs.readFile("./data/inventories.json", "utf-8", (err, data) => {
    const allInventory = JSON.parse(data);
    const foundInventory = allInventory.find(
      (data) => data.id === req.params.id
    );
    if (err) {
      res.send(err);
    } else {
      res.send(foundInventory);
    }
  });
});

module.exports = router;
