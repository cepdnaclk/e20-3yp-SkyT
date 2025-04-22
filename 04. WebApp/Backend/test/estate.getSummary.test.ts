import request from "supertest";
import app from "../src/app";

describe("POST /estates/", () => {
  it("should return an error (user ID is missing or invalid)", async () => {
    const res = await request(app).post("/estates/").send({
      userId: "abc",
      estateId: 1,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("POST /estates/", () => {
  it("should return an error (estate ID is missing or invalid)", async () => {
    const res = await request(app).post("/estates/").send({
      userId: 3,
      estateId: "abc",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("POST /estates/", () => {
  it("should return an error (ACCESS DENIED)", async () => {
    const res = await request(app).post("/estates/").send({
      userId: 3,
      estateId: 4,
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid user or estate");
  });
});

describe("POST /estates/", () => {
  it("Should return a success", async () => {
    const res = await request(app).post("/estates/").send({
      userId: 2,
      estateId: 2,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Summary get successfully.");
    expect(res.body.office).toBeDefined();
    expect(res.body.summary).toBeDefined();
  });
});
