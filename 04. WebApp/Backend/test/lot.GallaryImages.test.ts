import request from "supertest";
import app from "../src/app";

describe("GET /images/:userId/:lotId/:lastId", () => {
  it("Should return a error (invalid user)", async () => {
    const res = await request(app).get("/lots/images/abc/1/-1").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("GET /images/:userId/:lotId/:lastId", () => {
  it("Should return a error (invalid lotId)", async () => {
    const res = await request(app).get("/lots/images/2/kkd/-1").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("GET /images/:userId/:lotId/:lastId", () => {
  it("Should return a error (invalid lastId)", async () => {
    const res = await request(app).get("/lots/images/2/2/abc").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("GET /images/:userId/:lotId/:lastId", () => {
  it("Should return a error (invalid lotId, userId, and lastId)", async () => {
    const res = await request(app).get("/lots/images/ddd/kkd/dkp").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("GET /images/:userId/:lotId/:lastId", () => {
  it("Should return a error (No images)", async () => {
    const res = await request(app).get("/lots/images/10/5/-1").send();

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Lot not found");
  });
});

describe("GET /images/:userId/:lotId/:lastId", () => {
  it("Should return a success", async () => {
    const res = await request(app).get("/lots/images/2/2/-1").send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Images got successfully.");
    expect(res.body.imageList).toBeDefined();
  });
});
