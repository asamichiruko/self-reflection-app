// LocalStorage からデータを取得
export function getAchievements() {
    if (!localStorage.getItem('achievements')) {
        localStorage.setItem('achievements', JSON.stringify([]));
    }
    return JSON.parse(localStorage.getItem('achievements'));
}

// 新しい達成項目を LocalStorage に保存
export function saveAchievement(achievementText) {
    const achievements = getAchievements();
    const newAchievement = {
        id: Date.now(), // ユニークIDとして現在のタイムスタンプを使用
        content: achievementText,
        date: new Date().toLocaleString('ja-JP'),
        points: 0,
        pointsHistory: []
    };

    achievements.push(newAchievement);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    return newAchievement;
}

// ポイントを更新
export function updatePoints(achievementId, pointsToAdd, reason) {
    const achievements = getAchievements();
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);

    if (achievementIndex !== -1) {
        // ポイントを加算
        achievements[achievementIndex].points += pointsToAdd;

        // 加点履歴に追加
        achievements[achievementIndex].pointsHistory.push({
            date: new Date().toLocaleString('ja-JP'),
            points: pointsToAdd,
            reason: reason
        });

        localStorage.setItem('achievements', JSON.stringify(achievements));
        return true;
    }
    return false;
}

// 達成事項の削除
export function deleteAchievement(achievementId) {
    let achievements = getAchievements();
    achievements = achievements.filter(a => a.id !== achievementId);
    localStorage.setItem('achievements', JSON.stringify(achievements));
}
