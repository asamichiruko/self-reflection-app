import { Storage } from "../main.js";

describe("Storage", () => {
    let validAchievements = [
        {
            id: "3ffe5574-9b56-4e57-8efc-2925f78208e2",
            content: "legal achievement 1",
            date: "2025-03-30T15:00:00.000Z"
        },
        {
            id: "ecaf3f79-5cad-4783-9739-321b392690a1",
            content: "legal achievement 2",
            date: "2025-03-31T15:00:00.000Z"
        },
        {
            id: "ffef366d-64da-4dca-82eb-f701f5d40e09",
            content: "legal achievement 3",
            date: "2025-04-01T15:00:00.000Z"
        }
    ];
    let validStars = [
        {
            id: "5dcd76f8-07e0-4ae3-9d42-e1766d77a23c",
            achievementId: "3ffe5574-9b56-4e57-8efc-2925f78208e2",
            content: "legal star 1 (following achievement 1)",
            date: "2025-03-31T15:00:00.000Z"
        },
        {
            id: "a47baaac-afe5-4447-87b5-943445304725",
            achievementId: "ecaf3f79-5cad-4783-9739-321b392690a1",
            content: "legal star 2 (following achievement 2)",
            date: "2025-04-01T15:00:00.000Z"
        },
        {
            id: "7d0d56a2-96ad-4cc1-969d-7c038932c7ee",
            achievementId: "ecaf3f79-5cad-4783-9739-321b392690a1",
            content: "legal star 3 (following achievement 2)",
            date: "2025-04-02T15:00:00.000Z"
        }
    ];

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
