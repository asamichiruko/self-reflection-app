document.addEventListener("DOMContentLoaded", () => {
    const tabModel = new TabModel();
    const tabViewModel = new TabViewModel(tabModel);

    const recordModel = new RecordModel();
    const recordViewModel = new RecordViewModel(recordModel);

    // タブの切替
    const tabElements = document.querySelectorAll(".tab-container .tab");
    const tabContentElements = document.querySelectorAll(".tab-content");
    const tabView = new TabView(tabViewModel, tabElements, tabContentElements);

    // achievement の入力と保存
    const inputView = new InputView(recordViewModel, tabViewModel);

    // できたことの一覧
    const recordListElement = document.querySelector("#list-tab .container");
    const recordView = new RecordView(recordViewModel, recordListElement);

    // データファイルのインポート・エクスポート
    const settingsView = new SettingsView(recordViewModel);
});

class Storage {
    constructor() {}

    loadAchievements() {
        return JSON.parse(localStorage.getItem("achievements")) || [];
    }

    saveAchievements(achievements) {
        localStorage.setItem("achievements", JSON.stringify(achievements));
    }

    loadStars() {
        return JSON.parse(localStorage.getItem("stars")) || [];
    }

    saveStars(stars) {
        localStorage.setItem("stars", JSON.stringify(stars));
    }

    addAchievement(id, content, date) {
        const achievements = this.loadAchievements();
        achievements.push({
            id,
            content,
            date
        });
        this.saveAchievements(achievements);
    }

    addStar(id, achievementId, content, date) {
        const stars = this.loadStars();
        stars.push({
            id,
            achievementId,
            content,
            date
        });
        this.saveStars(stars);
    }

    getAchievements() {
        const achievements = this.loadAchievements();
        return achievements;
    }

    getStars() {
        const stars = this.loadStars();
        return stars;
    }

    generateId() {
        return crypto.randomUUID();
    }

    importAchievements(achievements) {
        const storageAchievements = this.loadAchievements();
        const achievementIds = new Set(storageAchievements.map((a) => a.id));
        achievements.forEach((a) => {
            if (achievementIds.has(a.id)) {
                return;
            }
            achievementIds.add(a.id);
            storageAchievements.push(a);
        });
        this.saveAchievements(storageAchievements);
    }

    importStars(stars) {
        const achievements = this.loadAchievements();
        const storageStars = this.loadStars();
        const starIds = new Set(storageStars.map((a) => a.id));
        const achievementIds = new Set(achievements.map((a) => a.id));
        stars.forEach((a) => {
            if (starIds.has(a.id) || !achievementIds.has(a.achievementId)) {
                return;
            }
            starIds.add(a.id);
            storageStars.push(a);
        });
        this.saveStars(storageStars);
    }
}

class RecordModel {
    constructor() {
        this.storage = new Storage();
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach((listener) => listener());
    }

    addAchievement(content) {
        const id = this.storage.generateId();
        this.storage.addAchievement(id, content, new Date());
        this.notify();
    }

    addStar(achievementId, content) {
        const id = this.storage.generateId();
        this.storage.addStar(id, achievementId, content, new Date());
        this.notify();
    }

    getRecords() {
        const achievements = this.storage.getAchievements();
        const stars = this.storage.getStars();
        const result = Map.groupBy(stars, (star) => {
            return star.achievementId;
        });
        achievements.sort((a, b) => new Date(b.date) - new Date(a.date));
        const records = achievements.map((a) => {
            return {
                achievement: a,
                stars: result.get(a.id)
            };
        });

        return records;
    }

    exportAsJsonString() {
        const achievements = this.storage.loadAchievements();
        const stars = this.storage.loadStars();
        const exportObject = { achievements, stars };
        return JSON.stringify(exportObject);
    }

    importFromJsonString(jsonString) {
        const parsedData = JSON.parse(jsonString);
        const achievements = parsedData["achievements"];
        const stars = parsedData["stars"];
        if (!Array.isArray(achievements) || !Array.isArray(stars)) {
            console.warn(`Invalid data type: ${parsedData}`);
            return false;
        }

        this.storage.importAchievements(achievements);
        this.storage.importStars(stars);
        this.notify();
        return true;
    }
}

class RecordViewModel {
    constructor(recordModel) {
        this.model = recordModel;
        this.listeners = [];

        this.model.subscribe(() => this.notify());
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach((listener) => listener(this));
    }

    addAchievement(content) {
        if (content.trim()) {
            this.model.addAchievement(content);
        }
    }

    addStar(achievementId, content) {
        this.model.addStar(achievementId, content);
    }

    getRecords() {
        return this.model.getRecords();
    }

    exportAsJsonString() {
        return this.model.exportAsJsonString();
    }

    importFromJsonString(jsonString) {
        return this.model.importFromJsonString(jsonString);
    }
}

class RecordView {
    constructor(recordViewModel, rootElement) {
        this.recordViewModel = recordViewModel;
        this.rootElement = rootElement;

        this.recordViewModel.subscribe(() => {
            this.render(this.recordViewModel.getRecords());
        });

        this.render(this.recordViewModel.getRecords());
    }

    render(records) {
        this.rootElement.innerHTML = "";
        if (!records || records.length === 0) {
            this.renderEmptyState();
        } else {
            this.renderRecordList(records);
        }
    }

    renderEmptyState() {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.setAttribute("id", "empty-state");

        const content = this.createEmptyStateElement();
        emptyState.appendChild(content);

        this.rootElement.appendChild(emptyState);
    }

    renderRecordList(records) {
        const recordList = document.createElement("ul");
        recordList.setAttribute("id", "achievement-list");

        records.forEach((record) => {
            const listItem = this.createRecordElement(record);
            recordList.appendChild(listItem);
        });
        this.rootElement.appendChild(recordList);

        const buttons = document.querySelectorAll(".star-button");
        buttons.forEach((button) => {
            button.addEventListener("click", this.addStarEventListener.bind(this));
        });
    }

    createEmptyStateElement() {
        const elem = document.createElement("p");
        elem.textContent = "できたことを記録してみましょう！";
        return elem;
    }

    createRecordElement(record) {
        const achievement = record.achievement;
        const stars = record.stars;

        const listItem = document.createElement("li");
        listItem.className = "achievement-item";
        listItem.setAttribute("achievement-id", achievement.id);

        const content = this.createContentElement(achievement.content);
        listItem.appendChild(content);

        const date = this.createDateElement(achievement.date);
        listItem.appendChild(date);

        const achievementAction = this.createAchievementActionsElement(achievement.id);
        listItem.appendChild(achievementAction);

        if (!stars) {
            return listItem;
        }

        const totalStar = stars.length;
        const totalStarElement = this.createTotalStarElement(totalStar);
        listItem.appendChild(totalStarElement);

        const starsList = this.createStarListElement(stars);
        listItem.appendChild(starsList);

        return listItem;
    }

    createContentElement(contentText) {
        const elem = document.createElement("div");
        elem.className = "achievement-content";
        elem.textContent = contentText;
        return elem;
    }

    createDateElement(date) {
        const elem = document.createElement("div");
        elem.className = "achievement-date";
        elem.textContent = `記録日時: ${new Date(date).toLocaleString()}`;
        return elem;
    }

    createAchievementActionsElement(achievementId) {
        const container = document.createElement("div");
        container.className = "achievement-actions";

        const addStarButton = document.createElement("button");
        addStarButton.setAttribute("achievement-id", achievementId);
        addStarButton.className = "star-button";
        addStarButton.textContent = "ほめる";
        container.appendChild(addStarButton);

        return container;
    }

    createTotalStarElement(totalStar) {
        const elem = document.createElement("div");
        elem.className = "achievement-star";
        elem.textContent = `★ ${totalStar}`;
        return elem;
    }

    createStarListElement(stars) {
        const starList = document.createElement("div");
        starList.className = "star-history";

        const starListHeader = document.createElement("div");
        starListHeader.textContent = "評価履歴";
        starList.appendChild(starListHeader);

        stars.forEach((star) => {
            const listItem = this.createStarListItemElement(star);
            starList.appendChild(listItem);
        });

        return starList;
    }

    createStarListItemElement(star) {
        const elem = document.createElement("div");
        elem.textContent = `${new Date(star.date).toLocaleString()}: ${star.content || "理由を問わず"}`;
        return elem;
    }

    addStarEventListener(e) {
        const content = prompt("コメント（任意）");
        if (content == null) {
            return;
        }

        const achievementId = e.target.getAttribute("achievement-id");
        this.recordViewModel.addStar(achievementId, content);
    }
}

class InputView {
    constructor(recordViewModel, tabViewModel) {
        this.recordViewModel = recordViewModel;
        this.tabViewModel = tabViewModel;

        this.achievementInput = document.getElementById("achievement");
        this.saveButton = document.getElementById("save-btn");
        this.saveButton.addEventListener("click", this.addAchievementEventListener.bind(this));
    }

    render() {}

    addAchievementEventListener() {
        if (!this.achievementInput.value) {
            alert("できたことを入力してください");
            return;
        }
        this.recordViewModel.addAchievement(this.achievementInput.value);
        this.achievementInput.value = "";
        alert("できたことを記録しました！");
        this.tabViewModel.setActiveTab("list");
    }
}

class TabModel {
    constructor() {
        this.activeTab = "input";
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach((listener) => listener(this.activeTab));
    }

    setActiveTab(tab) {
        this.activeTab = tab;
        this.notify();
    }
}

class TabViewModel {
    constructor(model) {
        this.model = model;
        this.listeners = [];

        this.model.subscribe((activeTab) => this.notify(activeTab));
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify(activeTab) {
        this.listeners.forEach((listener) => listener(activeTab));
    }

    setActiveTab(tab) {
        this.model.setActiveTab(tab);
    }

    getActiveTab() {
        return this.model.activeTab;
    }
}

class TabView {
    constructor(viewModel, tabElements, tabContentElements) {
        this.viewModel = viewModel;
        this.tabElements = tabElements;
        this.tabContentElements = tabContentElements;

        this.viewModel.subscribe((activeTab) => this.render(activeTab));

        this.tabElements.forEach((tab) => {
            tab.addEventListener("click", this.activateTab.bind(this));
        });

        this.render(this.viewModel.getActiveTab());
    }

    render(activeTab) {
        this.tabElements.forEach((tab) => {
            if (tab.getAttribute("tab-name") === activeTab) {
                tab.classList.add("active");
            } else {
                tab.classList.remove("active");
            }
        });

        this.tabContentElements.forEach((tabContent) => {
            if (tabContent.getAttribute("tab-name") === activeTab) {
                tabContent.classList.add("active");
            } else {
                tabContent.classList.remove("active");
            }
        });
    }

    activateTab(e) {
        const tabName = e.target.getAttribute("tab-name");
        this.viewModel.notify(tabName);
    }
}

class SettingsView {
    constructor(recordViewModel) {
        this.recordViewModel = recordViewModel;

        this.exportButton = document.getElementById("export-btn");
        this.exportButton.addEventListener("click", this.exportRecordsEventListener.bind(this));

        this.importFile = document.getElementById("import-file");
        this.importButton = document.getElementById("import-btn");
        this.importButton.addEventListener("click", this.importRecordsEventListener.bind(this));
    }

    render() {}

    exportRecordsEventListener() {
        const jsonString = this.recordViewModel.exportAsJsonString();
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "export_data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    async importRecordsEventListener() {
        const file = this.importFile.files[0];
        if (!file || file.type !== "application/json") {
            console.log(file);
            alert(".json形式のファイルを選択してください");
            return;
        }
        const jsonString = await file.text();
        const result = this.recordViewModel.importFromJsonString(jsonString);
        if (result) {
            alert("データの復元を完了しました");
        }
    }
}
