const express = require("express");
const fs = require("fs");
const router = express.Router();

//warehouses route

router.get("/warehouses", (req, res) => {
  fs.readFile("./data/warehouses.json", "utf-8", (err, data) => {
    const allWarehouse = JSON.parse(data);
    if (err) {
      res.send("error reading Warehouse data");
    } else {
      res.send(allWarehouse);
    }
  });
});

router.get("/warehouses/:id", (req, res) => {
  fs.readFile("./data/warehouses.json", "utf-8", (err, data) => {
    const allWarehouse = JSON.parse(data);
    const foundWarehouse = allWarehouse.find(
      (data) => data.id === req.params.id
    );
    if (err) {
      res.send(err);
    } else {
      res.send(foundWarehouse);
    }
  });
});

console.log("Delete request");
fs.readFile("./data/warehouses.json", "utf8", (err, data) => {
  const allWarehouse = JSON.parse(data);
  const newWarehouse = allWarehouse.filter(
    (warehouse) => warehouse.id !== req.params.id
  );

  fs.writeFile("./data/warehouses.json", JSON.stringify(newWarehouse), () => {
    res.json({
      message: "Warehouse deleted from file",
      data: newWarehouse,
    });
  });
});

module.exports = router;
