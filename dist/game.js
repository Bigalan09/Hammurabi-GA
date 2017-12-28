export const GrainPerPerson = 20;
export const AcresPerBushel = 2;
export const AcresPerPerson = 20;

export default class Game {
    constructor() {
        this.state = {
            yearOfRule: 0,
            stillInOffice: true,
            population: 100,
            acreage: 1000,
            grain: 2800,
            pricePerAcre: 3,
            harvestPerAcre: 3,
            percentEatenByRats: 10,
            plagueHappened: false,
            nextYearPricePerAcre: this.RandomPricePerAcre(),
            starvationVictims: 0,
            plagueVictims: 0,
            immigrants: 5,
            grainHarvested: 3000,
            grainEatenByRats: 400
        };
    }

    printState() {
        console.log("___________________________________________________________________");
        console.log("\nO Great Hammurabi!\n");
        console.log("You are in year %d of your ten year rule.\n", this.state.yearOfRule);
        if (this.state.plagueVictims > 0) {
            console.log("A horrible plague killed %d people.\n", this.state.plagueVictims);
        }
        console.log("In the previous year %d people starved to death.\n", this.state.starvationVictims);
        console.log("In the previous year %d people entered the kingdom.\n", this.state.immigrants);
        console.log("The population is now %d.\n", this.state.population);
        console.log("We harvested %d bushels at %d bushels per acre.\n", this.state.grainHarvested, this.state.harvestPerAcre);
        if (this.state.grainEatenByRats > 0) {
            console.log("*** Rats destroyed %d bushels, leaving %d bushels in storage.\n", this.state.grainEatenByRats, this.state.grain);
        } else {
            console.log("We have %d bushels of grain in storage.\n", this.state.grain);
        }
        console.log("The city owns %d acres of land.\n", this.state.acreage);
        console.log("Land is currently worth %d bushels per acre.\n", this.state.nextYearPricePerAcre);
    }

    RandomPricePerAcre() {
        return random(10, 17);
    }

    RandomYieldPerAcre() {
        return random(1, 5);
    }

    RandomRatPercent() {
        if (random() < 0.40) {
            return randomInt(10, 21);
        }
        return 0;
    }

    RandomPlagueHappened() {
        return random() > 0.85;
    }

    randomInt(min, max) {
        return Math.round(Math.floor(Math.random() * max) + min);
    }

    random() {
        return Math.random();
    }

    update(acresToBuy, acresToSell, grainForFood, acresToPlant) {
        if (!this.state.stillInOffice) {
            console.log("YOU HAVE BEEN OVERTHROWN!");
        } else {
            let startOfYearPopulation = this.state.population;
            this.state.yearOfRule++;

            this.state.pricePerAcre = this.state.nextYearPricePerAcre;
            this.state.harvestPerAcre = this.RandomYieldPerAcre();
            this.state.percentEatenByRats = this.RandomRatPercent();
            this.state.plagueHappened = this.RandomPlagueHappened();
            this.state.nextYearPricePerAcre = this.RandomPricePerAcre();

            let grainUsedToBuyLand = Math.round(Math.min(acresToBuy * this.state.pricePerAcre, this.state.grain));
            this.state.grain -= grainUsedToBuyLand;
            this.state.acreage += grainUsedToBuyLand / this.state.pricePerAcre;

            // Sell land
            let grainFromSaleOfLand = Math.round(Math.min(acresToSell, this.state.acreage) * this.state.pricePerAcre);
            this.state.grain += grainFromSaleOfLand;
            this.state.acreage -= grainFromSaleOfLand / this.state.pricePerAcre;

            // Feed the people
            let peopleFed = Math.round(Math.min(Math.min(this.state.grain, grainForFood) / GrainPerPerson, this.state.population));
            this.state.grain -= peopleFed * GrainPerPerson;

            // Plant the fields
            let acresForPlanting = Math.round(Math.min(Math.min(acresToPlant, this.state.population * AcresPerPerson), this.state.acreage));
            let grainPlanted = Math.round(Math.min(this.state.grain, acresForPlanting / AcresPerBushel));
            let acresPlanted = grainPlanted * AcresPerBushel;
            this.state.grain -= grainPlanted;
            let grainAfterPlanting = this.state.grain;

            // Harvest grain and deal with the rats
            this.state.grainHarvested = Math.round(acresPlanted * this.state.harvestPerAcre);
            this.state.grain += this.state.grainHarvested;
            this.state.grainEatenByRats = Math.round(this.state.percentEatenByRats * this.state.grain / 100);
            this.state.grain -= this.state.grainEatenByRats;

            // Adjust population counts
            if (this.state.plagueHappened) {
                this.state.plagueVictims = Math.round(this.state.population / 2);
                this.state.population -= this.state.plagueVictims;
            } else {
                this.state.plagueVictims = 0;
            }

            if (this.state.population > peopleFed) {
                // Starvation occurs if not everyone was fed
                this.state.starvationVictims = this.state.population - peopleFed;
                this.state.population -= this.state.starvationVictims;
            } else {
                this.state.starvationVictims = 0;
            }

            if (this.state.population > 0 && this.state.starvationVictims == 0) {
                // Allow immigrants if nobody starved and there are still people around
                this.state.immigrants = Math.round((20 * this.state.acreage + grainAfterPlanting) / (100 * this.state.population) + 1);
                this.state.population += this.state.immigrants;
            } else {
                this.state.immigrants = 0;
            }

            // Determine if the game is over
            this.state.stillInOffice = this.state.yearOfRule < 10 && this.state.population > 0 && this.state.starvationVictims < 45 * startOfYearPopulation / 100;
        }
    }
}