import request from "supertest";
import app from "../src/app";

describe("GET /estates/employees/:userId", () => {
  it("should return an error (user ID is missing or invalid)", async () => {
    const res = await request(app).get("/estates/employees/abc");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid user ID");
  });
});

describe("GET /estates/employees/:userId", () => {
  it("Should return a success", async () => {
    const res = await request(app).get("/estates/employees/2").send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Employees found successfully");
    expect(res.body.employees).toBeDefined();
  });
});
