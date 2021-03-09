const { BadRequestError } = require("../expressError");

/**  Transforms data into SQLable format for update functions.
 Data keys become "key1=$1, key2=$2, etc"
 Values become [value1, value2, etc] */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/**  Transforms data into SQLable format for GET all filtered functions.
 Query data keys become "key1(operator)$1, key2(operator)$2, etc"
 Values become [value1, value2, etc] */

function sqlForFilter(query){
    const keys = Object.keys(query);

    let cols = [];
    let values = [];

    for (let i = 0; i < keys.length; i++){
      if (keys[i] === "name"){
        cols.push(`${keys[i]} ILIKE $${i + 1}`)
        values.push(`%${query.name}%`)
      }
      if (keys[i] === "minEmployees"){
        cols.push(`num_employees >= $${i + 1}`)
        values.push(parseInt(query.minEmployees))
      }
      if (keys[i] === "maxEmployees"){
        cols.push(`num_employees <= $${i + 1}`)
        values.push(parseInt(query.maxEmployees))
      }
      if (keys[i] === "title"){
        cols.push(`${keys[i]} ILIKE $${i + 1}`)
        values.push(`%${query.title}%`)
      }
      if (keys[i] === "minSalary"){
        cols.push(`salary >= $${i + 1}`)
        values.push(parseInt(query.minSalary))
      }
      if ((keys[i] === "hasEquity") && (query.hasEquity === 'true')){
        cols.push(`equity > $${i + 1}`)
        values.push(0)
      }
    }
    
    return {
      cols: cols.join(" AND "),
      values: values,
    };
}

/** checks for valid query data in company filter function */

function checkCompanyQuery(query){
    const keys = Object.keys(query);

    //throw error if query includes non-allowed fields
    for (let key of keys){
      if (key !== "name" && key !== "minEmployees" && key !== "maxEmployees"){
        throw new BadRequestError(`Value not found: ${key}`)
      }
    }

    //throw error if min or max employees is not a number
    if ((query.minEmployees && isNaN(parseInt(query.minEmployees))) || 
          (query.maxEmployees && isNaN(parseInt(query.maxEmployees)))){
      throw new BadRequestError("min and maxEmployees must be numbers")
    }

    //throw error if minEmployees is greater than maxEmployees
    if (query.minEmployees && query.maxEmployees && 
          (parseInt(query.minEmployees) > parseInt(query.maxEmployees))){
      throw new BadRequestError(`maxEmployees must be greater than minEmployees`)
    }
}

/** checks for valid query data in job filter function */

function checkJobQuery(query){
  const keys = Object.keys(query);

  //throw error if query includes non-allowed fields
  for (let key of keys){
    if (key !== "title" && key !== "minSalary" && key !== "hasEquity"){
      throw new BadRequestError(`Value not found: ${key}`)
    }
  }

  //throw error if minSalary is not a number
  if (query.minSalary && isNaN(parseInt(query.minSalary))){
    throw new BadRequestError("minSalary must be a number")
  }

  //throw error if hasEquity is not true or false
  if (query.hasEquity && (query.hasEquity !== "true") && (query.hasEquity !== "false")){
    throw new BadRequestError(`hasEquity must be true or false`)
  }
}

module.exports = { sqlForPartialUpdate, 
                  sqlForFilter, 
                  checkCompanyQuery, 
                  checkJobQuery };
