const cardUrl = 'https://deckofcardsapi.com/api/deck'

axios.get(`${cardUrl}/new/draw/?count=1`)
.then(res => console.log(`${res.data.cards[0].value} of ${res.data.cards[0].suit}`))
.catch(err => console.log(err))


let cards = []
axios.get(`${cardUrl}/new/draw/?count=1`)
.then(res => {
    cards.push(res)
    return axios.get(`${cardUrl}/${res.data.deck_id}/draw/?count=1`);
})
.then(res2 => {
    cards.push(res2)
    console.log(`${cards[0].data.cards[0].value} of ${cards[0].data.cards[0].suit}`)
    console.log(`${cards[1].data.cards[0].value} of ${cards[1].data.cards[0].suit}`)
})
.catch(err => console.log(err))


let deck;
window.addEventListener('load', function() {
    axios.get(`${cardUrl}/new/shuffle/?deck_count=1`)
    .then(res => {
        deck = res.data.deck_id
        let button = document.createElement('button')
        button.innerText = "Draw a Card"
        button.id = 'button'
        document.body.append(button)
    })
});

document.body.addEventListener('click', function(e) {
    if (e.target.id === 'button'){
        axios.get(`${cardUrl}/${deck}/draw/?count=1`)
        .then(res => {
            let card = res.data.cards[0].images.png
            displayCard(card)
        })
    }
})

function displayCard(card){
    const div = document.querySelector('div')
    const img = document.createElement('img')
    img.src = card
    div.append(img)
}