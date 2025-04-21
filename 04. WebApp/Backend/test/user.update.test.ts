import request from "supertest";
import app from "../src/app";

describe("PATCH /users", () => {
  it("Should return a error (missing userId)", async () => {
    const res = await request(app)
      .patch("/users")
      .field(
        "usreInfo",
        JSON.stringify({
          userId: "abc",
          fName: "John",
          lName: "Doe",
          email: "john@example.com",
        })
      );

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});
