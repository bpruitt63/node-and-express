"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlForFilter, checkJobQuery } = require("../helpers/sql");

/** Related functions for jobs. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if company not in database.
   * */

  static async create({ title, salary, equity, companyHandle }) {
    if ((typeof(salary) !== 'number') || (salary < 0)) {
      throw new BadRequestError('Salary must be positive number')
    }
    if ((typeof(equity) !== 'number') || (equity > 1)) {
      throw new BadRequestError('Equity must be a number less than one')
    }
    const companyCheck = await db.query(
          `SELECT handle
           FROM companies
           WHERE handle = $1`,
        [companyHandle]);

    if (!companyCheck.rows[0])
      throw new NotFoundError(`Company not found: ${companyHandle}`);

    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, company_handle AS "companyHandle", equity`, 
        [
          title,
          salary,
          equity,
          companyHandle,
        ]
    );

    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   *
   * Returns [{ id, title, salary, equity, companyHandle }, ...]
   * */

  static async findAll() {
    const jobsRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           ORDER BY title`);
    return jobsRes.rows;
  }

  /** Finds all jobs filtered by query string 
   * Returns [{ id, title, salary, equity, companyHandle }, ...]
  */

  static async filter(query){
    checkJobQuery(query);
    const { cols, values } = sqlForFilter(query);
    const jobsRes = await db.query(
          `SELECT id, 
                  title, 
                  salary, 
                  equity, 
                  company_handle AS "companyHandle" 
            FROM jobs 
            WHERE ${cols} 
            ORDER BY title`,
            values);
    return jobsRes.rows
  }

  /** Given a job id, return data about job.
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {

    if (typeof(id) !== "number") throw new BadRequestError('ID must be a number')
    
    const jobRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`, 
          [id]);
    
    const job = jobRes.rows[0];
      
    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity, companyHandle}
   *
   * Throws NotFoundError if not found, BadRequestError if updating protected fields.
   */

  static async update(id, data) {

    if (typeof(id) !== "number") throw new BadRequestError('ID must be a number')
    if (data.id || data.companyHandle) throw new BadRequestError("Invalid update fields")
    
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const handleVarIdx = "$" + (values.length + 1);
    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${handleVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity, 
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {

    if (typeof(id) !== "number") throw new BadRequestError('ID must be a number')
    
    const result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);
  }
}


module.exports = Job;
