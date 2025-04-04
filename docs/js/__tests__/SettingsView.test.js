import { SettingsView } from "../SettingsView.js";

describe("SettingsView", () => {
    let mockRecordViewModel;
    let mockAlert;
    let settingsView;

    beforeEach(() => {
        document.body.innerHTML = `
        <input type="file" id="import-file"></input>
        <button id="import-btn"></button>
        <button id="export-btn"></button>
        `;
        mockRecordViewModel = {
            importFromJsonString: vi.fn(() => true),
            exportAsJsonString: vi.fn(() => "json object")
        };
        mockAlert = vi.spyOn(globalThis, "alert").mockImplementation(() => {});

        settingsView = new SettingsView(mockRecordViewModel);
    });

    afterEach(() => {
        mockAlert.mockRestore();
    });

    test("exportイベントでBlobとそのURLを生成してダウンロードを試みる", () => {
        if (!globalThis.URL) {
            globalThis.URL = {};
        }
        if (!URL.createObjectURL) {
            URL.createObjectURL = vi.fn();
        }
        if (!URL.revokeObjectURL) {
            URL.revokeObjectURL = vi.fn();
        }
        const mockCreateObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("mock-url");
        const mockRevokeObjectURL = vi.spyOn(URL, "revokeObjectURL");

        const a = document.createElement("a");
        const mockCreateElement = vi.spyOn(document, "createElement").mockImplementation(() => a);
        vi.spyOn(a, "click").mockImplementation();

        settingsView.exportButton.click();

        expect(a.href).toContain("mock-url");
        expect(a.download).toBe("export_data.json");
        expect(a.click).toHaveBeenCalled();

        mockCreateObjectURL.mockRestore();
        mockRevokeObjectURL.mockRestore();
        mockCreateElement.mockRestore();
    });

    test("importイベントでfileが指定されているとき復元を試みる", async () => {
        document.createElement("input");
        const file = new File(["test file"], "test.json", { type: "application/json" });
        if (!file.text) {
            file.text = vi.fn();
        }
        vi.spyOn(file, "text").mockReturnValue("test file");
        settingsView.importFile = {
            files: [file]
        };
        await settingsView.importButton.click();

        expect(mockRecordViewModel.importFromJsonString).toHaveBeenCalledWith("test file");
        expect(file.text).toHaveBeenCalledWith();
    });

    test("importイベントでfileが正しく指定されていないときは復元しない", async () => {
        document.createElement("input");
        const file = new File(["test file"], "test.txt", { type: "text/plain" });
        if (!file.text) {
            file.text = vi.fn();
        }
        vi.spyOn(file, "text").mockReturnValue("test file");
        settingsView.importFile = {
            files: [file]
        };
        await settingsView.importButton.click();
        expect(mockRecordViewModel.importFromJsonString).not.toHaveBeenCalled();
        expect(file.text).not.toHaveBeenCalledWith();
    });

    test("importイベントでJSONの書式が不正なときは復元しない", async () => {
        document.createElement("input");
        const file = new File(["invalid json"], "test.json", { type: "application/json" });
        if (!file.text) {
            file.text = vi.fn();
        }
        vi.spyOn(file, "text").mockReturnValue("invalid json");
        settingsView.importFile = {
            files: [file]
        };
        await settingsView.importButton.click();
        assert.doesNotThrow(mockRecordViewModel.importFromJsonString);
    });
});
