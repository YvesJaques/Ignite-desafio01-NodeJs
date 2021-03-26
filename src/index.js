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

//Middleware verifica existencia usuario
function checksExistsUserAccount(request, response, next) {
  //desestruturação do username
  const { username } = request.headers;

  //busca do username
  const user = users.find(user => user.username === username); 
    
  if(!user) return response.status(400).json({ error: "User not found"});
  
  request.user = user;

  return next();
}

//cadastro de usuario
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

//listagem de todos do user
app.get('/todos', checksExistsUserAccount, (request, response) => {
  //desestruturação do user
  const { user } = request;

  return response.json(user.todos);
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