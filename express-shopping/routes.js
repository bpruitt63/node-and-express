const express = require('express');
const router = new express.Router();
const {items, Item} = require('./fakeDb.js')


class ExpressError extends Error {
    constructor(message, status) {
      super();
      this.message = message;
      this.status = status;
      console.error(this.stack);
    }
}


router.get('/', function(req, res, next){
    try{
        return res.json(items)
    } catch(err){
        return next(err)
    }
})

router.post('/', function(req, res, next){
    try{
        if (!req.body.name || !req.body.price){
            throw new ExpressError('name and price are required', 400)
        }
        let item = new Item(req.body.name, req.body.price)
        for (obj of items){
            if (obj == item){
                throw new ExpressError('item already exists', 400)
            }
        }
        items.push(item)
        return res.send(item)
    } catch(err){
        return next(err)
    }
})

router.get('/:name', function(req, res, next){
    try{
        let item;
        for (let obj of items){
            if (obj.name === req.params.name){
                item = obj
            }
        }
        if (item === undefined){
            throw new ExpressError('no such item', 400)
        }
        return res.send(item)
    } catch(err){
        return next(err)
    }
})

router.patch('/:name', function(req, res, next){
    try{
        let item;
        for (let obj of items){
            if (obj.name === req.params.name){
                item = obj
            }
        }
        if (item === undefined){
            throw new ExpressError('no such item', 400)
        }
        item.name = req.body.name;
        item.price = req.body.price;
        return res.send(`{"updated: {"name": "${item.name}", "price": ${item.price} }`)
    } catch(err){
        return next(err)
    }
})

router.delete('/:name', function(req, res, next){
    try{
        let item;
        for (let i = 0; i < items.length; i++){
            if (items[i].name === req.params.name){
                item = i
            }
        }
        if (item === undefined){
            throw new ExpressError('no such item', 400)
        }
        items.splice(item, 1)
        return res.send({message: "Deleted"})
    } catch(err){
        return next(err)
    }
})

router.use(function(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;
    return res.status(status).json({
      error: {message, status}
    });
});

module.exports = router