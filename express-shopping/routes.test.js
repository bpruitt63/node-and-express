process.env.NODE_ENV = 'test';
const req = require('supertest');
const app = require('./app');
const {items, Item} = require('./fakeDb.js')

let popsicle = new Item("popsicle", 1.50)

beforeEach(function(){
    items.push(popsicle);
})

afterEach(function(){
    items.length = 0;
})

describe("GET /items", function(){
    test("gets list of items", async function(){
        const res = await req(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{"name": "popsicle", "price": 1.50}])
    })
})

describe("POST /items", function(){
    test("posts new item", async function(){
        const res = await req(app).post('/items').send({"name": "puppy", "price": 2.5});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"name": "puppy", "price": 2.50})
        expect(items.length).toEqual(2)
    })

    test("doesn't post item if info missing", async function(){
        const res = await req(app).post('/items').send({"name": "", "price": 2.5});
        expect(res.statusCode).toBe(400);
        expect(items.length).toEqual(1)
    })
})

describe('GET /items/:name', function(){
    test('gets item', async function(){
        const res = await req(app).get('/items/popsicle');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"name": "popsicle", "price": 1.50})
    })

    test("doesn't find item that doesn't exist", async function(){
        const res = await req(app).get('/items/poopsicle');
        expect(res.statusCode).toBe(400);
    })
})

describe('PATCH /items/:name', function(){
    test('updates item', async function(){
        const res = await req(app).patch(`/items/${popsicle.name}`).send({"name": "puppy", "price": 2.5})
        expect(res.statusCode).toBe(200);
        expect(items[0]).toEqual({"name": "puppy", "price": 2.5})
    })

    test("doesn't update nonexistent item", async function(){
        const res = await req(app).patch(`/items/poopsicle`).send({"name": "puppy", "price": 2.5})
        expect(res.statusCode).toBe(400);
    })
})

describe ("DELETE /item/:name", function(){
    test('deletes item', async function(){
        const res = await req(app).delete(`/items/${popsicle.name}`)
        expect(res.statusCode).toBe(200);
        expect(items.length).toBe(0);
    })

    test("doesn't delete non-item", async function(){
        const res = await req(app).delete(`/items/poopsicle`)
        expect(res.statusCode).toBe(400);
        expect(items.length).toBe(1);
    })
})