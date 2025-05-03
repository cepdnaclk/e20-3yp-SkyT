import request from "supertest";
import app from "../src/app";

describe("GET notify/:userId", () => {
  it("Should return a error (invalid user)", async () => {
    const res = await request(app).get("/notify/abc").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("GET notify/:userId", () => {
  it("Should return a error (user not found)", async () => {
    const res = await request(app).get("/notify/10").send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Notifications get successfully");
    expect(res.body.notifications).toHaveLength(0);
  });
});

describe("GET notify/:userId", () => {
  it("Should return a success", async () => {
    const res = await request(app).get("/notify/2").send();

    expect(res.status).toBe(200);
    expect(res.body.notifications).toBeDefined();
  });
});
