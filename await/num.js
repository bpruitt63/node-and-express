const url = 'http://numbersapi.com'

async function one(){
    const fact = await axios.get(`${url}/63?json`)
    console.log(fact.data.text)
}

async function two(){
    const facts = await axios.get(`${url}/1..4?json`)
    for (let fact in facts.data){
        console.log(facts.data[fact])
    }
}

async function three(){
    const facts = []
        for (let i = 1; i < 5; i++){
            facts.push(await axios.get(`${url}/63?json`))
        }
    for (fact of facts){
        console.log(fact.data.text)
    }
}