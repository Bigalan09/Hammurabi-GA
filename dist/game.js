"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GrainPerPerson = exports.GrainPerPerson = 20;
var AcresPerBushel = exports.AcresPerBushel = 2;
var AcresPerPerson = exports.AcresPerPerson = 20;

var Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this.state = {
            starved: 0,
            immigrants: 5,
            population: 100,
            harvest: 3000,
            bushels_per_acre: 3,
            rats_ate: 200,
            bushels_in_storage: 2800,
            acres_owned: 1000,
            cost_per_acre: 19,
            plague_deaths: 0,
            year: 1,
            isAlive: true
        };
    }

    _createClass(Game, [{
        key: "print",
        value: function print() {
            console.log("___________________________________________________________________");
            console.log("\nO Great Hammurabi!\n");
            console.log("You are in year %d of your ten year rule.", this.state.year - 1);
            if (this.state.plague_deaths > 0) {
                console.log("A horrible plague killed %d people.", this.state.plague_deaths);
            }
            console.log("In the previous year %d people starved to death.", this.state.starved);
            console.log("In the previous year %d people entered the kingdom.", this.state.immigrants);
            console.log("The population is now %d.\n", this.state.population);
            console.log("We harvested %d bushels at %d bushels per acre.", this.state.harvest, this.state.bushels_per_acre);
            if (this.state.rats_ate > 0) {
                console.log("*** Rats destroyed %d bushels, leaving %d bushels in storage.", this.state.rats_ate, this.state.bushels_in_storage);
            } else {
                console.log("We have %d bushels of grain in storage.", this.state.bushels_in_storage);
            }
            console.log("The city owns %d acres of land.", this.state.acres_owned);
            console.log("Land is currently worth %d bushels per acre.\n", this.state.cost_per_acre);
        }
    }, {
        key: "recalculate_limits",
        value: function recalculate_limits(buy, feed, planted) {
            var game = this.state;
            var remaining_bushels = game.bushels_in_storage - this.to_i(buy) * game.cost_per_acre - this.to_i(feed) - this.to_i(planted);
            var limits = {
                buy: {
                    min: -(game.acres_owned - this.to_i(planted)),
                    max: Math.floor((remaining_bushels + this.to_i(buy) * game.cost_per_acre) / game.cost_per_acre)
                },
                feed: {
                    min: 0,
                    max: Math.min(remaining_bushels + this.to_i(feed), 20 * game.population)
                },
                planted: {
                    min: 0,
                    max: Math.min(game.acres_owned + this.to_i(buy), 10 * game.population, remaining_bushels + this.to_i(planted))
                }
            };
            return limits;
        }
    }, {
        key: "randomInt",
        value: function randomInt(min, max) {
            return Math.round(Math.floor(Math.random() * max) + min);
        }
    }, {
        key: "random",
        value: function random() {
            return Math.random();
        }
    }, {
        key: "go",
        value: function go(buy, feed, planted) {
            var limits = this.recalculate_limits(buy, feed, planted);
            var startOfYearPopulation = this.state.population;
            this.state.year++;
            this.buy_land(buy);
            this.calculate_plague();
            this.calculate_starved(feed);
            this.calculate_immigrants();
            this.calculate_harvest(planted);
            this.calculate_rats();
            this.calculate_cost_per_acre();
            this.state.isAlive = this.state.year < 10 && this.state.population > 0 && this.state.starved < 45 * startOfYearPopulation / 100;
        }
    }, {
        key: "buy_land",
        value: function buy_land(buy) {
            this.state.acres_owned += buy;
            this.state.bushels_in_storage -= buy * this.state.cost_per_acre;
        }
    }, {
        key: "calculate_plague",
        value: function calculate_plague() {
            this.state.plague_deaths = 0;
            if (Math.random() < 0.15) {
                this.state.plague_deaths = Math.floor(this.state.population / 2);
                this.state.population -= this.state.plague_deaths;
            }
        }
    }, {
        key: "calculate_starved",
        value: function calculate_starved(feed) {
            var enough_food_for = Math.floor(feed / 20);
            this.state.starved = Math.max(0, this.state.population - enough_food_for);
            this.state.bushels_in_storage -= feed;
            this.state.population -= this.state.starved;
        }
    }, {
        key: "calculate_immigrants",
        value: function calculate_immigrants() {
            this.state.immigrants = 0;
            if (this.state.starved == 0) {
                this.state.immigrants = this.to_i(Math.floor((20 * this.state.acres_owned + this.state.bushels_in_storage) / (100 * this.state.population))) + 1;
                this.state.population += this.state.immigrants;
            }
        }
    }, {
        key: "calculate_harvest",
        value: function calculate_harvest(planted) {
            this.state.bushels_per_acre = Math.floor(Math.random() * 8) + 1;
            this.state.harvest = this.state.bushels_per_acre * planted;
            this.state.bushels_in_storage += this.state.harvest - planted;
        }
    }, {
        key: "calculate_rats",
        value: function calculate_rats() {
            this.state.rats_ate = 0;
            if (Math.random() < 0.4) {
                this.state.rats_ate = Math.floor((Math.random() * 0.2 + 0.1) * this.state.bushels_in_storage);
                this.state.bushels_in_storage -= this.state.rats_ate;
            }
        }
    }, {
        key: "calculate_cost_per_acre",
        value: function calculate_cost_per_acre() {
            this.state.cost_per_acre = Math.floor(Math.random() * 7) + 17;
        }
    }, {
        key: "to_i",
        value: function to_i(value) {
            value = parseInt(value);
            if (isNaN(value)) {
                value = 0;
            }
            return value;
        }
    }]);

    return Game;
}();

exports.default = Game;