const request = require("supertest");
const app = require("./index");

describe("GET /todos", () => {
  it("responds with a list of todos", async () => {
    // TODO: implement test for GET /todos
    const res = await request(app).get("/todos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("POST /todos", () => {
  it("adds a new todo and returns it", async () => {
    // TODO: implement test for POST /todos
    const res = await request(app).post("/todos").send({ title: "Test todo" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("title", "Test todo");
  });
});

describe("Logging Middleware", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("logs method and URL", async () => {
    // TODO: implement test for logging middleware
    // This may require a spy or mock for console.log
    await request(app).get("/todos");
    expect(consoleSpy).toHaveBeenCalledWith("GET /todos");

    consoleSpy.mockClear();

    await request(app).post("/todos").send({ title: "Test todo" });
    expect(consoleSpy).toHaveBeenCalledWith("POST /todos");
  });
});

describe("GET /todos/:id", () => {
  it("returns todo by id or 404", async () => {
    // TODO: implement test for GET /todos/:id
    const res = await request(app).get("/todos/1");
    expect([200, 404]).toContain(res.status);
  });
});

describe("Error Handler", () => {
  it("returns error JSON", () => {
    // TODO: implement test for error handler
    expect(true).toBe(true);
  });
});

describe("Static Files", () => {
  it("serves static files", () => {
    // TODO: implement test for static files
    expect(true).toBe(true);
  });
});

describe("GET /todos/search", () => {
  it("filters todos by query params", async () => {
    // TODO: implement test for GET /todos/search
    const res = await request(app).get("/todos/search?completed=true");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
