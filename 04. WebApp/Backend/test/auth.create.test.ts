import request from "supertest";
import app from "../src/app";

describe("POST /auth/create", () => {
  it("Should return a error (email is empty)", async () => {
    const res = await request(app).post("/auth/create").send({
      email: "",
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Email required");
  });
});

describe("POST /auth/create", () => {
  it("Should return a error (invalid email)", async () => {
    const res = await request(app).post("/auth/create").send({
      email: "testuser10@example.com",
    });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Email not found");
  });
});

describe("POST /auth/create", () => {
  it("Should return a success", async () => {
    const res = await request(app).post("/auth/create").send({
      email: "econductorinfo@gmail.com",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Password reset link sent to email.");
  });
});
