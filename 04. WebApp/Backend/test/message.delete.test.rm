import request from "supertest";
import app from "../src/app";

describe("DELETE /notify", () => {
  it("Should return a error (invalid user)", async () => {
    const res = await request(app)
      .delete("/notify")
      .send({ userId: "abc", msgId: 5 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("DELETE /notify", () => {
  it("Should return a error (invalid msgId)", async () => {
    const res = await request(app)
      .delete("/notify")
      .send({ userId: 2, msgId: "pqr" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("DELETE /notify", () => {
  it("Should return a error (invalid user & msg)", async () => {
    const res = await request(app)
      .delete("/notify")
      .send({ userId: "abc", msgId: "pqr" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });
});

describe("DELETE /notify", () => {
  it("Should return a error (no message deleted)", async () => {
    const res = await request(app)
      .delete("/notify")
      .send({ userId: 10, msgId: 5 });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Fail to delete user");
  });
});

/*describe("DELETE /notify", () => {
  it("Should return a succes", async () => {
    const res = await request(app)
      .delete("/notify")
      .send({ userId: 2, msgId: 5 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Message deleted successfully");
  });
});*/
