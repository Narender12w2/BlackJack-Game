let blackjackGame={
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardsMap': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':[1,11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isStand':false,
    'turnsOver':false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer']
const CARD = blackjackGame['cards']

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

function blackjackHit(){
    if(blackjackGame['isStand']==false)
    {
        let card=randomcard();
        showcard(YOU,card);
        updateScores(card,YOU);
        showScore(YOU);
    }
}
function randomcard(){
   return  CARD[Math.floor(Math.random()*13)];
}
function showcard(activeplayer,card)
{
    if(activeplayer['score'] <= 21)
    {
        let cardImage = document.createElement('img');
        cardImage.src = `cardImages/${card}.png`;
        document.querySelector(activeplayer['div']).appendChild(cardImage);
        hitSound.play();
    }  
}

function blackjackdeal()
{
    if(blackjackGame['turnsOver']===true){
    let yourimages = document.querySelector('#your-box').querySelectorAll('img');
    for(let i=0;i<yourimages.length;i++)
    {
        yourimages[i].remove();
    }

    let dealerimages = document.querySelector('#dealer-box').querySelectorAll('img');
    for(let i=0;i<dealerimages.length;i++)
    {
        dealerimages[i].remove();
    }

    YOU['score']=0;
    DEALER['score']=0;
    document.querySelector('#your-blackjack-result').textContent=0;
    document.querySelector('#your-blackjack-result').style.color='white';
    document.querySelector('#dealer-blackjack-result').textContent=0;
    document.querySelector('#dealer-blackjack-result').style.color='white';

    document.querySelector('#blackjack-result').textContent="Let's Play";
    document.querySelector('#blackjack-result').style.color='white';
    blackjackGame['isStand']=false;
    blackjackGame['turnsOver']=false;
  }
}
function updateScores(card,activeplayer)
{
    if(card=='A')
    {
        if(activeplayer['score'] + blackjackGame['cardsMap'][card][1] <= 21)
        {
            activeplayer['score'] += blackjackGame['cardsMap'][card][1]; 
        }else{
            activeplayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }else
    activeplayer['score']+=blackjackGame['cardsMap'][card] ;
}
function showScore(activeplayer)
{
    if(activeplayer['score'] > 21)
    {
        document.querySelector(activeplayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activeplayer['scoreSpan']).style.color = 'red';
    }else
    document.querySelector(activeplayer['scoreSpan']).textContent = activeplayer['score'];
}
function dealerLogic(){
    blackjackGame['isStand']=true;
    if(blackjackGame['turnsOver']===false)
    {
        while(DEALER['score']<16)
        {
            let card=randomcard();
            showcard(DEALER,card);
            updateScores(card,DEALER);
            showScore(DEALER);
        }
        blackjackGame['turnsOver']=true; 
        let winner=computeWinner();
        showResult(winner);
    }
} 

function computeWinner(){
    let winner;

    if(YOU['score']<=21)
    {
        if(YOU['score']>DEALER['score'] || DEALER['score']>21)
        {
            blackjackGame['wins']++;
            winner=YOU;
        }
        else if(YOU['score']<DEALER['score'])
        {
            blackjackGame['losses']++;
            winner=DEALER;
        }
        else if(YOU['score']===DEALER['score'])
        {
            blackjackGame['draws']++;
        }
    }
    else if(YOU['score']>21 && DEALER['score']<=21)
    {
        blackjackGame['losses']++;
        winner=DEALER;
    }
    else if(YOU['score']>21 && DEALER['score']>21)
    {
        blackjackGame['draws']++;
    }
    return winner;
}

function showResult(winner){
    let message, messageColor;

    if(winner===YOU)
    {
        document.querySelector('#wins').textContent= blackjackGame['wins'];
        message='You Won!';
        messageColor='gold';
        winSound.play();
    }
    else if(winner===DEALER)
    {
        document.querySelector('#losses').textContent= blackjackGame['losses'];
        message='You Lost!';
        messageColor='red';
        lossSound.play();
    }
    else
    {
        document.querySelector('#draws').textContent= blackjackGame['draws'];
        message='You Drew';
        messageColor='skyblue';
    }

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
}