const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

// Banco falso em memória
let users = [];
let pets = [];
let agendamentos = [];

// ROTA TESTE
app.get("/", (req, res) => {
  res.send("API Petshop rodando 🐶");
});

// =======================
// LOGIN / REGISTRO
// =======================

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Nome, e-mail e senha são obrigatórios.",
    });
  }

  const userExists = users.find((u) => u.email === email);

  if (userExists) {
    return res.status(400).json({
      message: "Usuário já existe.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  res.status(201).json({
    message: "Usuário criado com sucesso!",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "E-mail e senha são obrigatórios.",
    });
  }

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({
      message: "Usuário não encontrado.",
    });
  }

  const senhaCorreta = await bcrypt.compare(password, user.password);

  if (!senhaCorreta) {
    return res.status(400).json({
      message: "Senha inválida.",
    });
  }

  res.json({
    message: "Login realizado com sucesso!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
  const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ${PORT}');
});
});
