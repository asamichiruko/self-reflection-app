export class RecordView {
    constructor(recordViewModel) {
        this.recordViewModel = recordViewModel;
        this.recordViewModel.subscribe(() => {
            this.render(this.recordViewModel.getRecords());
        });

        this.rootElement = document.querySelector("#list-tab .container");

        this.render(this.recordViewModel.getRecords());
    }

    render(records) {
        this.rootElement.innerHTML = "";
        if (!records || records.length === 0) {
            this.renderEmptyState();
        } else {
            records.sort((a, b) => b.achievement.date - a.achievement.date);
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
            button.addEventListener("click", (e) => {
                const content = prompt("コメント（任意）");
                if (content == null) {
                    return;
                }

                const achievementId = e.target.getAttribute("achievement-id");
                this.recordViewModel.addStar({ achievementId, content });
            });
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
}
