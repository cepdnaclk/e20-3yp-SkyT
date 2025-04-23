import request from "supertest";
import app from "../src/app";

describe("GET lots/summary/:userId/:lotId", () => {
  it("Should return a error (invalid user)", async () => {
    const res = await request(app).get("/lots/summary/abc/1").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("GET lots/summary/:userId/:lotId", () => {
  it("Should return a error (invalid lotId)", async () => {
    const res = await request(app).get("/lots/summary/2/kkd").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("GET lots/summary/:userId/:lotId", () => {
  it("Should return a error (invalid lotId and userId)", async () => {
    const res = await request(app).get("/lots/summary/ddd/kkd").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("GET lots/summary/:userId/:lotId", () => {
  it("Should return a error (user not found)", async () => {
    const res = await request(app).get("/lots/summary/10/5").send();

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Lot not found");
  });
});

describe("GET lots/summary/:userId/:lotId", () => {
  it("Should return a success", async () => {
    const res = await request(app).get("/lots/summary/2/2").send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Lot data found successfully");
    expect(res.body.latest).toBeDefined();
    expect(res.body.center).toBeDefined();
    expect(res.body.latestImage).toBeDefined();
    expect(res.body.taskList).toBeDefined();
  });
});
