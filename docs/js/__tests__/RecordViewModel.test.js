import { RecordViewModel } from "../main.js";
import { validAchievements, validRecords, validStars } from "./testData.js";

describe("RecordViewModel", () => {
    let recordViewModel;
    let mockRecordModel;

    beforeEach(() => {
        mockRecordModel = {
            subscribe: vi.fn(),
            notify: vi.fn(),
            addAchievement: vi.fn(() => true),
            addStar: vi.fn(() => true),
            getRecords: vi.fn(() => validRecords),
            importFromJsonString: vi.fn(() => true),
            exportAsJsonString: vi.fn(() =>
                JSON.stringify({ achievements: validAchievements, stars: validStars })
            )
        };
        recordViewModel = new RecordViewModel(mockRecordModel);
    });

    afterEach(() => {});

    test("subscribeしたコールバックが実行される", () => {
        const listener = vi.fn();
        recordViewModel.subscribe(listener);
        recordViewModel.notify();
        expect(listener).toHaveBeenCalled();
    });

    test("addAchievementメソッドがRecordModelに移譲される", () => {
        const a = validAchievements[0];
        const result = recordViewModel.addAchievement({ content: a.content });
        expect(result).toBe(true);
        expect(mockRecordModel.addAchievement).toHaveBeenCalledWith({ content: a.content });
    });

    test("addStarメソッドがRecordModelに移譲される", () => {
        const a = validStars[0];
        const result = recordViewModel.addStar({
            achievementId: a.achievementId,
            content: a.content
        });
        expect(result).toBe(true);
        expect(mockRecordModel.addStar).toHaveBeenCalledWith({
            achievementId: a.achievementId,
            content: a.content
        });
    });

    test("getRecordメソッドがRecordModelに移譲される", () => {
        const result = recordViewModel.getRecords();
        expect(result).toEqual(validRecords);
        expect(mockRecordModel.getRecords).toHaveBeenCalled();
    });

    test("importFromJsonStringメソッドがRecordModelに移譲される", () => {
        const jsonString = JSON.stringify({ achievements: validAchievements, stars: validStars });
        const result = recordViewModel.importFromJsonString(jsonString);
        expect(result).toBe(true);
        expect(mockRecordModel.importFromJsonString).toHaveBeenCalledWith(jsonString);
    });

    test("exportAsJsonStringメソッドがRecordModelに移譲される", () => {
        const result = recordViewModel.exportAsJsonString();
        expect(result).toBe(JSON.stringify({ achievements: validAchievements, stars: validStars }));
        expect(mockRecordModel.exportAsJsonString).toHaveBeenCalled();
    });
});
