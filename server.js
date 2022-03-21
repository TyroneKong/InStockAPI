const express = require("express");
const app = express();
const cors = require("cors");
const inventoryRoutes = require("./routes/inventories");
const warehouseRoutes = require("./routes/warehouses");
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log("incoming request");
  next();
});

app.use("/", inventoryRoutes);
app.use("/", warehouseRoutes);

app.get("/", (req, res) => {
  console.log("welcome to instock server");
  res.send("You are on instock server");
});
app.post("/", (req, res) => {
  console.log("welcome to instock server");
  res.send("You are on instock server");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening on port ${PORT}`);
  }
});
