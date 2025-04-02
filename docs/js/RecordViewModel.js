export class RecordViewModel {
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

    addAchievement({ content }) {
        if (content.trim()) {
            return this.model.addAchievement({ content });
        }
    }

    addStar({ achievementId, content }) {
        return this.model.addStar({ achievementId, content });
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
