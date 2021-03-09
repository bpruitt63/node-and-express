const express = require('express');

const app = express();


class ExpressError extends Error {
    constructor(message, status) {
      super();
      this.message = message;
      this.status = status;
      console.error(this.stack);
    }
}
  


app.get('/mean', function(req, res, next){
    try{
        let nums = req.query.nums
        if (!nums){
            throw new ExpressError('nums are required', 400)
        }
        nums = nums.split(',')
        let total = 0
        for (i = 0; i < nums.length; i++){
            let num = nums[i]
            if (isNaN(num)){
                throw new ExpressError(`${num} is not a number`, 400)
            }
            num = parseInt(num)
            total += num
        }
        const avg = String(total / nums.length)
        return res.send(avg)
    } catch(err){
        return next(err)
    }
})

app.get('/median', function(req, res, next){
    try{
        let nums = req.query.nums
        if (!nums){
            throw new ExpressError('nums are required', 400)
        }
        nums = nums.split(',')
        let newms = []
        for (i = 0; i < nums.length; i++){
            let num = nums[i]
            if (isNaN(num)){
                throw new ExpressError(`${num} is not a number`, 400)
            }
            newms.push(parseInt(num))
        }
        let med = Math.ceil(newms.length / 2)
        newms = newms.sort(function(a, b){return a-b});
        return res.send(String(newms[med]))   
    } catch(err){
        return next(err)
    }
})

app.get('/mode', function(req, res, next){
    try{
        let nums = req.query.nums
        if (!nums){
            throw new ExpressError('nums are required', 400)
        }
        nums = nums.split(',')
        for (i = 0; i < nums.length; i++){
            let num = nums[i]
            if (isNaN(num)){
                throw new ExpressError(`${num} is not a number`, 400)
            }
        }
        nums = nums.sort();
        let count = {};
        for (let i = 0; i < nums.length; i++){
            if (count[nums[i]]){
                count[nums[i]] ++;
            } else {
                count[nums[i]] = 1;
            }
        }
        let totals = Object.values(count);
        totals = totals.sort(function(a, b){return b-a})
        max = totals[0]
        let mode = [];
        for (let number in count){
            if (count[number] === max){
                mode.push(number)
            }
        }
        return res.send(mode)   
    } catch(err){
        return next(err)
    }
})


app.use(function(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;
    return res.status(status).json({
      error: {message, status}
    });
  });

app.listen(3000, function(){
    console.log('App on port 3000');
  }) 