import { Storage } from "../Storage.js";
import { validAchievements, validStars } from "./testData.js";

describe("Storage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {});

    describe("add/get methods", () => {
        test("storageに1つのachievementを追加する", () => {
            const storage = new Storage();
            const newAchievement = validAchievements[0];
            storage.addAchievement(newAchievement);

            expect(storage.getAchievements()).toContainEqual(newAchievement);
        });

        test("storageにidの異なるachievementsを追加する", () => {
            const storage = new Storage();
            for (let achievement of validAchievements) {
                storage.addAchievement(achievement);
            }

            expect(storage.getAchievements()).toEqual(validAchievements);
        });

        test("localStorageに1つのstarを追加する", () => {
            const storage = new Storage();
            const newStar = validStars[0];
            storage.addStar(newStar);

            expect(storage.getStars()).toContainEqual(newStar);
        });

        test("localStorageにidの異なるstarsを追加する", () => {
            const storage = new Storage();
            for (let star of validStars) {
                storage.addStar(star);
            }

            expect(storage.getStars()).toEqual(validStars);
        });

        test("storageにidの異なるachievementsをまとめて追加する", () => {
            const storage = new Storage();
            storage.addAchievements(validAchievements);
            expect(storage.getAchievements()).toEqual(validAchievements);
        });

        test("storageにidの異なるstarsをまとめて追加する", () => {
            const storage = new Storage();
            // 対応する achievement が必要
            storage.addAchievements(validAchievements);
            storage.addStars(validStars);
            expect(storage.getStars()).toEqual(validStars);
        });
    });
});
