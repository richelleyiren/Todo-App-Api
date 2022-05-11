const ToModel = require('../models/todoModel');
const userModel = require('../models/regModel')
const mongoose = require("mongoose");

//saving or adding a todo to the mongodb server /database

const addTodo = async (req, res) => {
  const { todo } = req.body;
  const { id } = req.params

  const dataTodo = {
    todo,
  };
     
  const userTodo = {...dataTodo, user:id}

  try{
    const dataToStore = new ToModel(userTodo);
    const saving = await dataToStore.save()

    const findUser = await userModel.findById(id)
    
    findUser.todos.push(saving)
    await findUser.save()
    
    console.log(findUser)
    res.json(findUser)
  }catch(error){
    console.log(error)
  }

};



//fetching all todos from the database or mongodb server
const fetchTodos = (req, res) => {
  ToModel.find()
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

//fetching only one particular todo from the database or mongodb server

const fetchTodo =  async (req, res) => {
  try{
    const {id} = req.params
    const todo = await ToModel.findById(id)
    res.send(todo)
  } catch (error){
    console.log(error)
  }
};

//deleting a particular todo using it id
const deleteTodo = (req, res) => {
  ToModel.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

//updating a particula todo using it unique id
const updateTodo = (req, res) => {
  const { status } = req.body;

  const dataTodo = {
    status,
  };
  ToModel.updateOne({ _id: req.params.id }, dataTodo)
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      console.log({ message: "updated successfully" });
    });
};

const todoByUser = async (req,res) =>{
  try {
    const { todoId } = req.params
    const todo = await todoModel.findById(id).populate('Users')

    todo ? res.status(200).json(todo) : res.status(500).json(' sorry, item not found')
    
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  addTodo,
  fetchTodos,
  fetchTodo,
  deleteTodo,
  updateTodo,
};
