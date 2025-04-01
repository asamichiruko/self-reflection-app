import { RecordModel } from "../main.js";
import { validAchievements, validRecords, validStars } from "./testData.js";

describe("RecordModel", () => {
    let mockStorage;
    let recordModel;

    beforeEach(() => {
        mockStorage = {
            generateId: vi.fn(() => "mock-id"),
            addAchievement: vi.fn(() => true),
            addStar: vi.fn(() => true),
            getAchievements: vi.fn(() => []),
            getStars: vi.fn(() => []),
            addAchievements: vi.fn(),
            addStars: vi.fn()
        };
        recordModel = new RecordModel(mockStorage);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("achievementを追加するとlistenerが呼ばれる", () => {
        const listener = vi.fn();
        recordModel.subscribe(listener);

        const testData = validAchievements[0];
        mockStorage.generateId.mockReturnValue(testData.id);
        vi.setSystemTime(testData.date);

        const result = recordModel.addAchievement({ content: testData.content });
        expect(result).toBe(true);
        expect(mockStorage.addAchievement).toHaveBeenCalledWith(testData);
        expect(listener).toHaveBeenCalled();
    });

    test("starを追加するとlistenerが呼ばれる", () => {
        const listener = vi.fn();
        recordModel.subscribe(listener);

        const result = recordModel.addStar({
            achievementId: "test-achievement-id",
            content: "test star"
        });

        expect(result).toBe(true);
        expect(mockStorage.addStar).toHaveBeenCalledWith({
            id: "mock-id",
            achievementId: "test-achievement-id",
            content: "test star",
            date: expect.any(Date)
        });
        expect(listener).toHaveBeenCalled();
    });

    test("recordを取得する", () => {
        mockStorage.getAchievements.mockReturnValue(validAchievements);
        mockStorage.getStars.mockReturnValue(validStars);

        const records = recordModel
            .getRecords()
            .sort((a, b) => b.achievement.date - a.achievement.date);
        const sortedValidRecords = Array.from(validRecords).sort(
            (a, b) => b.achievement.date - a.achievement.date
        );
        expect(records).toEqual(sortedValidRecords);
    });

    test("achievement, starsをJSON文字列でexportする", () => {
        mockStorage.getAchievements.mockReturnValue(validAchievements);
        mockStorage.getStars.mockReturnValue(validStars);

        const json = JSON.parse(recordModel.exportAsJsonString());
        expect(json.achievements).toEqual(validAchievements);
        expect(json.stars).toEqual(validStars);
    });

    test("JSON文字列からrecordをimportするとlistenerが呼ばれる", () => {
        const listener = vi.fn();
        recordModel.subscribe(listener);

        const jsonString = JSON.stringify({
            achievements: validAchievements,
            stars: validStars
        });

        const result = recordModel.importFromJsonString(jsonString);

        expect(result).toBe(true);
        expect(mockStorage.addAchievements).toHaveBeenCalledWith(validAchievements);
        expect(mockStorage.addStars).toHaveBeenCalledWith(validStars);

        expect(listener).toHaveBeenCalled();
    });
});
