import { InputView } from "../InputView.js";

describe("InputView", () => {
    let mockRecordViewModel;
    let mockTabViewModel;
    let textInput;
    let saveButton;
    let mockAlert;

    beforeEach(() => {
        document.body.innerHTML = `<textarea id="achievement"></textarea>
        <button id="save-btn"></button>`;
        textInput = document.getElementById("achievement");
        saveButton = document.getElementById("save-btn");

        mockAlert = vi.spyOn(globalThis, "alert").mockImplementation(() => {});
        mockRecordViewModel = {
            addAchievement: vi.fn(() => true)
        };
        mockTabViewModel = {
            setActiveTab: vi.fn()
        };
        new InputView(mockRecordViewModel, mockTabViewModel);
    });

    afterEach(() => {
        mockAlert.mockRestore();
    });

    test("入力内容があるときできたことを記録する", () => {
        textInput.value = "test achievement";

        saveButton.click();

        expect(mockAlert).toHaveBeenCalled();
        expect(mockRecordViewModel.addAchievement).toHaveBeenCalledWith({
            content: "test achievement"
        });
    });

    test("入力内容がないときそのことを知らせる", () => {
        textInput.value = "";

        saveButton.click();
        expect(alert).toHaveBeenCalled();
        expect(mockRecordViewModel.addAchievement).not.toHaveBeenCalled();
    });

    test("書き込み後に入力欄が空になる", () => {
        textInput.value = "test achievement";
        saveButton.click();
        expect(textInput.value).toBe("");
    });

    test("書き込み後にリストタブがアクティブになる", () => {
        textInput.value = "test achievement";
        saveButton.click();
        expect(mockTabViewModel.setActiveTab).toHaveBeenCalledWith("list");
    });
});
