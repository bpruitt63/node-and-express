"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


const newJob = {
    title: 'newj',
    salary: 30000,
    equity: .5,
    companyHandle: 'c1'
  };

  const newJob2 = {
    title: 'newj2',
    salary: 50000,
    equity: .6,
    companyHandle: 'c190'
  };

  const newJob3 = {
    title: 'newj3',
    salary: -10,
    equity: 2.6,
    companyHandle: 'c1'
  };

  const newJob4 = {
    title: 'newj4',
    salary: 32000,
    equity: 0,
    companyHandle: 'c1'
  };

/************************************** create */

describe("create", function () {
  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
        id: expect.any(Number),
        title: 'newj',
        salary: 30000,
        equity: '0.5',
        companyHandle: 'c1'
    });

    const result = await db.query(
          `SELECT id, title, salary, company_handle AS "companyHandle", equity
           FROM jobs
           WHERE title = '${job.title}'`);
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        title: 'newj',
        salary: 30000,
        equity: '0.5',
        companyHandle: 'c1'
      }
    ]);
  });

  test("fails with bad data", async function () {
    try {
        await Job.create(newJob3);
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });

  test("not found error with bad companyHandle", async function () {
    try {
      await Job.create(newJob2);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "J1",
        salary: 40000,
        equity: '0.75',
        companyHandle: 'c1'
      }
    ]);
  });
});

/************************************** filter */

describe("filter", function(){
  test("works", async function(){
    await Job.create(newJob4);
    const query = {"minSalary": 20000, "hasEquity": "true", "title": "j"};
    const jobs = await Job.filter(query);
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "J1",
        salary: 40000,
        equity: '0.75',
        companyHandle: 'c1'
      }
    ])
  })

  test("fails with bad data", async function(){
    const query = {"minSalary": 20000, "hasEquity": "true", "turtle": "j"};
    try {
      await Job.filter(query);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  })
})

/************************************** get */

describe("get", function () {
  test("works", async function () {
    const newj = await Job.create(newJob);
    const job = await Job.get(newj.id);
    expect(job).toEqual({
      id: newj.id,
      title: "newj",
      salary: 30000,
      equity: '0.5',
      companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if id NaN", async function () {
    try {
      await Job.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "Update",
    salary: 3500,
    equity: '0.1'
  };

  test("works", async function () {
    const newJ = await Job.create(newJob);
    const job = await Job.update(newJ.id, updateData);
    expect(job).toEqual({
      id: newJ.id,
      ...updateData,
      companyHandle: 'c1'
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle as "companyHandle"
           FROM jobs
           WHERE id = ${newJ.id}`);
    expect(result.rows).toEqual([{
      id: newJ.id,
      title: "Update",
      salary: 3500,
      equity: '0.1',
      companyHandle: "c1",
    }]);
  });

  test("works: null fields", async function () {
    const newJ = await Job.create(newJob);
    const updateDataSetNulls = {
      title: "New",
      salary: null,
      equity: null,
    };

    let job = await Job.update(newJ.id, updateDataSetNulls);
    expect(job).toEqual({
      id: newJ.id,
      ...updateDataSetNulls,
      companyHandle: "c1"
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           WHERE id = ${newJ.id}`);
    expect(result.rows).toEqual([{
      id: newJ.id,
      title: "New",
      salary: null,
      equity: null,
      companyHandle: "c1"
    }]);
  });

  test("can't update companyHandle", async function () {
    const newJ = await Job.create(newJob);
    const updateHandle = {
      title: "New",
      salary: 100000000,
      equity: .9,
      companyHandle: "c2"
    };

    try {
      await Job.update(newJ.id, updateHandle);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    const newJ = await Job.create(newJob);
    try {
      await Job.update(newJ.id, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("bad request if id NaN", async function () {
    try {
      await Job.update("nope");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    let job = await Job.create(newJob);
    await Job.remove(job.id);
    const res = await db.query(
        `SELECT id FROM jobs WHERE id=${job.id}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if id NaN", async function () {
    try {
      await Job.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
