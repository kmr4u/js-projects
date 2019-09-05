/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

let scores, roundScore, activePlayer, gameOver;

init();

document.querySelector('.btn-roll').addEventListener('click', function(){
    if(!gameOver){
        //let dice = Math.trunc(Math.random()*6);
        let dice = Math.floor(Math.random()*6) + 1;
        //document.querySelector('#current-'+activePlayer).textContent = dice;
  
        let diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-'+dice+'.png';

        if(dice !== 1){
            roundScore += dice;
            document.querySelector('#current-'+activePlayer).textContent = roundScore;
        }
        else{
            swithPlayer();
        }

    }
   
});

function swithPlayer(){
    activePlayer = activePlayer^1; //Switches the active player between 1 and 0
    roundScore = 0;

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    document.querySelector('.dice').style.display = 'none';
}
document.querySelector('.btn-hold').addEventListener('click', function(){
    if(!gameOver)
        {
            scores[activePlayer] += roundScore;
            document.getElementById('score-'+activePlayer).textContent = scores[activePlayer];
            
            if(scores[activePlayer] >= 100){
                gameOver = true;
                document.getElementById('name-'+activePlayer).textContent = 'WINNER';
                document.querySelector('.dice').style.display = 'none';
                document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
                document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
        
            }
            else{
                swithPlayer();
            }

        }
});

function init(){
    gameOver = false;
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    
    
    //document.querySelector('#current-'+activePlayer).innerHTML = '<em>' + dice + '</em>';
    document.querySelector('.dice').style.display = 'none'; //use # to select Id and . to select class
    document.getElementById('name-0').textContent = 'Player - 1';
    document.getElementById('name-1').textContent = 'Player - 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    document.querySelector('.player-0-panel').classList.add('active');

}

document.querySelector('.btn-new').addEventListener('click', init);