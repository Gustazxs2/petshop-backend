const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const sequelize = require("./config/database");

const User = require("./models/User");
const Produto = require("./models/Produto");
const Agendamento = require("./models/Agendamento");

const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

async function criarProdutosPadrao() {
  const quantidade = await Produto.count();

  if (quantidade === 0) {
    await Produto.bulkCreate([
      {
        nome: "Ração Premium",
        categoria: "Alimentação",
        preco: 89.9,
        descricao: "Ração nutritiva para cães adultos.",
        imagem:
          "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
      },

      {
        nome: "Shampoo Pet",
        categoria: "Higiene",
        preco: 29.9,
        descricao: "Shampoo suave para banho e cuidado dos pelos.",
        imagem:
          "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=600&q=80",
      },

      {
        nome: "Coleira Confort",
        categoria: "Acessórios",
        preco: 39.9,
        descricao: "Coleira confortável e resistente para passeios.",
        imagem:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=600&q=80",
      },

      {
        nome: "Brinquedo Mordedor",
        categoria: "Brinquedos",
        preco: 24.9,
        descricao: "Mordedor divertido para cães de todos os portes.",
        imagem:
          "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=600&q=80",
      },
    ]);

    console.log("Produtos cadastrados no banco.");
  }
}

app.get("/", (req, res) => {
  res.send("API PetLife rodando 🐶");
});

app.get("/produtos", async (req, res) => {
  try {
    const produtos = await Produto.findAll();

    res.json(produtos);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro ao buscar produtos.",
    });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, e-mail e senha são obrigatórios.",
      });
    }

    const userExists = await User.findOne({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({
        message: "Usuário já existe.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro no servidor.",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Usuário não encontrado.",
      });
    }

    const senhaCorreta = await bcrypt.compare(
      password,
      user.password
    );

    if (!senhaCorreta) {
      return res.status(400).json({
        message: "Senha inválida.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro no servidor.",
    });
  }
});

app.get("/agendamentos", auth, async (req, res) => {
  try {
    const agendamentos = await Agendamento.findAll();

    res.json(agendamentos);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro ao buscar agendamentos.",
    });
  }
});

app.post("/agendamentos", auth, async (req, res) => {
  try {
    const { nomePet, data, servico, userEmail } = req.body;

    if (!nomePet || !data || !servico || !userEmail) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios.",
      });
    }

    const agendamento = await Agendamento.create({
      nomePet,
      data,
      servico,
      userEmail,
    });

    res.status(201).json({
      message: "Agendamento realizado com sucesso!",
      agendamento,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro ao criar agendamento.",
    });
  }
});

sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Banco conectado com sucesso!");

    await criarProdutosPadrao();

    app.listen(3001, () => {
      console.log("Servidor rodando na porta 3001");
    });
  })
  .catch((error) => {
    console.log("ERRO NO BANCO:");
    console.log(error);
  });