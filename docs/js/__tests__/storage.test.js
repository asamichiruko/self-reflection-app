import { getAchievements, saveAchievement, updatePoints, deleteAchievement } from '../storage.js';

beforeEach(() => {
    localStorage.clear();
});

test("空の LocalStorage から達成事項を取得しようとする", () => {
    const achievements = getAchievements();
    expect(achievements).toEqual([]);
});

test("LocalStorage から達成事項を取得する", () => {
    // テスト用の達成事項を LocalStorage に追加しておく
    const newAchievements = {
        id: Date.parse("2025-03-17T12:00:00.000+09:00"),
        content: "achievement text",
        date: new Date(2025, 3, 17, 12, 0, 0, 0).toLocaleString('ja-JP'),
        points: 1,
        pointsHistory: [{
            date: new Date(2025, 3, 18, 15, 0, 0).toLocaleString('ja-JP'),
            points: 1,
            reason: "some reason"
        }]
    };
    localStorage.setItem('achievements', JSON.stringify([newAchievements]))

    // 取得内容の確認
    const achievements = getAchievements();
    expect(achievements).toEqual([newAchievements]);
});

test("LocalStorage に意図した型と異なるデータが格納されている", () => {
    // テスト用の不正なデータを追加しておく
    const illegalAchievements = {
        id: Date.parse("2025-03-17T12:00:00.000+09:00"),
        // missing "content" attribute
        date: new Date(2025, 3, 17, 12, 15, 0, 0).toLocaleString('ja-JP'),
        message: "message, not content",  // unexpected attribute
        points: 1,
        pointsHistory: [{
            date: new Date(2025, 3, 18, 15, 0, 0).toLocaleString('ja-JP'),
            points: 1,
            reason: "some reason"
        }]
    };
    localStorage.setItem('achievements', JSON.stringify([illegalAchievements]))

    // 達成事項に不整合がないことを確認する
    const achievements = getAchievements();
    expect(achievements).toEqual([]);
});

test("LocalStorage に新たな達成事項を追加する", () => {
    // 達成事項の追加
    const newAchievementsContent = "new achievement";
    const result = saveAchievement(newAchievementsContent);

    // 返り値の達成事項の内容をテストする
    expect(result.content).toEqual(newAchievementsContent);
    expect(result.points).toEqual(0);
    expect(result.pointsHistory).toEqual([]);

    // LocalStorage に追加された達成事項の内容をテストする

    const achievements = JSON.parse(localStorage.getItem('achievements'));
    const achievementIndex = achievements.findIndex(a => a.id === result.id);

    const newAchievements = achievements[achievementIndex];
    expect(newAchievements).toEqual(result);
});

test("加点履歴のない達成事項に初めて加点する", () => {
    // テスト用の達成事項を追加
    const newAchievementsId = Date.parse("2025-03-17T12:00:00.000+09:00");
    const newAchievement = {
        id: newAchievementsId,
        content: "achievement text",
        date: new Date(2025, 3, 17, 12, 0, 0, 0).toLocaleString('ja-JP'),
        points: 0,
        pointsHistory: []
    };
    localStorage.setItem('achievements', JSON.stringify([newAchievement]));

    // 追加する加点履歴データ
    const pointsToAdd = 1;
    const pointsReason = "some reason";

    // 加点
    const result = updatePoints(newAchievementsId, pointsToAdd, pointsReason);
    expect(result).toEqual(true);

    // 実際に加点履歴が追加されていることを確認する
    const achievements = getAchievements();
    const achievementIndex = achievements.findIndex(a => a.id === newAchievementsId);
    const achievement = achievements[achievementIndex];
    const newPointsHistoryItem = achievement.pointsHistory[0];

    expect(achievement.points).toEqual(0 + pointsToAdd);
    expect(newPointsHistoryItem.points).toEqual(pointsToAdd);
    expect(newPointsHistoryItem.reason).toEqual(pointsReason);
});

test("存在しない達成事項に加点しようとする", () => {
    // 追加する加点履歴データ
    const nonexistentId = "";
    const pointsToAdd = 1;
    const pointsReason = "some reason";

    // 達成事項が存在しないことを確認
    const achievements = getAchievements();
    expect(achievements).toEqual([]);

    // 加点
    const result = updatePoints(nonexistentId, pointsToAdd, pointsReason);
    expect(result).toEqual(false);
});

test("LocalStorage から達成事項を削除する", () => {
    // テスト用の達成事項を追加
    const newAchievementsId = Date.parse("2025-03-17T12:00:00.000+09:00");
    const newAchievement = {
        id: newAchievementsId,
        content: "achievement text",
        date: new Date(2025, 3, 17, 12, 0, 0, 0).toLocaleString('ja-JP'),
        points: 0,
        pointsHistory: []
    };
    localStorage.setItem('achievements', JSON.stringify([newAchievement]));

    // 追加した達成事項の削除
    deleteAchievement(newAchievementsId);

    // 達成事項が削除されていることを確認する
    const achievements = getAchievements();
    expect(achievements).toEqual([]);
});

test("LocalStorage から存在しない達成事項を削除しようとする", () => {
    // テスト用の達成事項を追加
    const newAchievementsId = Date.parse("2025-03-17T12:00:00.000+09:00");
    const newAchievement = {
        id: newAchievementsId,
        content: "achievement text",
        date: new Date(2025, 3, 17, 12, 0, 0, 0).toLocaleString('ja-JP'),
        points: 0,
        pointsHistory: []
    };
    localStorage.setItem('achievements', JSON.stringify([newAchievement]));

    // 存在しない達成事項の削除
    deleteAchievement("");

    // 既存の達成事項が削除されていないことを確認する
    const achievements = getAchievements();
    expect(achievements).toEqual([newAchievement]);
});
