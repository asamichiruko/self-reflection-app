export class RecordModel {
    constructor(storage) {
        this.storage = storage;
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach((listener) => listener());
    }

    addAchievement({ content }) {
        const id = this.storage.generateId();
        const date = new Date();
        const result = this.storage.addAchievement({ id, content, date });
        if (result) {
            this.notify();
        }
        return result;
    }

    addStar({ achievementId, content }) {
        const id = this.storage.generateId();
        const date = new Date();
        const result = this.storage.addStar({ id, achievementId, content, date });
        if (result) {
            this.notify();
        }
        return result;
    }

    getRecords() {
        const achievements = this.storage.getAchievements();
        const stars = this.storage.getStars();
        const result = Map.groupBy(stars, (star) => {
            return star.achievementId;
        });
        const records = achievements.map((a) => {
            return {
                achievement: a,
                stars: result.get(a.id) || []
            };
        });

        return records;
    }

    exportAsJsonString() {
        const achievements = this.storage.getAchievements();
        const stars = this.storage.getStars();
        const exportObject = { achievements, stars };
        return JSON.stringify(exportObject);
    }

    importFromJsonString(jsonString) {
        let parsedData;
        try {
            parsedData = JSON.parse(jsonString);
        } catch (err) {
            if (err instanceof SyntaxError) {
                console.warn(`JSON Syntax Error: ${err.message}`);
                return false;
            } else {
                throw err;
            }
        }
        let achievements = parsedData["achievements"];
        let stars = parsedData["stars"];
        if (!Array.isArray(achievements) || !Array.isArray(stars)) {
            console.warn(`Invalid data type: ${parsedData}`);
            return false;
        }
        achievements.map((a) => {
            a.date = new Date(a.date);
            return a;
        });
        stars.map((a) => {
            a.date = new Date(a.date);
            return a;
        });

        this.storage.addAchievements(achievements);
        this.storage.addStars(stars);
        this.notify();
        return true;
    }
}
