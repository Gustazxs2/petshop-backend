const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

let users = [];
let pets = [];
let agendamentos = [];


let produtos = [
  {
    id: 1,
    nome: "Ração Premium",
    categoria: "Alimentação",
    preco: 89.9,
    descricao: "Ração nutritiva para cães adultos.",
    imagem: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    nome: "Shampoo Pet",
    categoria: "Higiene",
    preco: 29.9,
    descricao: "Shampoo suave para banho e cuidado dos pelos.",
    imagem: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    nome: "Coleira Confort",
    categoria: "Acessórios",
    preco: 39.9,
    descricao: "Coleira confortável e resistente para passeios.",
    imagem: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    nome: "Brinquedo Mordedor",
    categoria: "Brinquedos",
    preco: 24.9,
    descricao: "Mordedor divertido para cães de todos os portes.",
    imagem: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=600&q=80",
  },
];


app.get("/", (req, res) => {
  res.send("API Petshop rodando 🐶");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Tentativa de cadastro:", email);

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Nome, e-mail e senha são obrigatórios.",
    });
  }

  const userExists = users.find((u) => u.email === email);

  if (userExists) {
    console.log("Cadastro recusado, usuário já existe:", email);

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

  console.log("Usuário cadastrado:", email);

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

  console.log("Tentativa de login:", email);

  if (!email || !password) {
    return res.status(400).json({
      message: "E-mail e senha são obrigatórios.",
    });
  }

  const user = users.find((u) => u.email === email);

  if (!user) {
    console.log("Login recusado, usuário não encontrado:", email);

    return res.status(400).json({
      message: "Usuário não encontrado.",
    });
  }

  const senhaCorreta = await bcrypt.compare(password, user.password);

  if (!senhaCorreta) {
    console.log("Login recusado, senha inválida:", email);

    return res.status(400).json({
      message: "Senha inválida.",
    });
  }

  console.log("Login realizado:", email);

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

  console.log("Tentativa de cadastro de pet:", nome);

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

  console.log("Pet cadastrado:", nome);

  res.status(201).json({
    message: "Pet cadastrado com sucesso!",
    pet,
  });
});

app.get("/agendamentos", (req, res) => {
  res.json(agendamentos);
});

app.post("/agendamentos", (req, res) => {
  const { nomePet, data, servico, userEmail } = req.body;

  console.log("Tentativa de agendamento:", nomePet, data, servico, userEmail);

  if (!nomePet || !data || !servico || !userEmail) {
    return res.status(400).json({
      message: "Nome do pet, data, serviço e usuário são obrigatórios.",
    });
  }

  const agendamento = {
    id: agendamentos.length + 1,
    nomePet,
    data,
    servico,
    userEmail,
  };

  agendamentos.push(agendamento);

  console.log("Agendamento realizado:", agendamento);

  res.status(201).json({
    message: "Agendamento realizado com sucesso!",
    agendamento,
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});