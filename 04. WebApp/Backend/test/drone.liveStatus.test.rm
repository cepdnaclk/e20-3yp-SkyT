import request from "supertest";
import app from "../src/app";

describe("GET drones/:userId/:estate.id", () => {
  it("Should return a error (invalid user)", async () => {
    const res = await request(app).get("/drones/abc/3").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Required fields missing");
  });
});

describe("GET drones/:userId/:estate.id", () => {
  it("Should return a error (invalid estate)", async () => {
    const res = await request(app).get("/drones/2/abc").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Required fields missing");
  });
});

describe("GET drones/:userId/:estate.id", () => {
  it("Should return a error (invalid user and estate)", async () => {
    const res = await request(app).get("/drones/abc/pqr").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Required fields missing");
  });
});

describe("GET drones/:userId/:estate.id", () => {
  it("Should return a error (user not found)", async () => {
    const res = await request(app).get("/drones/10/3").send();

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Access denied to the estate");
  });
});

describe("GET drones/:userId/:estate.id", () => {
  it("Should return a success", async () => {
    const res = await request(app).get("/drones/2/3").send();

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});
