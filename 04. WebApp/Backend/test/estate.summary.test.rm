import request from "supertest";
import app from "../src/app";

describe("GET /estates/summary/:userId/:estateId", () => {
  it("Should return a error (invalid user)", async () => {
    const res = await request(app).get("/estates/summary/abc/1").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid user ID or estate");
  });
});

describe("GET /estates/summary/:userId/:estateId", () => {
  it("Should return a error (invalid estateId)", async () => {
    const res = await request(app).get("/estates/summary/2/kkd").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid user ID or estate");
  });
});

describe("GET /estates/summary/:userId/:estateId", () => {
  it("Should return a error (invalid estateId and userId)", async () => {
    const res = await request(app).get("/estates/summary/abg/kkd").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid user ID or estate");
  });
});

describe("GET /estates/summary/:userId/:estateId", () => {
  it("Should return a error (No images)", async () => {
    const res = await request(app).get("/estates/summary/10/5").send();

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Estates not found");
  });
});

describe("GET /images/:userId/:lotId/:lastId", () => {
  it("Should return a success", async () => {
    const res = await request(app).get("/estates/summary/2/2").send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Estates found successfully");
    expect(res.body.office).toBeDefined();
    expect(res.body.lots).toBeDefined();
    expect(res.body.drones).toBeDefined();
  });
});
