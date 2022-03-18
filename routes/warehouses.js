const express = require("express");
const fs = require("fs");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

//warehouses route
const allWarehouse = JSON.parse(
  fs.readFileSync("./data/warehouses.json", "utf-8")
);
// get all warehouses
router.get("/warehouses", (req, res) => {
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
  fs.writeFile(
    "./data/warehouses.json",
    JSON.stringify(allWarehouse),
    res.json({
      status: "created",
      data: allWarehouse,
    })
  );
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
      () => { }
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
      () => { }
    );
  });
}

// warehouse put

router.put('/warehouses/:id/edit-warehouse', (req, res) => {
  const warehouseForEdit = req.params.id;
  let emptyField = 0; 
  const emailChars = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneChars = /^(\+\d{1})?[ ]?(\([0-9]{3}\))?[- ]?([0-9]{3})[- ]?([0-9]{4})$/
  let i = warehouses.findIndex((warehouse) => warehouse.id === warehouseForEdit);

  warehouses[i].name = req.body.name;
  warehouses[i].address = req.body.address;
  warehouses[i].city = req.body.city;
  warehouses[i].country = req.body.country;
  warehouses[i].contact.name = req.body.contact.name;
  warehouses[i].contact.position = req.body.contact.position;
  warehouses[i].contact.phone = req.body.contact.phone;
  warehouses[i].contact.email = req.body.contact.email;

  Object.values.apply(req.body).forEach(item => {
    if(item === ""){
      return emptyField += 1;
    }
  });
    if(
      req.body.name === "" ||
		req.body.address === "" ||
		req.body.city === "" ||
		req.body.country === "" ||
		req.body.contact.name === "" ||
        req.body.contact.position === "" ||
		req.body.contact.phone === "" ||
		req.body.contact.email === ""
    ){
      res.status(400)
      .send('All fields are required');
    } else if(!warehouses[i]){
      res.status(400).send('Warehouse not found')
    } else if (emptyField >= 1){
      res.status(417).send("Some required fields empty")
    } else if (!emailChars.test(req.body.contact.email)) {
      res.status(406).send("Email address invalid")
    } else if (!phoneChars.test(req.body.contact.phone)){
      res.status(406).send("Phone number invalid")
    }
    else {
      fs.writeFileSync("./data/warehouses.json", JSON.stringify(warehouses));
      res.status(202).json(warehouses);
    }
});

module.exports = router;
