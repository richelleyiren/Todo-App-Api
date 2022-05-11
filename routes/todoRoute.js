const express = require("express");
const {addTodo,deleteTodo,updateTodo,fetchTodo,fetchTodos} = require("../controllers/todoController");
const router = express.Router();

const { authenticate } = require("../middleware/auth");

router.post("/todos/:id", addTodo);

router.get("/todos", fetchTodos);

router.get("/todo/:id", fetchTodo);

router.delete("/todo/:id", authenticate, deleteTodo);

router.put("/todo/:id", authenticate, updateTodo);

module.exports = router;
