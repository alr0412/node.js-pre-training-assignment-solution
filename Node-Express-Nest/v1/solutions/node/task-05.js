/**
 * task-05.js
 * Extend your Task 04 server by adding EventEmitter functionality,
 * logging, analytics, and new endpoints.
 *
 * Implement all TODOs below.
 */

const http = require("http");
const url = require("url");
const { EventEmitter } = require("events");
const { timeStamp } = require("console");

// ---------- Utilities ----------
/**
 * Extract path parameters from URL pattern
 * @param {string} pattern - URL pattern like '/todos/:id'
 * @param {string} path - Actual path like '/todos/123'
 * @returns {Object} Extracted parameters like { id: "123" }
 */
function parsePathParams(pattern, path) {
  // TODO: Implement path parameter extraction
  // 1. Split pattern and path by '/'
  // 2. Find segments that start with ':'
  // 3. Extract corresponding values from path
  // 4. Return object with parameter names and values
  // 5. Handle edge cases (no params, mismatched segments)

  const params = {};

  const patternSegments = pattern.split("/");
  const pathSegments = path.split("/");

  if (patternSegments.length !== pathSegments.length) {
    throw new Error("Path doesn't match pattern");
  }

  patternSegments.forEach((segment, index) => {
    if (segment.startsWith(":")) {
      params[segment.slice(1)] = pathSegments[index] ?? "";
    } else if (segment !== pathSegments[index]) {
      throw new Error(
        `Segment mismatch: "${segment}" vs "${pathSegments[index]}"`,
      );
    }
  });

  return params;
}

/**
 * Send consistent JSON response
 * @param {ServerResponse} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 */
function sendResponse(res, statusCode, data) {
  // TODO: Implement consistent response sending
  // 1. Set proper HTTP status code
  // 2. Set Content-Type to application/json
  // 3. Add CORS headers for browser compatibility
  // 4. Convert data to JSON string
  // 5. Send response and end connection

  // Headers to set:
  // - Content-Type: application/json
  // - Access-Control-Allow-Origin: *
  // - Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  // - Access-Control-Allow-Headers: Content-Type

  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  res.end(JSON.stringify(data));
}

/**
 * Validate todo data according to business rules
 * @param {Object} todoData - Todo data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} Validation result with errors array
 */
function validateTodo(todoData, isUpdate = false) {
  // TODO: Implement todo data validation
  // 1. Check title requirements (required, string, 1-100 chars, not whitespace-only)
  // 2. Check description (optional, string, max 500 chars)
  // 3. Check completed (optional, boolean only)
  // 4. Return validation result with errors array
  // 5. Handle update vs create validation differences

  const errors = [];
  let isValid = true;

  const title = todoData.title;
  const description = todoData.description;
  const completed = todoData.completed;

  // Title validation
  // - Required for create, optional for update
  // - Must be string
  // - 1-100 characters
  // - Cannot be only whitespace

  // Description validation
  // - Optional field
  // - Must be string if provided
  // - Max 500 characters

  // Completed validation
  // - Optional field
  // - Must be boolean if provided

  // Title validation
  if (title !== undefined && title !== null) {
    if (
      typeof title !== "string" ||
      title.length < 1 ||
      title.length > 100 ||
      title.trim() === ""
    ) {
      errors.push("Incorrect title format");
      isValid = false;
    }
  } else if (!isUpdate) {
    isValid = false;
    errors.push("No title provided");
  }

  // Description validation
  if (description) {
    if (typeof description !== "string" || description.length > 500) {
      errors.push("Incorrect description format");
      isValid = false;
    }
  }

  //Completed validation
  if (typeof completed !== "boolean" && typeof completed !== "undefined") {
    errors.push("Incorrect completed format");
    isValid = false;
  }

  return { isValid: isValid, errors };
}

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(data);
}

function parseIdFromPath(pathname) {
  const m = pathname.match(/^\/todos\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function nowISO() {
  return new Date().toISOString();
}

// ---------- Analytics ----------

class AnalyticsTracker {
  constructor() {
    this.stats = {
      totalCreated: 0,
      totalUpdated: 0,
      totalDeleted: 0,
      totalViews: 0,
      errors: 0,
      dailyStats: {},
    };
  }
  _bumpDaily(field) {
    // TODO: implement daily stats tracking
    // - use YYYY-MM-DD date keys
    // - track created, updated, deleted, views per day
    const now = new Date().toISOString().slice(0, 10);

    if (!this.stats.dailyStats[now]) {
      this.stats.dailyStats[now] = {
        created: 0,
        updated: 0,
        deleted: 0,
        views: 0,
      };
    }

    this.stats.dailyStats[now][field]++;
  }
  trackCreated() {
    // TODO: implement tracking logic
    this.stats.totalCreated++;
    this._bumpDaily("created");
  }
  trackUpdated() {
    // TODO: implement tracking logic
    this.stats.totalUpdated++;
    this._bumpDaily("updated");
  }
  trackDeleted() {
    // TODO: implement tracking logic
    this.stats.totalDeleted++;
    this._bumpDaily("deleted");
  }
  trackViewed() {
    // TODO: implement tracking logic
    this.stats.totalViews++;
    this._bumpDaily("views");
  }
  trackError() {
    // TODO: implement tracking logic
    this.stats.errors++;
  }
  getStats() {
    // TODO: implement stats retrieval
    return this.stats;
  }
}

// ---------- Console Logger ----------
class ConsoleLogger {
  todoCreated(data) {
    console.log(
      `📝 [${data.timestamp}] Created "${data.todo.title}" (ID: ${data.todo.id})`,
    );
  }
  todoUpdated(data) {
    console.log(
      `✏️  [${data.timestamp}] Updated ID ${
        data.newTodo.id
      }; changed: ${data.changes.join(", ")}`,
    );
  }
  todoDeleted(data) {
    console.log(
      `🗑️  [${data.timestamp}] Deleted "${data.todo.title}" (ID: ${data.todo.id})`,
    );
  }
  todoViewed(data) {
    console.log(`👁️  [${data.timestamp}] Viewed ID ${data.todo.id}`);
  }
  todosListed(data) {
    console.log(`📃 [${data.timestamp}] Listed todos count=${data.count}`);
  }
  todoNotFound(data) {
    console.warn(
      `⚠️  [${data.timestamp}] Not found: id=${data.todoId} op=${data.operation}`,
    );
  }
  validationError(data) {
    console.error(
      `❌ [${data.timestamp}] Validation error: ${data.errors.join(", ")}`,
    );
  }
  serverError(data) {
    console.error(
      `💥 [${data.timestamp}] Server error in ${data.operation}: ${
        data.error && data.error.message
      }`,
    );
  }
}

// ---------- Validation ----------
function validateTodoPayload(payload, isCreate = false) {
  const errors = [];
  const out = {};

  let isValid = true;

  const title = payload.title;
  const description = payload.description;
  const completed = payload.completed;

  // TODO: implement full validation logic
  // - title: required, non-empty string
  // - description: optional, string
  // - completed: optional, boolean (default false)

  if (title !== undefined && title !== null) {
    if (
      typeof title !== "string" ||
      title.length < 1 ||
      title.length > 100 ||
      title.trim() === ""
    ) {
      errors.push("Incorrect title format");
      isValid = false;
    } else {
      out.title = title.trim();
    }
  } else if (isCreate) {
    isValid = false;
    errors.push("No title provided");
  }

  // Description validation
  if (description) {
    if (typeof description !== "string" || description.length > 500) {
      errors.push("Incorrect description format");
      isValid = false;
    } else {
      out.description = description.trim();
    }
  }

  //Completed validation
  if (typeof completed !== "boolean" && typeof completed !== "undefined") {
    errors.push("Incorrect completed format");
    isValid = false;
  } else {
    out.completed = completed;
  }

  return { errors, values: out };
}

class TodoServer extends EventEmitter {
  constructor(port = 3000) {
    super();
    this.port = port;
    this.todos = [];
    this.nextId = 1;

    // TODO: initialize analytics tracker
    // TODO: initialize logger
    // TODO: initialize recent events list keeping last 100 events
    this.server = null;
    this.analytics = new AnalyticsTracker();
    this.logger = new ConsoleLogger();
    this.recentEvents = [];

    this._wireDefaultListeners();
  }

  _wireDefaultListeners() {
    const remember = (eventType) => (data) => {
      this.recentEvents.push({ eventType, timestamp: nowISO(), data });
      if (this.recentEvents.length > 100) this.recentEvents.shift();
    };
    // Remember all key events for /events
    [
      "todoCreated",
      "todoUpdated",
      "todoDeleted",
      "todoViewed",
      "todosListed",
      "todoNotFound",
      "validationError",
      "serverError",
    ].forEach((evt) => this.on(evt, remember(evt)));

    // Logging
    this.on("todoCreated", (d) => this.logger.todoCreated(d));
    this.on("todoUpdated", (d) => this.logger.todoUpdated(d));
    this.on("todoDeleted", (d) => this.logger.todoDeleted(d));
    this.on("todoViewed", (d) => this.logger.todoViewed(d));
    this.on("todosListed", (d) => this.logger.todosListed(d));
    this.on("todoNotFound", (d) => this.logger.todoNotFound(d));
    this.on("validationError", (d) => this.logger.validationError(d));
    this.on("serverError", (d) => this.logger.serverError(d));

    // Analytics
    this.on("todoCreated", () => this.analytics.trackCreated());
    this.on("todoUpdated", () => this.analytics.trackUpdated());
    this.on("todoDeleted", () => this.analytics.trackDeleted());
    this.on("todoViewed", () => this.analytics.trackViewed());
    this.on("validationError", () => this.analytics.trackError());
    this.on("serverError", () => this.analytics.trackError());
  }

  initializeSampleData() {
    // TODO: Add sample todos for testing
    // 1. Create 2-3 sample todos with proper structure
    // 2. Include variety: completed/incomplete, different dates
    // 3. Set proper id sequence for new todos

    this.todos = [
      {
        id: 1,
        title: "Complete project documentation",
        description: "Write API documentation for all endpoints",
        completed: false,
        createdAt: new Date("2026-08-18T10:00:00.000Z"),
        updatedAt: new Date("2026-08-18T10:00:00.000Z"),
      },
      {
        id: 2,
        title: "Review pull requests",
        description: "Review and merge pending PRs from the team",
        completed: false,
        createdAt: new Date("2026-08-19T09:30:00.000Z"),
        updatedAt: new Date("2026-08-19T09:30:00.000Z"),
      },
      {
        id: 3,
        title: "Deploy to production",
        description: "Deploy v2.0.0 to production environment",
        completed: true,
        createdAt: new Date("2026-08-19T14:00:00.000Z"),
        updatedAt: new Date("2026-08-20T08:00:00.000Z"),
      },
    ];

    this.nextId = 4;

    console.log("Sample data initialized");
  }

  /**
   * Start the server
   */
  async start() {
    // TODO: create HTTP server and bind request handler
    // TODO: listen on this.port
    this.server = http.createServer((req, res) => {
      this._handleRequest(req, res);
    });

    this.server.listen(this.port, () => {
      console.log("=== Todo Server Started ===");
      console.log(`Server running on http://localhost:${this.port}`);
    });

    this.server.on("error", (error) => {
      this.emit("serverError", error);
    });
  }

  /**
   * Stop the server
   */
  async stop() {
    // TODO: stop the HTTP server if running
    if (this.server.listening) {
      this.server.close();
    }
  }

  /**
   * Handle incoming requests
   */
  async _handleRequest(req, res) {
    // TODO: implement CORS preflight handling
    // TODO: implement routes:
    // - /todos (GET, POST)
    // - /todos/:id (GET, PUT, DELETE)
    // - /analytics (GET)
    // - /events (GET)
    // TODO: emit events for CRUD, errors, validation, etc.
    // TODO: send JSON responses with proper status codes
    try {
      const parsedUrl = url.parse(req.url, true);
      const { pathname, query } = parsedUrl;
      const method = req.method;

      if (method === "GET") {
        if (pathname === "/todos") {
          this.getAllTodos(req, res, query);
          return;
        }

        if (pathname === "/analytics") {
          sendResponse(res, 200, {
            success: true,
            data: this.analytics.getStats(),
          });
          return;
        }

        if (pathname === "/events") {
          sendResponse(res, 200, {
            success: true,
            data: this.recentEvents,
          });
          return;
        }

        const idMatch = pathname.match(/^\/todos\/(\d+)$/);
        if (idMatch) {
          const params = parsePathParams("/todos/:id", pathname);

          this.getTodoById(req, res, params);

          return;
        }
      }

      if (method === "POST") {
        if (pathname === "/todos") {
          this.createTodo(req, res);
          return;
        }
      }

      if (method === "PUT") {
        if (pathname.includes("/todos/")) {
          const params = parsePathParams("/todos/:id", pathname);

          this.updateTodo(req, res, params);

          return;
        }
      }

      if (method === "DELETE") {
        if (pathname.includes("/todos/")) {
          const params = parsePathParams("/todos/:id", pathname);

          this.deleteTodo(req, res, params);

          return;
        }
      }

      if (method === "OPTIONS") {
        this.handleCORS(req, res);
        return;
      }

      sendResponse(res, 404, {
        success: false,
        error: "Unknown route",
      });
    } catch (error) {
      console.error("Request handling error:", error);
      sendResponse(res, 500, {
        success: false,
        error: "Internal server error",
      });
      this.emit("serverError", error);
    }
  }
  /**
   * Handle GET /todos - Get all todos with optional filtering
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} query - URL query parameters
   */
  async getAllTodos(req, res, query) {
    // TODO: Implement get all todos with filtering
    // 1. Get all todos from storage
    // 2. Apply completed filter if provided in query
    // 3. Return success response with data and count
    // 4. Handle query parameter validation
    let todos = this.todos;

    if (query.completed !== undefined) {
      const isCompleted = query.completed === "true";
      todos = todos.filter((todo) => todo.completed === isCompleted);
    }

    const count = todos.length;

    sendResponse(res, 200, {
      success: true,
      data: todos,
      count: count,
    });
    this.emit("todosListed", { count: todos.length, timestamp: nowISO() });
  }

  /**
   * Handle GET /todos/:id - Get specific todo by ID
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async getTodoById(req, res, params) {
    // TODO: Implement get todo by ID
    // 1. Extract ID from path parameters
    // 2. Find todo in storage
    // 3. Return 404 if not found
    // 4. Return success response with todo data
    // 5. Handle invalid ID format
    const { id } = params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid id parameter",
      });
      return;
    }

    const todo = this.todos.find((todo) => todo.id === numId);

    if (!todo) {
      sendResponse(res, 404, {
        success: false,
        error: `Todo with id ${numId} not found`,
      });
      this.emit("todoNotFound", {
        todoId: numId,
        operation: "getTodo",
        timestamp: nowISO(),
      });
      return;
    }

    sendResponse(res, 200, {
      success: true,
      data: todo,
    });
    this.emit("todoViewed", { todo, timestamp: nowISO() });
  }

  /**
   * Handle POST /todos - Create new todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async createTodo(req, res) {
    // TODO: Implement create new todo
    // 1. Parse request body
    // 2. Validate todo data
    // 3. Create new todo with generated ID and timestamps
    // 4. Add to storage
    // 5. Return 201 with created todo
    // 6. Handle validation errors

    try {
      const todo = await parseBody(req);
      const { isValid, errors } = validateTodo(todo);

      if (!isValid) {
        sendResponse(res, 400, {
          success: false,
          error: errors,
        });
        this.emit("validationError", { errors: errors, timestamp: nowISO() });
        return;
      }

      const now = new Date();

      const newTodo = {
        id: this.nextId,
        title: todo.title,
        description: todo.description,
        completed: todo.completed ?? false,
        createdAt: now,
        updatedAt: now,
      };

      this.nextId++;
      this.todos.push(newTodo);

      sendResponse(res, 201, {
        success: true,
        data: newTodo,
      });
      this.emit("todoCreated", { todo: newTodo, timestamp: nowISO() });
    } catch (error) {
      sendResponse(res, 400, {
        success: false,
        error: error,
      });
      this.emit("validationError", { errors: [error], timestamp: nowISO() });
      return;
    }
  }

  /**
   * Handle PUT /todos/:id - Update existing todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async updateTodo(req, res, params) {
    // TODO: Implement update existing todo
    // 1. Extract ID from path parameters
    // 2. Find existing todo
    // 3. Parse request body
    // 4. Validate update data
    // 5. Merge changes with existing todo
    // 6. Update timestamp
    // 7. Return updated todo
    // 8. Handle not found and validation errors

    try {
      const { id } = params;
      const numId = parseInt(id, 10);
      const todoIndex = this.todos.findIndex((todo) => todo.id === numId);

      if (todoIndex === -1) {
        sendResponse(res, 404, {
          success: false,
          error: `Todo with id ${numId} not found`,
        });
        this.emit("todoNotFound", {
          todoId: numId,
          operation: "updateTodo",
          timestamp: nowISO(),
        });
        return;
      }

      const todoData = await parseBody(req);
      const { isValid, errors } = validateTodo(todoData, true);

      if (!isValid) {
        sendResponse(res, 400, {
          success: false,
          error: errors,
        });
        this.emit("validationError", { errors: errors, timestamp: nowISO() });
        return;
      }

      const updatedTodo = {
        ...this.todos[todoIndex],
        ...todoData,
        updatedAt: new Date(),
      };

      this.todos[todoIndex] = updatedTodo;

      sendResponse(res, 200, {
        success: true,
        data: updatedTodo,
      });
      this.emit("todoUpdated", {
        newTodo: updatedTodo,
        changes: Object.keys(todoData),
        timestamp: nowISO(),
      });
    } catch (error) {
      sendResponse(res, 400, {
        success: false,
        error: error,
      });
      this.emit("validationError", { errors: [error], timestamp: nowISO() });
      return;
    }
  }

  /**
   * Handle DELETE /todos/:id - Delete todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async deleteTodo(req, res, params) {
    // TODO: Implement delete todo
    // 1. Extract ID from path parameters
    // 2. Find todo index in storage
    // 3. Return 404 if not found
    // 4. Remove from storage
    // 5. Return success message
    // 6. Handle invalid ID format
    const { id } = params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid id parameter",
      });
      return;
    }

    const todoIndex = this.todos.findIndex((todo) => todo.id === numId);
    const todoToDelete = this.todos[todoIndex];

    if (!todoToDelete) {
      sendResponse(res, 404, {
        success: false,
        error: `Todo with id ${numId} not found`,
      });
      this.emit("todoNotFound", {
        todoId: numId,
        operation: "deleteTodo",
        timestamp: nowISO(),
      });
      return;
    }

    this.todos.splice(todoIndex, 1);

    sendResponse(res, 200, {
      success: true,
      message: `Succesfully removed todo with id ${numId}`,
      data: todoToDelete,
    });
    this.emit("todoDeleted", { todo: todoToDelete, timestamp: nowISO() });
  }

  /**
   * Handle CORS preflight requests
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  handleCORS(req, res) {
    // TODO: Implement CORS preflight handling
    // 1. Set CORS headers
    // 2. Return 204 No Content
    // 3. Handle preflight request properly
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
    });
    res.end();
  }

  /**
   * Find todo by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {Object|null} Found todo or null
   */
  findTodoById(id) {
    // TODO: Implement find todo by ID
    // 1. Convert ID to number
    // 2. Search in todos array
    // 3. Return found todo or null
    // 4. Handle invalid ID format
    if (id === undefined || id === null) return null;

    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    return this.todos.find((todo) => todo.id === numId) || null;
  }

  /**
   * Find todo index by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {number} Todo index or -1 if not found
   */
  findTodoIndexById(id) {
    // TODO: Implement find todo index by ID
    // 1. Convert ID to number
    // 2. Find index in todos array
    // 3. Return index or -1 if not found

    const numId = parseInt(id, 10);
    const todoIndex = this.todos.findIndex((todo) => todo.id === numId);

    return todoIndex ?? -1;
  }

  /**
   * Generate next available ID
   * @returns {number} Next ID
   */
  generateNextId() {
    // TODO: Implement ID generation
    // 1. Return current nextId
    // 2. Increment nextId for next use
    // 3. Handle edge cases

    if (!Number.isSafeInteger(this.nextId + 1)) {
      throw new Error("Id exceeds safe range");
    }

    return this.nextId++;
  }
}

module.exports = { TodoServer };
