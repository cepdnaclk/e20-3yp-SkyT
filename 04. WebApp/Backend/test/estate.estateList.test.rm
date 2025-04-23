import request from "supertest";
import app from "../src/app";

describe("GET /estates/list/:userId", () => {
  it("should return an error (user ID is missing or invalid)", async () => {
    const res = await request(app).get("/estates/list/abc");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid user ID");
  });
});

describe("GET /estates/list/:userId", () => {
  it("should return an error (manager without estates)", async () => {
    const res = await request(app).get("/estates/list/10");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Estates not found");
  });
});

describe("GET /estates/list/:userId", () => {
  it("Should return a success", async () => {
    const res = await request(app).get("/estates/list/2").send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Estates found successfully");
    expect(res.body.estates).toBeDefined();
  });
});
