import Game from './game';

let game = new Game();
do {
    game.update();
    game.printState();
} while (game.state.yearOfRule < 10 && game.state.stillInOffice);

game.printState();