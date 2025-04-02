export class InputView {
    constructor(recordViewModel, tabViewModel) {
        this.recordViewModel = recordViewModel;
        this.tabViewModel = tabViewModel;

        this.achievementInput = document.getElementById("achievement");
        this.saveButton = document.getElementById("save-btn");

        this.saveButton.addEventListener("click", () => {
            if (!this.achievementInput.value) {
                alert("できたことを入力してください");
                return;
            }
            const result = this.recordViewModel.addAchievement({
                content: this.achievementInput.value
            });
            if (result) {
                this.achievementInput.value = "";
                alert("できたことを記録しました！");
                this.tabViewModel.setActiveTab("list");
            } else {
                alert("記録に失敗しました。時間をおいて再度お試しください");
            }
        });
    }
}
