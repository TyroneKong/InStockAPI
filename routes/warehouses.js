const express = require("express");
const fs = require("fs");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

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
// post/create warehouse
router.post("/warehouses/create", (req, res) => {
  const allData = JSON.parse(
    fs.readFileSync("./data/warehouses.json", "utf-8")
  );
  const userInput = {
    id: uuidv4(),
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    contact: {
      name: req.body.contact.name,
      position: req.body.contact.position,
      phone: req.body.contact.phone,
      email: req.body.contact.email,
    },
  };
  allData.push(userInput);
  fs.writeFile(
    "./data/warehouses.json",
    JSON.stringify(allData),
    res.json({
      status: "created",
      data: allData,
    })
  );
});

// delete a warehouse
router.delete("/warehouses/:id", (req, res) => {
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
});

module.exports = router;
