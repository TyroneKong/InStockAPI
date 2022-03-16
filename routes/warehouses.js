const express = require("express");
const fs = require("fs");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

//warehouses route

// get all warehouses
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

// get a specific warehouse
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

// get all inventories of a specific warehouse
router.get("/warehouses/:id/inventory", (req, res) => {
  fs.readFile("./data/inventories.json", "utf-8", (err, data) => {
    const allInventory = JSON.parse(data);
    const foundWarehouseInventory = allInventory.filter(
      (data) => data.warehouseID === req.params.id
    );
    console.log(foundWarehouseInventory);
    res.send(foundWarehouseInventory);
  });
});

// delete a warehouse and its inventory
router.delete("/warehouses/:id", (req, res) => {
  console.log("Delete request");
  deleteInventory(req.params.id);
  const newWarehouse = deleteWarehouse(req.params.id);

  res.json({
    message: "Warehouse deleted from file",
    data: newWarehouse,
  });
});

function deleteWarehouse(id) {
  fs.readFile("./data/warehouses.json", "utf8", (err, data) => {
    const allWarehouse = JSON.parse(data);
    const newWarehouse = allWarehouse.filter(
      (warehouse) => warehouse.id !== id
    );

    fs.writeFile(
      "./data/warehouses.json",
      JSON.stringify(newWarehouse),
      () => {}
    );
    return newWarehouse;
  });
}

function deleteInventory(warehouseId) {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    const allInventory = JSON.parse(data);
    const newInventory = allInventory.filter(
      (inventory) => inventory.warehouseID !== warehouseId
    );

    fs.writeFile(
      "./data/inventories.json",
      JSON.stringify(newInventory),
      () => {}
    );
  });
}

module.exports = router;
