import request from "supertest";
import app from "../src/app";

describe("GET /users/:userId", () => {
  it("Should return a error (invalid user)", async () => {
    const res = await request(app).get("/users/abc").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid user ID");
  });
});

describe("GET /users/:userId", () => {
  it("Should return a error (user not found)", async () => {
    const res = await request(app).get("/users/10").send();

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });
});

describe("GET /users/:userId", () => {
  it("Should return a success", async () => {
    const res = await request(app).get("/users/2").send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User found successfully");
    expect(res.body.result).toBeDefined();
  });
});
