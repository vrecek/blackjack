import Blackjack from "./Blackjack.js";
const card_images = [
    './images/card-2.png',
    './images/card-3.png',
    './images/card-4.png',
    './images/card-5.png',
    './images/card-6.png',
    './images/card-7.png',
    './images/card-8.png',
    './images/card-9.png',
    './images/card-10.png',
    './images/card-jack.png',
    './images/card-queen.png',
    './images/card-king.png',
    './images/card-ace.png',
];
const draw_card = document.querySelector('.draw-card');
const hold_card = document.querySelector('.hold-card');
const restart = document.querySelector('.restart');
const win_cont = document.querySelector('h4');
const ene_hold_cont = document.querySelector('.enemy h2 span');
const plr_hold_cont = document.querySelector('.player h2 span');
/* player [0], enemy [1] */
const scores_cont = Array.from(document.querySelectorAll('.score'));
const fields = Array.from(document.querySelectorAll('.cards'));
/* */
const game = new Blackjack(card_images, 500);
draw_card.addEventListener('click', () => {
    const turn_score = game.draw(fields, ene_hold_cont);
    for (let i = 0; i <= 1; i++) {
        scores_cont[i].textContent = parseInt(scores_cont[i].textContent) + (turn_score[i] || 0);
    }
    const winner = game.returnWinner();
    if (winner) {
        end(winner);
    }
});
hold_card.addEventListener('click', () => {
    plr_hold_cont.textContent = '(hold)';
    game.hold(fields[1], scores_cont[1]);
    const result = game.returnWinner();
    end(result);
});
restart.addEventListener('click', () => {
    game.restartGame(fields, scores_cont);
    win_cont.style.display = 'none';
    draw_card.style.pointerEvents = 'all';
    draw_card.style.visibility = 'visible';
    hold_card.style.pointerEvents = 'all';
    hold_card.style.visibility = 'visible';
    restart.style.display = 'none';
    ene_hold_cont.textContent = '';
    plr_hold_cont.textContent = '';
    win_cont.children[1].textContent = '';
    win_cont.children[1].textContent = 'WINS';
});
const end = (winnerString) => {
    win_cont.children[1].textContent = winnerString;
    if (winnerString === 'DRAW') {
        win_cont.children[1].textContent = '';
    }
    win_cont.style.display = 'block';
    draw_card.style.pointerEvents = 'none';
    draw_card.style.visibility = 'hidden';
    hold_card.style.pointerEvents = 'none';
    hold_card.style.visibility = 'hidden';
    restart.style.display = 'inline';
};
