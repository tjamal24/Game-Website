let deckSize = 52;
var deck = new Array();
let suits = ['diamond', 'heart', 'club', 'spade'];
let chips = 10000;
let currWager = 0;
let playerHand = [];
let dealerHand = [];
let visibleDealerHand = [];
let playerPoints = 0;
let dealerPoints = 0;
const playerPointsElem = document.getElementById('player-points');
const dealerPointsElem = document.getElementById('dealer-points');
const playerCardsElem = document.getElementById('player-cards');
const dealerCardsElem = document.getElementById('dealer-cards');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const restartBtn = document.getElementById('restart-btn');
const wagerBtn = document.getElementById('wager-btn');
const wagerInput = document.getElementById('wagerInput');
const messageElem = document.getElementById('message');
const chipsElem = document.getElementById('chips');

// Event Listeners
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);
wagerBtn.addEventListener('click', makeBet);

function initializeChips(){
    chipsElem.textContent = chips;
}
function createDeck(){

    for(let i = 0; i < suits.length; i++){
        for(let j = 0; j < 13; j++){
            deck.push([j + 2, suits[i]]); 
        }
    }
    shuffleDeck();
} 

function shuffleDeck(){
    for (let i = deck.length - 1; i > 0; i--) { 
    
        // Generate random index 
        const j = Math.floor(Math.random() * (i + 1));
                      
        // Swap elements at indices i and j
        const temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function dealCard(){
    if(deck.length > 0){
        return deck.shift();
    }
}

function getHandPoints(hand){
    let result = 0;
    let numAces = 0;
    for(let card of hand){
        result += findValue(card);
        if(card[0] === 14){
            numAces++;
        }
    }
    while(result > 21 && numAces > 0){
        result -= 10;
        numAces -= 1;
    }
    return result;
}

function findSuit(card){
    for(let i = 0; i < suits.length; i++){
        if(card[1] === suits[i]){
            return suits[i];
        }
    }
}

function findValue(card){
    result = card[0];
    if(card[0] === 14){
        result = 11;
    }else if(card[0] > 10){
        result = 10;
    }
    return result;
}

function renderCards(hand, container) {
    container.innerHTML = '';
    for (let card of hand) {
        //this detects the dealers hidden card and displays a face down card
        if(card[0] === 0 && card[1] === 0){
            console.log('shit');
            const box = document.createElement('div');
            box.classList.add('upside-down-card');
            // Append the box to the container element
            container.appendChild(box);
        }else{
            const box = document.createElement('div');
            box.classList.add('card');
            suit = findSuit(card);
            cardValue = card[0];
            if(cardValue == 11){
                cardValue = 'J';
            }else if(cardValue == 12){
                cardValue = 'Q';
            }else if(cardValue == 13){
                cardValue = 'K';
            }else if(cardValue == 14){
                cardValue = 'A';
            }
            if(suit === 'diamond'){
                suit = 'D';
            }else if(suit === 'heart'){
                suit = 'H';
            }else if(suit === 'club'){
                suit = 'C';
            }else if(suit === 'spade'){
                suit = 'S';
            }
            
            // Create corner elements and append them to the box
            const corners = [
                { className: 'top-left', text: `${cardValue}${suit}` },
                { className: 'top-right', text: `${suit}${cardValue}` },
                { className: 'bottom-left', text: `${cardValue}${suit}` },
                { className: 'bottom-right', text: `${suit}${cardValue}` }
            ];
            
            corners.forEach(corner => {
                const cornerElement = document.createElement('div');
                cornerElement.classList.add('corner', corner.className);
                cornerElement.textContent = corner.text;
                box.appendChild(cornerElement);
            });

            // Append the box to the container element
            container.appendChild(box);
        }
    }
  }

// Hit button action
function hit() {
    playerHand.push(dealCard());
    playerPoints = getHandPoints(playerHand);
    playerPointsElem.textContent = playerPoints;
    renderCards(playerHand, playerCardsElem);

    if (playerPoints > 21) {
        chips -= currWager;
        endHand('Player busts! Dealer wins!');
    }
}

  // Stand button action
function stand() {
    dealerPoints = getHandPoints(dealerHand);
    playerPoints = getHandPoints(playerHand);
    dealerPointsElem.textContent = dealerPoints;
    renderCards(dealerHand, dealerCardsElem);
    while (dealerPoints < 17) {
        dealerHand.push(dealCard());
        dealerPoints = getHandPoints(dealerHand);
    }
    dealerPointsElem.textContent = dealerPoints;
    renderCards(dealerHand, dealerCardsElem);

    if (dealerPoints > 21) {
        chips += currWager;
        endHand('Dealer busts! Player wins!');
    } else if (playerPoints > dealerPoints) {
        chips += currWager;
        endHand('Player wins!');
    } else if (playerPoints < dealerPoints) {
        chips -= currWager;
        endHand('Dealer wins.');
    } else {
        endHand('It\'s a tie!');
    }
}

  // End the hand
function endHand(message) {
    messageElem.textContent = message;
    const messageAddition = document.createElement('p');
    messageAddition.textContent = 'Place another bet to play again!'
    messageElem.appendChild(messageAddition);
    hitBtn.disabled = true;
    standBtn.disabled = true;
    console.log('chips: ' + chips);
    console.log('chepsElem: ' + chipsElem);
    initializeChips();
    console.log('chips: ' + chips);
    console.log('chepsElem: ' + chipsElem);
}


function makeBet(){
    requestIsValid = true;
    input = wagerInput.value;
    request = parseInt(input);
    console.log(request);
    if(request > chips){
        messageElem.textContent = 'Bet Refused. You don\'t have enough chips.';
        requestIsValid = false;
    }
    else if(request < 1){
        messageElem.textContent = 'Bet Refused. Wager too small.';
        requestIsValid = false;
    }
    else if(input != request){
        messageElem.textContent = 'Bet Refused. Enter a whole Number.'
        requestIsValid = false;
    }
    if(requestIsValid){
        currWager = request;
        startHand();
    }
    wagerInput.value = 0;
}

function startHand() {

    if(deck.length < 10){
        while(deck.length > 0){
            deck.pop();
        }
        createDeck();
        console.log('deck shuffled')
        messageElem.textContent = 'Deck reshuffled and refilled';
        return;
    }
    playerHand = [dealCard(), dealCard()];
    dealerHand = [dealCard(), dealCard()];
    visibleDealerHand = [dealerHand[0], [0, 0]];
    playerPoints = getHandPoints(playerHand);
    dealerPoints = getHandPoints(visibleDealerHand);

    playerPointsElem.textContent = playerPoints;
    dealerPointsElem.textContent = dealerPoints;
    renderCards(playerHand, playerCardsElem);
    renderCards(visibleDealerHand, dealerCardsElem);
  
    messageElem.textContent = '';
  
    hitBtn.disabled = false;
    standBtn.disabled = false;
    restartBtn.style.display = 'none';

    console.log(deck.length);
    if(playerPoints === 21 && dealerPoints === 21){
        endHand('It\'s a tie!');
    }else if(playerPoints === 21){
        chips += currWager * 1.5    
        endHand('YOU GOT BLACKJAK!');
    }else if(dealerPoints === 21){
        chips -= currWager;
        endHand('Blackjack. Dealer wins.');
    }
  }
window.onload = function () {
    createDeck();
    initializeChips();
    hitBtn.disabled = true;
    standBtn.disabled = true;
    messageElem.textContent = 'Place a bet to start!';
};
