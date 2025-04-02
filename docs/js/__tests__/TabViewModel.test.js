import { TabViewModel } from "../TabViewModel.js";

describe("TabViewModel", () => {
    let tabViewModel;
    let mockTabModel;

    beforeEach(() => {
        mockTabModel = {
            subscribe: vi.fn(),
            setActiveTab: vi.fn(),
            activeTab: "input"
        };
        tabViewModel = new TabViewModel(mockTabModel);
    });

    test("getActiveTab で アクティブなタブを取得する", () => {
        const activeTab = tabViewModel.getActiveTab();
        expect(activeTab).toBe(mockTabModel.activeTab);
    });

    test("setActiveTab が TabModel に移譲される", () => {
        tabViewModel.setActiveTab("list");
        expect(mockTabModel.setActiveTab).toHaveBeenCalled();
    });
});
