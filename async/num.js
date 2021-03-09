const url = 'http://numbersapi.com'

axios.get(`${url}/21?json`)
.then(res => console.log(res.data.text))
.catch(err => console.log(err));


axios.get(`${url}/1..4?json`)
.then(res => {
    for (let fact in res.data) {
        console.log(res.data[fact])
    }
})
.catch(err => console.log(err));


let numFacts = [];

for (let i = 1; i < 5; i++){
    numFacts.push(axios.get(`${url}/101?json`))
}

Promise.all(numFacts)
.then(numArr => (
    numArr.forEach(num => console.log(num.data.text))
))
.catch(err => console.log(err));