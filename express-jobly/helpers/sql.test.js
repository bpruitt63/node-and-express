const { sqlForPartialUpdate, sqlForFilter, checkCompanyQuery, checkJobQuery } = require("./sql");


const jsToSql = {
    numEmployees: "num_employees",
    logoUrl: "logo_url",
  }

describe("sqlForPartialUpdate", function(){
    test("returns correct key/values", function(){
        const data = {"testkey": "testvalue"}
        const results = sqlForPartialUpdate(data, jsToSql)
        expect(results).toEqual({"setCols": '"testkey"=$1', "values": ["testvalue"]})
    })

    test("works with multiple inputs", function(){
        const data = {"testkey1": "testvalue1", "testkey2": "testvalue2", 
                        "testkey3": "testvalue3"}
        const results = sqlForPartialUpdate(data, jsToSql)
        expect(results).toEqual({"setCols": '"testkey1"=$1, "testkey2"=$2, "testkey3"=$3', 
                        "values": ["testvalue1", "testvalue2", "testvalue3"]})
    })

    test("fails with no input", function(){
        const data = {}
        expect(() => {
            sqlForPartialUpdate(data);
        }).toThrow("No data")
    })

    test("jsToSql works", function(){
        const data = {"numEmployees": 1, "logoUrl": "http://test.com"}
        const results = sqlForPartialUpdate(data, jsToSql)
        expect(results).toEqual({"setCols": '"num_employees"=$1, "logo_url"=$2', 
                        "values": [1, "http://test.com"]})
    })
})

describe("sqlForFilter", function(){
    test("returns correct key/values company data", function(){
        const query = {"minEmployees": 3, "maxEmployees": 50, "name": "bo"};
        const results = sqlForFilter(query);
        expect(results).toEqual({"cols": `num_employees >= $1 AND num_employees <= $2 AND name ILIKE $3`, 
                            "values": [3, 50, "%bo%"]})
    })

    test("returns correct key/values job data", function(){
        const query = {"minSalary": 3000, "hasEquity": "true", "title": "bo"};
        const results = sqlForFilter(query);
        expect(results).toEqual({"cols": `salary >= $1 AND equity > $2 AND title ILIKE $3`, 
                            "values": [3000, 0, "%bo%"]})
    })
})

describe("checkCompanyQuery", function(){
    test("fails with bad query", function(){
        const query = {"minEmployees": 3, "maxEmployees": 50, "eeeee": "bo"};
        expect(() => {
            checkCompanyQuery(query);
        }).toThrow("Value not found: eeeee")
    })

    test("fails with higher min than max", function(){
        const query = {"minEmployees": 300, "maxEmployees": 50, "name": "bo"};
        expect(() => {
            checkCompanyQuery(query);
        }).toThrow("maxEmployees must be greater than minEmployees")
    })

    test("fails with min or max NaN", function(){
        const query = {"minEmployees": 3, "maxEmployees": "y", "name": "bo"};
        expect(() => {
            checkCompanyQuery(query);
        }).toThrow("min and maxEmployees must be numbers")
    })
})

describe("checkJobQuery", function(){
    test("fails with bad query", function(){
        const query = {"title": 3, "minSalary": 50, "eeeee": "bo"};
        expect(() => {
            checkJobQuery(query);
        }).toThrow("Value not found: eeeee")
    })

    test("fails with invalid minSalary", function(){
        const query = {"minSalary": "five hundred"};
        expect(() => {
            checkJobQuery(query);
        }).toThrow("minSalary must be a number")
    })

    test("fails with invalid hasEquity", function(){
        const query = {"hasEquity": 3};
        expect(() => {
            checkJobQuery(query);
        }).toThrow("hasEquity must be true or false")
    })
})