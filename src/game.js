export const GrainPerPerson = 20;
export const AcresPerBushel = 2;
export const AcresPerPerson = 20;

export default class Game {
    constructor() {
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

    print() {
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

    recalculate_limits(buy, feed, planted) {
        let game = this.state;
        let remaining_bushels =
            game.bushels_in_storage -
            (this.to_i(buy) * game.cost_per_acre) -
            this.to_i(feed) -
            this.to_i(planted);
        let limits = {
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
        }
        return limits;
    }

    randomInt(min, max) {
        return Math.round(Math.floor(Math.random() * max) + min);
    }

    random() {
        return Math.random();
    }

    go(buy, feed, planted) {
        let limits = this.recalculate_limits(buy, feed, planted);
        let startOfYearPopulation = this.state.population;
        this.state.year++;
        this.buy_land(buy);
        this.calculate_plague();
        this.calculate_starved(feed);
        this.calculate_immigrants();
        this.calculate_harvest(planted);
        this.calculate_rats();
        this.calculate_cost_per_acre();
        this.state.isAlive = (
            this.state.year < 10 &&
            this.state.population > 0 &&
            this.state.starved < 45 * startOfYearPopulation / 100);
    }

    buy_land(buy) {
        this.state.acres_owned += buy;
        this.state.bushels_in_storage -= buy * this.state.cost_per_acre;
    }

    calculate_plague() {
        this.state.plague_deaths = 0
        if (Math.random() < 0.15) {
            this.state.plague_deaths = Math.floor(this.state.population / 2)
            this.state.population -= this.state.plague_deaths
        }
    }

    calculate_starved(feed) {
        var enough_food_for = Math.floor(feed / 20);
        this.state.starved = Math.max(0, this.state.population - enough_food_for);
        this.state.bushels_in_storage -= feed;
        this.state.population -= this.state.starved;
    }

    calculate_immigrants() {
        this.state.immigrants = 0;
        if (this.state.starved == 0) {
            this.state.immigrants = this.to_i(Math.floor((20 * this.state.acres_owned + this.state.bushels_in_storage) / (100 * this.state.population))) + 1;
            this.state.population += this.state.immigrants;
        }
    }

    calculate_harvest(planted) {
        this.state.bushels_per_acre = Math.floor(Math.random() * 8) + 1;
        this.state.harvest = this.state.bushels_per_acre * planted;
        this.state.bushels_in_storage += this.state.harvest - planted;
    }

    calculate_rats() {
        this.state.rats_ate = 0;
        if (Math.random() < 0.4) {
            this.state.rats_ate = Math.floor((Math.random() * 0.2 + 0.1) * this.state.bushels_in_storage);
            this.state.bushels_in_storage -= this.state.rats_ate;
        }
    }

    calculate_cost_per_acre() {
        this.state.cost_per_acre = Math.floor(Math.random() * 7) + 17;
    }

    to_i(value) {
        value = parseInt(value);
        if (isNaN(value)) {
            value = 0;
        }
        return value;
    }
}