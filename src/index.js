const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

//verifica se um usuario com mesmo username já existe
function userExists(username, users) {
  return users.some(user => user.username === username);
}

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

app.post('/users', (request, response) => {
  const { username, name } = request.body;  

  //chamada da função de verificação de existencia do usuario
  if (userExists(username,users)) {
      return response.status(400).json({ error: "User already exists!" });
  }   

  //inserção do usuario
  users.push({ 
    username, 
    name,
    id: uuidv4,
    todos: []
  })

  //resposta de sucesso
  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;