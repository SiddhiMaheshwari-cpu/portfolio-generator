import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import  app  from "../app";
import { prisma } from "../lib/prisma";

const stamp = Date.now();
const alice = { email: `alice-${stamp}@test.dev`, password: "password123", name: "Alice" };
const bob = { email: `bob-${stamp}@test.dev`, password: "password123", name: "Bob" };

let aliceToken = "";
let portfolioId = "";

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: [alice.email, bob.email] } } });
  await prisma.$disconnect();
});

describe("auth", () => {
  it("registers a user without leaking the password hash", async () => {
    const res = await request(app).post("/auth/register").send(alice);
    expect(res.status).toBe(201);
    expect(res.body.email).toBe(alice.email);
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  it("rejects a duplicate email", async () => {
    const res = await request(app).post("/auth/register").send(alice);
    expect(res.status).toBe(409);
  });

  it("rejects a short password", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: `short-${stamp}@test.dev`, password: "123" });
    expect(res.status).toBe(400);
  });

  it("logs in and returns a token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: alice.email, password: alice.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    aliceToken = res.body.token;
  });

  it("rejects a wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: alice.email, password: "wrongpassword" });
    expect(res.status).toBe(401);
  });

  it("protects /auth/me", async () => {
    const noToken = await request(app).get("/auth/me");
    expect(noToken.status).toBe(401);

    const withToken = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${aliceToken}`);
    expect(withToken.status).toBe(200);
    expect(withToken.body.email).toBe(alice.email);
  });
});

describe("portfolio ownership", () => {
  it("lets the owner create a portfolio and shows it publicly", async () => {
    const slug = `alice-${stamp}`;
    const create = await request(app)
      .post("/portfolios")
      .set("Authorization", `Bearer ${aliceToken}`)
      .send({ title: "Alice Portfolio", slug });
    expect(create.status).toBe(201);
    portfolioId = create.body.id;

    const pub = await request(app).get(`/p/${slug}`);
    expect(pub.status).toBe(200);
    expect(pub.body).not.toHaveProperty("userId");
  });

  it("hides the portfolio from another user", async () => {
    await request(app).post("/auth/register").send(bob);
    const login = await request(app)
      .post("/auth/login")
      .send({ email: bob.email, password: bob.password });
    const bobToken = login.body.token;

    const read = await request(app)
      .get(`/portfolios/${portfolioId}`)
      .set("Authorization", `Bearer ${bobToken}`);
    expect(read.status).toBe(404);

    const del = await request(app)
      .delete(`/portfolios/${portfolioId}`)
      .set("Authorization", `Bearer ${bobToken}`);
    expect(del.status).toBe(404);
  });
});