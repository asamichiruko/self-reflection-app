export class Storage {
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

    addAchievement({ id, content, date }) {
        const achievement = { id, content, date };
        if (!this.isValidAchievement(achievement)) {
            return false;
        }
        const achievements = this.loadAchievements();
        achievements.push(achievement);
        this.saveAchievements(achievements);
        return true;
    }

    addStar({ id, achievementId, content, date }) {
        const star = { id, achievementId, content, date };
        if (!this.isValidStar(star)) {
            return false;
        }
        const stars = this.loadStars();
        stars.push(star);
        this.saveStars(stars);
        return true;
    }

    getAchievements() {
        let achievements = this.loadAchievements();
        achievements.map((a) => {
            a.date = new Date(a.date);
            return a;
        });
        return achievements;
    }

    getStars() {
        const stars = this.loadStars();
        stars.map((a) => {
            a.date = new Date(a.date);
            return a;
        });
        return stars;
    }

    generateId() {
        return crypto.randomUUID();
    }

    isValidId(id) {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return id && uuidRegex.test(id);
    }

    addAchievements(achievements) {
        const storageAchievements = this.loadAchievements();
        const achievementIds = new Set(storageAchievements.map((a) => a.id));
        achievements.forEach((a) => {
            const achievement = { id: a.id, content: a.content, date: a.date };
            if (!this.isValidAchievement(achievement) || achievementIds.has(a.id)) {
                return;
            }
            achievementIds.add(a.id);
            storageAchievements.push(achievement);
        });
        this.saveAchievements(storageAchievements);
    }

    addStars(stars) {
        const achievements = this.loadAchievements();
        const storageStars = this.loadStars();
        const starIds = new Set(storageStars.map((a) => a.id));
        const achievementIds = new Set(achievements.map((a) => a.id));
        stars.forEach((a) => {
            const star = {
                id: a.id,
                achievementId: a.achievementId,
                content: a.content,
                date: a.date
            };
            if (
                !this.isValidStar(star) ||
                starIds.has(a.id) ||
                !achievementIds.has(a.achievementId)
            ) {
                return;
            }
            starIds.add(a.id);
            storageStars.push(star);
        });
        this.saveStars(storageStars);
    }

    isValidAchievement({ id, content, date }) {
        let isValid = true;
        isValid = isValid && this.isValidId(id);
        isValid = isValid && content && content !== "";
        isValid = isValid && new Date(date).toString() !== "Invalid Date";

        return isValid;
    }

    isValidStar({ id, achievementId, content, date }) {
        let isValid = true;
        isValid = isValid && this.isValidId(id);
        isValid = isValid && this.isValidId(achievementId);
        isValid = isValid && typeof content == "string";
        isValid = isValid && new Date(date).toString() !== "Invalid Date";

        return isValid;
    }
}
