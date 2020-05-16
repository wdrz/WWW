import {MemeList} from "./memeList";
import {Meme} from "./meme";
import {expect} from "chai";
import "mocha";

describe("Test the implementation of class Meme and class MemeList", () => {

    const memeList = new MemeList();
    memeList.addMeme(new Meme(1, "Gold", "something", 200));
    memeList.addMeme(new Meme(2, "Platinum", "something", 500));
    memeList.addMeme(new Meme(3, "Elite", "something", 100));
    memeList.addMeme(new Meme(10, "Hehe", "something", 600));
    memeList.addMeme(new Meme(9, "Haha", "something", 260));
    memeList.addMeme(new Meme(8, "Meme", "something", 320));

    const mostExpensive = memeList.mostExpensive;

    it("should return 3 most expensive memes", () => {
        expect(mostExpensive.length).to.equal(3);
        expect(mostExpensive[0].price).to.equal(600);
        expect(mostExpensive[0].name).to.equal("Hehe");
        expect(mostExpensive[1].price).to.equal(500);
        expect(mostExpensive[2].id).to.equal(8);
    });

    it("should find memes by id", () => {
        expect(memeList.getMemeById(2).name).to.equal("Platinum");
        expect(memeList.getMemeById(9).price).to.equal(260);
        expect(memeList.getMemeById(5)).to.equal(undefined);
    });

    it("behave well when changing prices", () => {
        const meme = memeList.getMemeById(2);

        meme.changePrice(50);
        meme.changePrice(100);

        expect(meme.prices[0]).to.equal(100);
        expect(meme.prices[1]).to.equal(50);
        expect(meme.prices[2]).to.equal(500);

        const newMostExpensive = memeList.mostExpensive;
        expect(newMostExpensive[0].price).to.equal(600);
        expect(newMostExpensive[1].price).to.equal(320);
    });
});