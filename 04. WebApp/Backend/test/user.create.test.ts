import request from "supertest";
import app from "../src/app";

describe("POST /users", () => {
  it("Should return a error (user already exist)", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        email: "testuser@example.com",
        fName: "Test",
        lName: "User",
        role: "Maintain",
        estates: ["1", "2"],
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("User with this email already exists");
  });
});

/* describe("POST /users", () => {
  it("Should create a user and return 201", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        email: "testuser4@example.com",
        fName: "Test",
        lName: "User",
        role: "Maintain",
        estates: ["1", "2"],
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User created successfully!");
  });
}); */
