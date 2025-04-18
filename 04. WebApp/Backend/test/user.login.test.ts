import request from "supertest";
import app from "../src/app";

describe("POST /users/login", () => {
  it("Should return a error (email is empty)", async () => {
    const res = await request(app).post("/users/login").send({
      email: "",
      password: "QrO3d+31SQ",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email and password are required");
  });
});

describe("POST /users/login", () => {
  it("Should return a error (password is empty)", async () => {
    const res = await request(app).post("/users/login").send({
      email: "testuser1@example.com",
      password: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email and password are required");
  });
});

describe("POST /users/login", () => {
  it("Should return a error (email and password are empty)", async () => {
    const res = await request(app).post("/users/login").send({
      email: "",
      password: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email and password are required");
  });
});

describe("POST /users/login", () => {
  it("Should return a error (user does not exist)", async () => {
    const res = await request(app).post("/users/login").send({
      email: "testuser10@example.com",
      password: "QrO3d+31SQ",
    });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });
});

describe("POST /users/login", () => {
  it("Should return a error (invalid password)", async () => {
    const res = await request(app).post("/users/login").send({
      email: "testuser3@example.com",
      password: "QrO3d+831SQ",
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid password");
  });
});

describe("POST /users/login", () => {
  it("Should return a success message", async () => {
    const res = await request(app).post("/users/login").send({
      email: "testuser3@example.com",
      password: "QrO3d+31SQ",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
  });
});
