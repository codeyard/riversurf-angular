import {Category} from "./category.model";
import {Rider} from "./rider.model";

export class Competition {
    category: Category;
    maxRiders: number;
    riders: Rider[];


    constructor(category: Category, maxRiders: number, riders: Rider[]) {
        this.category = category;
        this.maxRiders = maxRiders;
        this.riders = riders;
    }
}
