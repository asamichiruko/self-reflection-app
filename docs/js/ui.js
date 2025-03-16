import { getAchievements, updatePoints, deleteAchievement } from "./storage.js";

// 達成リストを表示する機能
export function renderAchievements() {
    const achievements = getAchievements();
    const achievementsList = document.getElementById('achievements-list');
    const emptyState = document.getElementById('empty-state');

    // 空の状態の表示/非表示を切り替え
    if (achievements.length === 0) {
        emptyState.style.display = 'block';
        achievementsList.innerHTML = '';
        return;
    }

    emptyState.style.display = 'none';

    // リストを最新の順に並べ替え
    achievements.sort((a, b) => b.id - a.id);

    // リストをレンダリング
    achievementsList.innerHTML = achievements.map(achievement => {
        // 加点履歴の表示
        const pointsHistoryHTML = achievement.pointsHistory.map(entry => {
            return `<div>${entry.date}: +${entry.points}点 (${entry.reason || '理由なし'})</div>`;
        }).join('');

        return `
            <li class="achievement-item" data-id="${achievement.id}">
                <div class="achievement-content">${achievement.content}</div>
                <div class="achievement-date">記録日時: ${achievement.date}</div>
                <div class="achievement-points">合計ポイント: ${achievement.points}点</div>
                <div class="achievement-actions">
                    <div>
                        <button class="points-button" data-points="1" data-id="${achievement.id}">+1点</button>
                        <button class="points-button" data-points="3" data-id="${achievement.id}">+3点</button>
                        <button class="points-button" data-points="5" data-id="${achievement.id}">+5点</button>
                        <button class="custom-points-button" data-id="${achievement.id}">カスタム加点</button>
                    </div>
                    <button class="delete-button" data-id="${achievement.id}">削除</button>
                </div>
                <div class="points-history">
                    <h4>加点履歴:</h4>
                    ${pointsHistoryHTML || '<div>まだ加点履歴はありません</div>'}
                </div>
            </li>
        `;
    }).join('');

    addEventListeners();
}

function addEventListeners() {
    // 加点ボタンのイベントリスナー
    document.querySelectorAll('.points-button').forEach(button => {
        button.addEventListener('click', addPoints);
    });

    // カスタム加点ボタンのイベントリスナー
    document.querySelectorAll('.custom-points-button').forEach(button => {
        button.addEventListener('click', addCustomPoints);
    });

    // 削除ボタンのイベントリスナー
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', handleDeleteAchievement);
    });
}

// 加点機能
function addPoints(e) {
    const achievementId = parseInt(e.target.getAttribute('data-id'));
    const pointsToAdd = parseInt(e.target.getAttribute('data-points'));

    const reason = prompt('加点理由（任意）:');
    updatePoints(achievementId, pointsToAdd, reason);
    renderAchievements();
}

// カスタム加点機能
function addCustomPoints(e) {
    const achievementId = parseInt(e.target.getAttribute('data-id'));
    const pointsInput = prompt('加点するポイント数を入力してください:');

    if (pointsInput === null) return;

    const pointsToAdd = parseInt(pointsInput);
    if (isNaN(pointsToAdd) || pointsToAdd <= 0) {
        alert('有効な正の数値を入力してください');
        return;
    }

    const reason = prompt('加点理由（任意）:');
    updatePoints(achievementId, pointsToAdd, reason);
    renderAchievements();
}

function handleDeleteAchievement(e) {
    if (!confirm('この達成を削除してもよろしいですか？この操作は取り消せません。')) {
        return;
    }

    const achievementId = parseInt(e.target.getAttribute('data-id'));
    deleteAchievement(achievementId);
    renderAchievements();
}
