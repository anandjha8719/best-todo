const Todo = require("../models/Todo");
const User = require("../models/User");
const { Parser } = require("json2csv");

const handleError = (res, error, message = "Server error") => {
  console.error(error);
  res.status(500).json({
    success: false,
    message,
    error: error.message,
  });
};

/**
 * Create new todo
 */
const createTodo = async (req, res) => {
  try {
    const { title, description, priority, tags, mentionedUsernames, status } =
      req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    let mentionedUsers = [];
    if (mentionedUsernames && mentionedUsernames.length > 0) {
      const users = await User.find({ username: { $in: mentionedUsernames } });
      mentionedUsers = users.map((user) => user._id);
    }

    const newTodo = new Todo({
      title,
      description,
      priority,
      tags,
      mentionedUsers,
      creator: req.user._id,
      status,
    });

    const savedTodo = await newTodo.save();

    await savedTodo.populate("creator", "username");
    await savedTodo.populate("mentionedUsers", "username");

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: savedTodo,
    });
  } catch (error) {
    handleError(res, error, "Error creating todo");
  }
};

/**
 * all todos for the current user with filtering, pagination and sorting
 */
const getAllTodos = async (req, res) => {
  try {
    const {
      limit = 10,
      cursor,
      status,
      priority,
      tags,
      search,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    // primary filter - always filter by current user
    const filter = { creator: req.user._id };

    // status filter if any
    if (status) filter.status = status;

    //  priority filter if any
    if (priority) {
      const priorityList = Array.isArray(priority) ? priority : [priority];
      filter.priority = { $in: priorityList };
    }

    // tags filter if there is
    if (tags) {
      const tagsList = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagsList };
    }

    // text search
    if (search && search.trim() !== "") {
      // Using regular expression for case-insensitive partial matching
      const searchRegex = new RegExp(search, "i");
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // sorting - default: createdAt in desc
    const sortOption = {};
    sortOption[sort] = order === "asc" ? 1 : -1;

    // apply cursor-based pagignation if provided
    if (cursor) {
      try {
        const decodedCursor = JSON.parse(
          Buffer.from(cursor, "base64").toString("utf-8")
        );
        const cursorField = Object.keys(sortOption)[0];
        const cursorValue = decodedCursor[cursorField];
        const cursorId = decodedCursor._id;

        if (cursorValue && cursorId) {
          if (order === "desc") {
            filter[cursorField] = { $lt: cursorValue };
          } else {
            filter[cursorField] = { $gt: cursorValue };
          }
          // handle ties in the sort field
          filter._id = { $ne: cursorId };
        }
      } catch (e) {
        console.error("Some error in cursor:", e);
      }
    }

    // run the query with **** limit + 1 **** to find if there are more results
    const todos = await Todo.find(filter)
      .populate("creator", "username")
      .populate("mentionedUsers", "username")
      .sort(sortOption)
      .limit(parseInt(limit) + 1);

    const hasMore = todos.length > parseInt(limit);

    const results = hasMore ? todos.slice(0, parseInt(limit)) : todos;

    // generae next cursor in case of more result
    let nextCursor = null;
    if (hasMore && results.length > 0) {
      const lastItem = results[results.length - 1];
      const cursorData = {
        _id: lastItem._id.toString(),
        [sort]: lastItem[sort],
      };
      nextCursor = Buffer.from(JSON.stringify(cursorData)).toString("base64");
    }

    // unique tags from all todos accprding to current filter (except tags filter itself!!!!! to get all possible tags)
    const tagsFilter = { ...filter };
    delete tagsFilter.tags;

    const allTodos = await Todo.find(tagsFilter).select("tags");
    const uniqueTags = [
      ...new Set(allTodos.flatMap((todo) => todo.tags || [])),
    ];

    res.status(200).json({
      success: true,
      count: results.length,
      hasMore,
      nextCursor,
      availableTags: uniqueTags,
      data: results,
    });
  } catch (error) {
    handleError(res, error, "Error retrieving todos");
  }
};
/**
 * get todo by id
 */
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
      .populate("creator", "username")
      .populate("mentionedUsers", "username");

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (todo.creator._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This todo belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    handleError(res, error, "Error retrieving todo");
  }
};

/**
 * update todo
 */
const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const { title, description, priority, tags, mentionedUsernames, status } =
      req.body;

    let todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (todo.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This todo belongs to another user",
      });
    }

    let mentionedUsers = undefined;
    if (mentionedUsernames && mentionedUsernames.length > 0) {
      const users = await User.find({ username: { $in: mentionedUsernames } });
      mentionedUsers = users.map((user) => user._id);
    }

    const updates = {
      title,
      description,
      priority,
      tags,
      mentionedUsers,
      status,
      updatedAt: Date.now(),
    };

    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("creator", "username")
      .populate("mentionedUsers", "username");

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    handleError(res, error, "Error updating todo");
  }
};

/**
 * delete a todo
 */
const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (todo.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This todo belongs to another user",
      });
    }

    await Todo.findByIdAndDelete(todoId);

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting todo");
  }
};

/**
 * add a note to a specific todo
 */
const addNoteToTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      });
    }

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (todo.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This todo belongs to another user",
      });
    }

    todo.notes.push(content);
    todo.updatedAt = Date.now();

    const updatedTodo = await todo.save();

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: updatedTodo,
    });
  } catch (error) {
    handleError(res, error, "Error adding note to todo");
  }
};
/**
 * edit a note in a todo
 */
const editNoteInTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const { noteIndex, content } = req.body;

    if (noteIndex === undefined || !content) {
      return res.status(400).json({
        success: false,
        message: "Note index and content are required",
      });
    }

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (todo.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This todo belongs to another user",
      });
    }

    // Check if the note at the specified index exists
    if (!todo.notes[noteIndex]) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Update the note at the specified index
    todo.notes[noteIndex] = content;
    todo.updatedAt = Date.now();

    const updatedTodo = await todo.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    handleError(res, error, "Error editing note in todo");
  }
};


/**
 * Export all todos for the current user
 */
const exportTodos = async (req, res) => {
  try {
    const { format = "json" } = req.query;

    const todos = await Todo.find({ creator: req.user._id })
      .populate("creator", "username")
      .populate("mentionedUsers", "username");

    if (format.toLowerCase() === "csv") {
      const fields = [
        "title",
        "description",
        "priority",
        "status",
        "createdAt",
        "updatedAt",
      ];
      const opts = { fields };

      const todoData = todos.map((todo) => ({
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        status: todo.status,
        tags: todo.tags.join(", "),
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      }));

      try {
        const parser = new Parser(opts);
        const csv = parser.parse(todoData);

        res.header("Content-Type", "text/csv");
        res.attachment(`todos-${req.user.username}-${Date.now()}.csv`);
        return res.send(csv);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Error generating CSV",
          error: err.message,
        });
      }
    } else {
      res.status(200).json({
        success: true,
        count: todos.length,
        data: todos,
      });
    }
  } catch (error) {
    handleError(res, error, "Error exporting todos");
  }
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  addNoteToTodo,
  editNoteInTodo,
  exportTodos,
};
