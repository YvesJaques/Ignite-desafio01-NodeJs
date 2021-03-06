const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const { json } = require('express');

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

//Middleware verifica existencia todo
function checksExistsTodo(request, response, next) {
  //desestruturação do username
  const { username } = request.headers;

  //busca do username
  const user = users.find(user => user.username === username);   

  //busca do todo
  const todo = user.todos.find(todo => todo.id === request.params.id);
  
  //verificacao de existencia do todo
  if(!todo) return response.status(404).json({ error: "Todo not found!"});  
  
  //na utilização de mais de um middlware é necessário especificar o retorno da request
  request.todo = todo;  

  return next();
}

//cadastro de usuario
app.post('/users', (request, response) => {
  const { username, name } = request.body;  

  //chamada da função de verificação de existencia do usuario
  if (userExists(username,users)) {
      return response.status(400).json({ error: "User already exists!" });
  }   

  const user = {
    id: uuidv4(),
    name,
    username, 
    todos: []
  }

  //inserção do usuario
  users.push(user)

  //resposta de sucesso
  return response.status(201).send(user);
});

//listagem de todos do user
app.get('/todos', checksExistsUserAccount, (request, response) => {
  //desestruturação do user
  const { user } = request;

  return response.send(user.todos)
});

//cadastro de todo
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

    const { user } = request;   
    
    const todo = { 
      id: uuidv4(),
      title,
      done: false, 
      deadline: new Date(deadline), 
      created_at: new Date()
    }
  
  user.todos.push(todo);  

  return response.status(201).send(todo);
});

//alteração de dados do todo
app.put('/todos/:id', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;  
  
  const user = request.user;

  const todo = request.todo;

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).send(todo);
});

//conclusão de todo
app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  const { username } = request.headers; 
  
  const user = request.user;
  
  const todo = request.todo;

  if(todo.done === true) return response.status(400).json({ error: "This todo is already done!"}); 

  todo.done = true;  

  return response.status(201).send(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  const { username } = request.headers;  
  
  const user = request.user;

  const todo = request.todo;

  user.todos.splice(user.todos.indexOf(todo), 1);

  return response.status(204).send();
});

module.exports = app;