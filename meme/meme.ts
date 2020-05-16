export class Meme {
    #id: number;
    #name: string;
    #url: string;
    #prices: number[];
    constructor(id: number, name: string,  url: string, price: number) {
        this.#id = id;
        this.#name = name;
        this.#url = url;
        this.#prices = [price];
    }
    get id() {
        return this.#id;
    }
    get name() {
        return this.#name;
    }
    get url() {
        return this.#url;
    }
    get prices() {
        return [...this.#prices].reverse();
    }

    changePrice(newPrice: number) {
        this.#prices.push(newPrice);
    }

    get price() {
        return this.#prices[this.#prices.length - 1];
    }
}
