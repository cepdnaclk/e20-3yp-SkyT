import request from "supertest";
import app from "../src/app";

describe("POST /api/users", () => {
  it("should create a user and return 201", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@example.com",
        fName: "Test",
        lName: "User",
        role: "Admin",
        estates: ["1", "2"],
      });

    expect(res.status).toBe(201);
    expect(res.body).toBe("User created successfully!");
  });
});
