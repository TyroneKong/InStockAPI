const express = require("express");
const fs = require("fs");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

//inventories route
const allInventory = JSON.parse(
  fs.readFileSync("./data/inventories.json", "utf-8")
);

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

// delete a inventory
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
          message: "Inventory deleted from file",
          data: newInventory,
        });
      }
    );
  });
});

//post/create inventory
router.post("/inventories/create", (req, res) => {
  console.log("req", req.body);
  const userInput = {
    id: uuidv4(),
    warehouseName: req.body.warehouseName,
    itemName: req.body.itemName,
    description: req.body.description,
    category: req.body.category,
    status: req.body.status,
    quantity: req.body.quantity,
  };
  allInventory.push(userInput);
  fs.writeFile("./data/inventories.json", JSON.stringify(allInventory), () => {
    res.json({
      status: "inventory created",
      data: allInventory,
    });
  });
});

// put inventory
router.put("/inventories/:id/edit", (req, res) => {
  fs.readFile("./data/inventories.json", "utf-8", (err, data) => {
    const inventories = JSON.parse(data);
    const inventoryForEdit = inventories
      .filter((data) => data.id === req.params.id)
      .shift();
    let inventoryIndex = inventories.findIndex(
      (inventory) => inventory.id === inventoryForEdit.id
    );
    inventoryForEdit.warehouseName = req.body.warehouseName;
    inventoryForEdit.itemName = req.body.itemName;
    inventoryForEdit.description = req.body.description;
    inventoryForEdit.category = req.body.category;
    inventoryForEdit.status = req.body.status;
    inventoryForEdit.quantity = req.body.quantity;

    inventories[inventoryIndex] = inventoryForEdit;
    fs.writeFileSync("./data/inventories.json", JSON.stringify(inventories));
    res.status(203).json(inventories);
  });
});

module.exports = router;
