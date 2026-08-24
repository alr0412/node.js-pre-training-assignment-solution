const http = require("http");
const { title } = require("process");
const url = require("url");

/**
 * Todo REST API Server
 * Built with Node.js built-in HTTP module
 * Supports full CRUD operations with in-memory storage
 */

/**
 * Parse JSON request body from HTTP request
 * @param {IncomingMessage} req - HTTP request object
 * @returns {Promise<Object>} Parsed JSON data
 */
function parseBody(req) {
  // TODO: Implement async JSON body parsing
  // 1. Create promise to handle async data streaming
  // 2. Listen for 'data' events to collect chunks
  // 3. Listen for 'end' event to parse complete body
  // 4. Handle JSON parsing errors gracefully
  // 5. Return empty object if no body provided

  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString("utf8");
    });

    req.on("end", () => {
      try {
        if (body.trim()) {
          const data = JSON.parse(body);
          resolve(data);
        }

        resolve({});
      } catch (error) {
        reject(error);
      }
    });
  });
}

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

/**
 * TodoServer Class - Main HTTP server for Todo API
 */
class TodoServer {
  constructor(port = 3000) {
    // TODO: Initialize server properties
    // 1. Set port number
    // 2. Initialize empty todos array
    // 3. Set nextId counter for new todos
    // 4. Initialize with sample data

    this.port = port;
    this.todos = [];
    this.nextId = 1;

    // Sample todos for testing
    this.initializeSampleData();
  }

  /**
   * Initialize server with sample todo data
   */
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
   * Start the HTTP server
   */
  start() {
    // TODO: Create and start HTTP server
    // 1. Create HTTP server with request handler
    // 2. Listen on specified port
    // 3. Log server startup message
    // 4. Handle server errors

    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.listen(this.port, () => {
      console.log("=== Todo Server Started ===");
      console.log(`Server running on http://localhost:${this.port}`);
    });

    server.on("error", (error) => {
      console.error("Server error: ", error.message);
    });
  }

  /**
   * Main request handler - routes requests to appropriate methods
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async handleRequest(req, res) {
    // TODO: Implement main request routing
    // 1. Parse URL and extract pathname, query
    // 2. Route based on HTTP method and path pattern
    // 3. Handle CORS preflight requests (OPTIONS)
    // 4. Call appropriate handler method
    // 5. Handle unknown routes with 404

    try {
      const parsedUrl = url.parse(req.url, true);
      const { pathname, query } = parsedUrl;
      const method = req.method;

      // Route to appropriate handler based on method and path
      // GET /todos -> getAllTodos
      // GET /todos/:id -> getTodoById
      // POST /todos -> createTodo
      // PUT /todos/:id -> updateTodo
      // DELETE /todos/:id -> deleteTodo
      // OPTIONS -> handleCORS
      if (method === "GET") {
        if (pathname === "/todos") {
          this.getAllTodos(req, res, query);
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
      return;
    }

    sendResponse(res, 200, {
      success: true,
      data: todo,
    });
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

    const todo = await parseBody(req);

    const { isValid, errors } = validateTodo(todo);

    if (!isValid) {
      sendResponse(res, 400, {
        success: false,
        error: errors,
      });
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
    const { id } = params;
    const numId = parseInt(id, 10);
    const todoIndex = this.todos.findIndex((todo) => todo.id === numId);

    if (todoIndex === -1) {
      sendResponse(res, 404, {
        success: false,
        error: `Todo with id ${numId} not found`,
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
      return;
    }

    this.todos.splice(todoIndex, 1);

    sendResponse(res, 200, {
      success: true,
      message: `Succesfully removed todo with id ${numId}`,
      data: todoToDelete,
    });
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

    sendResponse(res, 204, {});
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

// Export the TodoServer class
module.exports = TodoServer;

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  // Start server for testing
  const server = new TodoServer(3000);
  server.start();

  console.log("🚀 Todo Server starting...");
  console.log("📝 Replace TODO comments with implementation");
  console.log("🧪 Run task-04-test.js to verify functionality");
}

// If this file is run directly, start the server
if (require.main === module) {
  const server = new TodoServer(3000);
  server.start();
}
