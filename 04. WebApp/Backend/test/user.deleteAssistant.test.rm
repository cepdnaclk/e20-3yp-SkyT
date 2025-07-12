import request from "supertest";
import app from "../src/app";

describe("DELETE /users", () => {
  it("Should return a error (invalid user)", async () => {
    const res = await request(app).delete("/users").send({ userId: "abc" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid user ID");
  });
});

describe("DELETE /users", () => {
  it("Should return a error (user not found)", async () => {
    const res = await request(app).delete("/users").send({ userId: 10 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });
});

/*describe("DELETE /users", () => {
  it("Should return a succes", async () => {
    const res = await request(app).delete("/users").send({ userId: 4 });

    expect(res.status).toBe(200);
    expect(res.body.error).toBe("User deleted successfully");
  });
});
*/
