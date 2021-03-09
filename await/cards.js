const cardUrl = 'https://deckofcardsapi.com/api/deck'

async function drawOne(){
    card = await axios.get(`${cardUrl}/new/draw/?count=1`)
    console.log(`${card.data.cards[0].value} of ${card.data.cards[0].suit}`)
}

async function drawTwo(){
    card = await axios.get(`${cardUrl}/new/draw/?count=1`)
    card2 = await axios.get(`${cardUrl}/${card.data.deck_id}/draw/?count=1`)
    console.log(`${card.data.cards[0].value} of ${card.data.cards[0].suit}`)
    console.log(`${card2.data.cards[0].value} of ${card2.data.cards[0].suit}`)
}



window.addEventListener('load', function(){
    shuffle()
})

let deck;
async function shuffle(){
    deck = await axios.get(`${cardUrl}/new/shuffle/?deck_count=1`)
    let button = document.createElement('button')
    button.innerText = "Draw a Card"
    button.id = 'button'
    document.body.append(button)
}

document.body.addEventListener('click', function(e){
    if (e.target.id === 'button'){
        drawCard()
    }
})

async function drawCard(){
    const card = await axios.get(`${cardUrl}/${deck.data.deck_id}/draw/?count=1`)
    const pic = card.data.cards[0].images.png
    displayCard(pic)
}

function displayCard(pic){
    const div = document.querySelector('div')
    const img = document.createElement('img')
    img.src = pic
    div.append(img)
}