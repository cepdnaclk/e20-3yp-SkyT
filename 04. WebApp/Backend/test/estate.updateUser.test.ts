import request from "supertest";
import app from "../src/app";

describe("PATCH /estates", () => {
  it("Should return a error (empty userId)", async () => {
    const res = await request(app)
      .patch("/estates")
      .send({
        id: "abc",
        estates: [1, 2, 3],
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("PATCH /estates", () => {
  it("Should return a error (empty estates)", async () => {
    const res = await request(app).patch("/estates").send({
      id: 3,
      estates: [],
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("PATCH /estates", () => {
  it("Should return a error (empty id, estates)", async () => {
    const res = await request(app).patch("/estates").send({
      id: "null",
      estates: [],
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("PATCH /estates", () => {
  it("Should return a error (user not found)", async () => {
    const res = await request(app)
      .patch("/estates")
      .send({
        id: 10,
        estates: [1, 2, 3],
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Employee not found!");
  });
});

describe("PATCH /estates", () => {
  it("Should return a success", async () => {
    const res = await request(app)
      .patch("/estates")
      .send({
        id: 3,
        estates: [1, 2, 3],
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Estates updated successfully");
  });
});
