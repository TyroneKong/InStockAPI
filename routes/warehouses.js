const express = require("express");
const fs = require("fs");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const allWarehouse = JSON.parse(
  fs.readFileSync("./data/warehouses.json", "utf-8")
);

// get all warehouses
router.get("/warehouses", (req, res) => {
  const allWarehouse = fs.readFileSync("./data/warehouses.json", "utf-8");
  res.status("200").send(allWarehouse);
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
// post/create warehouse
router.post("/warehouses/create", (req, res) => {
  const userInput = {
    id: uuidv4(),
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    contact: {
      name: req.body.contactname,
      position: req.body.position,
      phone: req.body.phone,
      email: req.body.email,
    },
  };
  allWarehouse.push(userInput);
  fs.writeFile("./data/warehouses.json", JSON.stringify(allWarehouse), () => {
    res.json({
      status: "created",
      data: allWarehouse,
    });
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
  deleteWarehouse(req.params.id, (newWarehouse) => {
    res.json({
      message: "Warehouse deleted from file",
      data: newWarehouse,
    });
  });
});

function deleteWarehouse(id, callBack) {
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
    callBack(newWarehouse);
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
// update a warehouse
router.put("/warehouses/:id/edit", (req, res) => {
  const allData = allWarehouse;
  const warehouseId = req.params.id;

  let warehouseForEdit = allData.find((current) => current.id === warehouseId);
  console.log(warehouseForEdit);
  if (warehouseForEdit) {
    warehouseForEdit.name = req.body.name;
    warehouseForEdit.address = req.body.address;
    warehouseForEdit.city = req.body.city;
    warehouseForEdit.country = req.body.country;
    warehouseForEdit.contact.name = req.body.contact.name;
    warehouseForEdit.contact.position = req.body.contact.position;
    warehouseForEdit.contact.phone = req.body.contact.phone;
    warehouseForEdit.contact.email = req.body.contact.email;
    fs.writeFile("./data/warehouses.json", JSON.stringify(allWarehouse), () => {
      res.json({
        status: "Edit Successful!",
      });
    });
  } else {
    res.json({
      status: "Error!",
    });
  }
});
module.exports = router;
