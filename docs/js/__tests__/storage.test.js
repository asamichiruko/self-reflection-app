import { getAchievements, saveAchievement, updatePoints, deleteAchievement } from '../storage.js';

beforeEach(() => {
    localStorage.clear();
});

test("空の LocalStorage からデータを取得する", () => {
    const achievements = getAchievements();
    expect(achievements).toEqual([]);
});

test("LocalStorage から既存のデータを取得する", () => {
    const newAchievements = {
        id: Date.parse("2025-03-17T12:00:00.000+09:00"),
        content: "achievement text",
        date: new Date(2025, 3, 17, 12, 0, 0, 0).toLocaleString('ja-JP'),
        points: 0,
        pointsHistory: []
    };
    localStorage.setItem('achievements', JSON.stringify([newAchievements]))

    const achievements = getAchievements();
    expect(achievements).toEqual([newAchievements]);
});
