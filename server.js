const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

let users = [];
let pets = [];
let agendamentos = [];

app.get("/", (req, res) => {
  res.send("API Petshop rodando 🐶");
});

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
});

app.get("/pets", (req, res) => {
  res.json(pets);
});

app.post("/pets", (req, res) => {
  const { nome, especie, raca, idade } = req.body;

  if (!nome || !especie) {
    return res.status(400).json({
      message: "Nome e espécie do pet são obrigatórios.",
    });
  }

  const pet = {
    id: pets.length + 1,
    nome,
    especie,
    raca,
    idade,
  };

  pets.push(pet);

  res.status(201).json({
    message: "Pet cadastrado com sucesso!",
    pet,
  });
});

app.get("/agendamentos", (req, res) => {
  res.json(agendamentos);
});

app.post("/agendamentos", (req, res) => {
  const { nomePet, data, servico } = req.body;

  if (!nomePet || !data || !servico) {
    return res.status(400).json({
      message: "Nome do pet, data e serviço são obrigatórios.",
    });
  }

  const agendamento = {
    id: agendamentos.length + 1,
    nomePet,
    data,
    servico,
  };

  agendamentos.push(agendamento);

  res.status(201).json({
    message: "Agendamento realizado com sucesso!",
    agendamento,
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});