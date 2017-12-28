'use strict';

import Game from "./game";
import GeneticAlgorithm from './genetic';

let populationSize = 250;
let initalPopulation = generatePopulation(populationSize);
let genetic = new GeneticAlgorithm(mutation, crossover, fitness, competition, initalPopulation, populationSize, 35);
let generation = 0;
let maxGenerations = 2500;
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
    var splitPoint = randomInt(0, 10);
    for (var j = splitPoint; j < 10; j++) {
        var temp = phenoTypeA[j];
        phenoTypeA[j] = phenoTypeB[j];
        phenoTypeB[j] = temp;
    }
    return [phenoTypeB, phenoTypeA];
}
function fitness(phenotype) {
    let game = new Game();
    do {
        game.go(phenotype[game.state.year - 1].buy, phenotype[game.state.year - 1].feed, phenotype[game.state.year - 1].planted);
    } while (game.state.year < 10 && game.isAlive);
    return game.state.year * (((game.state.population % 100) + 1) * (game.state.harvest + game.state.acres_owned + game.state.bushels_in_storage)) / 1000;
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
    let limits = game.recalculate_limits(0, 0, 0);
    for (var j = 0; j < 10; j++) {
        let buy = randomInt(limits.buy.min, limits.buy.max);
        limits = game.recalculate_limits(buy, 0, 0);
        let feed = randomInt(limits.feed.min, limits.feed.max);
        limits = game.recalculate_limits(buy, feed, 0);
        let planted = randomInt(limits.planted.min, limits.planted.max);
        years.push({ buy, feed, planted });
        game.go(buy, feed, planted);
        limits = game.recalculate_limits(buy, feed, planted);
    }
    return years;
}

function randomInt(min, max) {
    return Math.round(Math.floor(Math.random() * max) + min);
}