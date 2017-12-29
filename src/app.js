'use strict';

import Game from "./game";
import GeneticAlgorithm from './genetic';

let populationSize = 1;
let initalPopulation = generatePopulation(populationSize);
let genetic = new GeneticAlgorithm(mutation, crossover, fitness, competition, initalPopulation, populationSize, 35);
let generation = 0;
let maxGenerations = 1;
let best = genetic.best();
while (generation < maxGenerations) {
    genetic.evolve();
    best = genetic.best();
    generation++;
}

playGame(best);
console.log(`Generation: ${generation}`);
console.log(`Fitness: ${fitness(best)}`);
console.log(best);
function playGame(years) {
    let game = new Game();
    for (var i = 0; i < years.length; i++) {
        game.go(years[i].buy, years[i].feed, years[i].planted);
    }
    game.print();
}

function mutation(oldPhenotype) {
    return getYears();
}
function crossover(phenoTypeA, phenoTypeB) {
    return [phenoTypeB, phenoTypeA];
}
function fitness(phenotype) {
    let game = new Game();
    for (var i = 0; i < phenotype.length; i++) {
        game.go(phenotype[i].buy, phenotype[i].feed, phenotype[i].planted);
    }
    //return ((game.state.year > 9 ? 1 : 0) * (game.state.isAlive ? 1 : 0) * game.state.population);
    return game.state.year * game.state.population * game.state.bushels_in_storage;
}
function competition(phenoTypeA, phenoTypeB) {
    return false;
}

function generatePopulation(populationSize) {
    let population = [];
    for (var i = 0; i <= populationSize; i++) {
        population.push(getYears());
    }
    return population;
}

function getYears() {
    let game = new Game();
    var years = [];
    var limits = game.recalculate_limits(0, 0, 0);
    for (var j = 0; j < 10; j++) {
        let buy = randomInt(limits.buy.min, limits.buy.max);
        limits = game.recalculate_limits(buy, 0, 0);

        let feed = randomInt(limits.feed.min, limits.feed.max);
        limits = game.recalculate_limits(buy, feed, 0);

        let planted = randomInt(limits.planted.min, limits.planted.max);
        limits = game.recalculate_limits(buy, feed, planted);

        if (game.state.isAlive) {
            game.go(buy, feed, planted);
            years.push({ buy, feed, planted });
        }
    }
    return years;
}

function randomInt(min, max) {
    return Math.round(Math.floor(Math.random() * max) + min);
}