const express = require("express");
const router = express.Router();
const {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  addNoteToTodo,
  exportTodos,
  editNoteInTodo,
} = require("../controllers/todoController");
const authMiddleware = require("../middlewares/authMiddleware");

// use auth middleware (based on ************ username *************)
router.use(authMiddleware.getUserFromRequest);

router.get("/", getAllTodos);
router.get("/export", exportTodos);
router.get("/:id", getTodoById);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

//note
router.post("/:id/notes", addNoteToTodo);
router.put("/:id/notes", editNoteInTodo);

module.exports = router;
