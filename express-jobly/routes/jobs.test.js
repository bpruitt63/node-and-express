"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u4Token
} = require("./_testCommon");
const Job = require("../models/job");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);



const newJob = {
    title: "new",
    salary: 30000,
    equity: 0,
    companyHandle: "c1"
  };

/************************************** POST /jobs */

describe("POST /jobs", function () {

  test("not ok for regular users", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("ok for admin", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u4Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "new",
        salary: 30000,
        equity: "0",
        companyHandle: "c1"
      }
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          salary: 99999,
          equity: 0,
        })
        .set("authorization", `Bearer ${u4Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
            title: "new",
            salary: "one huned",
            equity: 0,
            companyHandle: "c1"
        })
        .set("authorization", `Bearer ${u4Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
          [
            {
                id: expect.any(Number),
                title: "j1",
                salary: 30000,
                equity: "0",
                companyHandle: "c1"
            },
            {
                id: expect.any(Number),
                title: "j2",
                salary: 350000,
                equity: "0.7",
                companyHandle: "c1"
            }
          ],
    });
  });

  test("ok for filter", async function(){
    const resp = await request(app).get("/jobs?minSalary=20000&hasEquity=true&title=j");
    expect(resp.body).toEqual({
      jobs: [
            {
                id: expect.any(Number),
                title: "j2",
                salary: 350000,
                equity: "0.7",
                companyHandle: "c1"
            },
          ]
    });
  })
})

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const newJ = await Job.create(newJob);
    const resp = await request(app).get(`/jobs/${newJ.id}`);
    expect(resp.body).toEqual({
      job: {
            id: expect.any(Number),
            title: "new",
            salary: 30000,
            equity: "0",
            companyHandle: "c1"
        }
      });
    });
  

  test("not found for no such company", async function () {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
  test("works for admin", async function () {
    const newJ = await Job.create(newJob)
    const resp = await request(app)
        .patch(`/jobs/${newJ.id}`)
        .send({
          title: "newer",
        })
        .set("authorization", `Bearer ${u4Token}`);
    expect(resp.body).toEqual({
        job: {
            id: expect.any(Number),
            title: "newer",
            salary: 30000,
            equity: "0",
            companyHandle: "c1"
      },
    });
  });

  test("unauth for regular users", async function () {
    const newJ = await Job.create(newJob)
    const resp = await request(app)
        .patch(`/jobs/${newJ.id}`)
        .send({
          title: "newest",
        })
        .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const newJ = await Job.create(newJob);
    const resp = await request(app)
        .patch(`/jobs/${newJ.id}`)
        .send({
          title: "isaac new-ton",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such job", async function () {
    const resp = await request(app)
        .patch(`/jobs/0`)
        .send({
          title: "new nope",
        })
        .set("authorization", `Bearer ${u4Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on companyHandle change attempt", async function () {
    const newJ = await Job.create(newJob);
    const resp = await request(app)
        .patch(`/jobs/${newJ.id}`)
        .send({
          companyHandle: "c2",
        })
        .set("authorization", `Bearer ${u4Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const newJ = await Job.create(newJob);
    const resp = await request(app)
        .patch(`/jobs/${newJ.id}`)
        .send({
          equity: "not-a-number",
        })
        .set("authorization", `Bearer ${u4Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
  test("works for admin", async function () {
    const newJ = await Job.create(newJob);
    const resp = await request(app)
        .delete(`/jobs/${newJ.id}`)
        .set("authorization", `Bearer ${u4Token}`);
    expect(resp.body).toEqual({ deleted: `${newJ.id}` });
  });

  test("unauth for regular users", async function () {
    const newJ = await Job.create(newJob);
    const resp = await request(app)
        .delete(`/jobs/${newJ.id}`)
        .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const newJ = await Job.create(newJob);
    const resp = await request(app)
        .delete(`/jobs/${newJ.id}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such job", async function () {
    const resp = await request(app)
        .delete(`/jobs/0`)
        .set("authorization", `Bearer ${u4Token}`);
    expect(resp.statusCode).toEqual(404);
  });
})