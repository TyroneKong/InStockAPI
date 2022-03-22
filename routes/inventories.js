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
  const userInput = {
    id: uuidv4(),
    warehouseName: req.body.warehousename,
    itemName: req.body.itemname,
    description: req.body.description,
    category: req.body.category,
    status: req.body.status,
    quantity: req.body.quantity,
  };
  allInventory.push(userInput);
  fs.writeFile(
    "./data/inventories.json",
    JSON.stringify(allInventory),
    res.json({
      status: "inventory created",
      data: allInventory,
    })
  );
});

// put inventory

router.put("inventories/:id/edit-inventory", (req, res) => {
  const invID = req.params.id;
  let i = inventories.findIndex((item) => item.id === invID);
  // Change content of the item
  inventories[i].itemName = req.body.itemName;
  inventories[i].description = req.body.description;
  inventories[i].category = req.body.category;
  inventories[i].status = req.body.status;
  inventories[i].warehouseName = req.body.warehouseName;
  inventories[i].warehouseID = req.body.warehouseID;
  inventories[i].quantity = req.body.quantity;

  if (
    req.body.itemName === "" ||
    req.body.description === "" ||
    req.body.category === "" ||
    req.body.status === "" ||
    req.body.warehouseName === ""
  ) {
    res.status(400).json({ messages: "All Fields are required" });
  } else if (!inventories[i]) {
    res.status(400).json({ messages: "Inventory not found" });
  } else {
    fs.writeFileSync("./data/inventories.json", JSON.stringify(inventories));
    //Send the updated item to the user
    res.status(201).json(inventories);
  }
});

module.exports = router;
