import request from "supertest";
import app from "../src/app";

describe("GET /tasks/:userId/:estateId", () => {
  it("Should return a error (invalid user)", async () => {
    const res = await request(app).get("/tasks/abc/3").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Required fields missing");
  });
});

describe("GET /tasks/:userId/:estateId", () => {
  it("Should return a error (invalid estate)", async () => {
    const res = await request(app).get("/tasks/2/abc").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Required fields missing");
  });
});

describe("GET /tasks/:userId/:estateId", () => {
  it("Should return a error (invalid user and estate)", async () => {
    const res = await request(app).get("/tasks/abc/pqr").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Required fields missing");
  });
});

describe("GET /tasks/:userId/:estateId", () => {
  it("Should return a error (user not found)", async () => {
    const res = await request(app).get("/tasks/10/3").send();

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid user or estate");
  });
});

describe("GET /tasks/:userId/:estateId", () => {
  it("Should return a success", async () => {
    const res = await request(app).get("/tasks/2/3").send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Data got successfully.");
    expect(res.body.office).toBeDefined();
    expect(res.body.lots).toBeDefined();
    expect(res.body.tasks).toBeDefined();
  });
});
