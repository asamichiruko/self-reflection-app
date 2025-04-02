export class SettingsView {
    constructor(recordViewModel) {
        this.recordViewModel = recordViewModel;

        this.exportButton = document.getElementById("export-btn");
        this.exportButton.addEventListener("click", () => {
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
        });

        this.importFile = document.getElementById("import-file");
        this.importButton = document.getElementById("import-btn");
        this.importButton.addEventListener("click", async () => {
            const file = this.importFile.files[0];
            if (!file || file.type !== "application/json") {
                alert(".json形式のファイルを選択してください");
                return;
            }
            const jsonString = await file.text();
            const result = this.recordViewModel.importFromJsonString(jsonString);
            if (result) {
                alert();
            }
        });
    }
}
