const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const port = 3000;

// Configurações do Express
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

// Conexão com MongoDB
mongoose.connect("mongodb://localhost:27017/samu_bot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rotas
const atendimentoRoutes = require("./routes/atendimentoRoutes");
app.use("/", atendimentoRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
