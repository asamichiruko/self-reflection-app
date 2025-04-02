import { TabView } from "../TabView.js";

describe("TabView", () => {
    let tabView;
    let mockTabViewModel;

    beforeEach(() => {
        document.body.innerHTML = `
        <div class="tab-container">
            <div class="tab active" tab-name="input"></div>
            <div class="tab" tab-name="list"></div>
            <div class="tab" tab-name="settings"></div>
        </div>
        <div class="tab-content active" id="input-tab" tab-name="input">
            <div class="container"></div>
        </div>
        <div class="tab-content" id="list-tab" tab-name="list">
            <div class="container"></div>
        </div>
        <div class="tab-content" id="settings-tab" tab-name="settings">
            <div class="container"></div>
        </div>
        `;
        mockTabViewModel = {
            subscribe: vi.fn(),
            notify: vi.fn(),
            getActiveTab: vi.fn()
        };
        tabView = new TabView(mockTabViewModel);
    });

    test("各ボタンが押されたときTabViewModelにアクティブなタブを通知する", () => {
        const tab = tabView.tabElements[0];
        const tabName = tab.getAttribute("tab-name");
        tab.click();

        expect(mockTabViewModel.notify).toHaveBeenCalledWith(tabName);
    });

    test("renderでアクティブなタブのみにactiveクラスを付加する", () => {
        tabView.render("list");
        for (let tab of tabView.tabElements) {
            if (tab.getAttribute("tab-name") === "list") {
                expect(tab.classList).toContain("active");
            } else {
                expect(tab.classList).not.toContain("active");
            }
        }
        for (let tabContent of tabView.tabContentElements) {
            if (tabContent.getAttribute("tab-name") === "list") {
                expect(tabContent.classList).toContain("active");
            } else {
                expect(tabContent.classList).not.toContain("active");
            }
        }
    });
});
