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

// delete a inventorie
router.delete("/inventories/:id", (req, res) => {
  console.log("Delete request");
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    const allInventory = JSON.parse(data);
    const newInventory = allInventory.filter(
      (inventory) => inventory.id !== req.params.id
    );
    fs.writeFile(
      "./data/inventories.json",
      JSON.stringify(newInventory),
      () => {
        res.json({
          message: "Inventorie deleted from file",
          data: newInventory,
        });
      }
    );
  });
});

//post/create inventory
router.post("/inventories/create", (req, res) => {
  const allData = JSON.parse(
    fs.readFileSync("./data/inventories.json"),
    "utf-8"
  );
  const userInput = {
    id: uuidv4(),
    warehouseId: req.body.warehouseid,
    warehouseName: req.body.warehousename,
    itemName: req.body.itemname,
    description: req.body.description,
    category: req.body.category,
    status: req.body.status,
    quantity: req.body.quantity,
  };
  allData.push(userInput);
  fs.writeFile(
    "./data/inventories.json",
    JSON.stringify(allData),
    res.json({
      status: "inventory created",
      data: allData,
    })
  );
});

module.exports = router;
