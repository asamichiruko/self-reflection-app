import { getAchievements, saveAchievement } from './storage.js';
import { renderAchievements } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // 初期データの確認
    getAchievements();

    // タブ切り替え機能
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // タブのアクティブ状態を切り替え
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // タブコンテンツの表示を切り替え
            const tabName = tab.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}-tab`).classList.add('active');

            // リストタブが選択された場合、リストを更新
            if (tabName === 'list') {
                renderAchievements();
            }
        });
    });

    // 保存ボタンのイベントリスナー
    const saveButton = document.getElementById('save-btn');
    saveButton.addEventListener('click', () => {
        const achievementInput = document.getElementById('achievement');
        const achievementText = achievementInput.value.trim();

        if (achievementText) {
            // 達成の保存と後処理
            saveAchievement(achievementText);
            achievementInput.value = '';
            alert('達成したことを記録しました！');

            // リストタブに切り替え
            tabs[1].click();
        } else {
            alert('達成したことを入力してください');
        }
    });

    // 初期表示時にアクティブなタブのコンテンツを表示
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const tabName = activeTab.getAttribute('data-tab');
        if (tabName === 'list') {
            renderAchievements();
        }
    }
});
