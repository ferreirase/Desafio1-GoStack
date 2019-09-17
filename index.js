const express = require("express");
const server = express();
server.use(express.json());

//definindo um array de projetos
const Projects = [];

//middle global
server.use((req, res, next) => {
  console.count("Quantidade de requisições");

  return next();
});

//middleware de verificação de ID
function checkID(req, res, next) {
  const { id } = req.params;
  const vetorIDs = [];
  for (let i = 0; i < Projects.length; i++) {
    vetorIDs.push(Projects[i].id);
  }

  const found = vetorIDs.find(function(element) {
    return element === id;
  });

  if (found === undefined) {
    return res.status(400).json({ error: "ID não encontrado!" });
  }

  return next();
}

//listando todos os projetos
server.get("/projects", (req, res) => {
  return res.json(Projects);
});

//cadastrando um novo projeto
server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;
  Projects.push({ id, title, tasks });
  return res.json(Projects);
});

//cadastrando uma nova tarefa no projeto pelo id
server.post("/projects/:id/tasks", checkID, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;
  for (let i = 0; i < Projects.length; i++) {
    if (Projects[i].id === id) {
      Projects[i].tasks = tasks;

      return res.json(Projects[i]);
    }
  }
});

//alterando o title de um projeto pelo id
server.put("/projects/:id", checkID, (req, res) => {
  const { newTitle } = req.body;
  const { id } = req.params;
  for (let i = 0; i < Projects.length; i++) {
    if (Projects[i].id === id) {
      Projects[i].title = newTitle;
      return res.json(Projects[i]);
    }
  }
});

//deletando um projeto pelo id
server.delete("/projects/:id", checkID, (req, res) => {
  const { id } = req.params;
  for (let i = 0; i < Projects.length; i++) {
    if (Projects[i].id === id) {
      Projects.splice(Projects.indexOf(id), 1);
      return res.send("Apagado!");
    }
  }
});

server.listen(3001);
