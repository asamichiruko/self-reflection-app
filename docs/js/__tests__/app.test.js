import { getAchievements, saveAchievement } from "../storage.js";
import { renderAchievements } from "../ui.js";
import "../app.js"

vi.mock("../storage.js", () => ({
    getAchievements: vi.fn(),
    saveAchievement: vi.fn()
}));

vi.mock("../ui.js", () => ({
    renderAchievements: vi.fn()
}));

beforeEach(() => {
    document.body.innerHTML = `
        <div class="tabs">
            <div class="tab active" data-tab="input">記入フォーム</div>
            <div class="tab" data-tab="list">達成事項リスト</div>
        </div>
        <div class="tab-content active" id="input-tab">
            <textarea id="achievement"></textarea>
            <button id="save-btn">達成事項の保存</button>
        </div>
        <div class="tab-content" id="list-tab"></div>
    `;

    document.dispatchEvent(new Event("DOMContentLoaded"))
});

test("list-tab を click すると対応する .tab, .tab-content が active になる", () => {
    const inputTab = document.querySelector("[data-tab='input']");
    const listTab = document.querySelector("[data-tab='list']");
    const listTabContent = document.getElementById("list-tab");

    inputTab.click();
    listTab.click();

    expect(listTab.classList).toContain("active");
    expect(listTabContent.classList).toContain("active");
});

test("input-tab を click すると対応する .tab, .tab-content が active になる", () => {
    const listTab = document.querySelector("[data-tab='list']");
    const inputTab = document.querySelector("[data-tab='input']");
    const inputTabContent = document.getElementById("input-tab");

    listTab.click();
    inputTab.click();

    expect(inputTab.classList).toContain("active");
    expect(inputTabContent.classList).toContain("active");
});

test("list-tab が active になった際に renderAchievements が呼ばれる", () => {
    const listTab = document.querySelector("[data-tab='list']");

    listTab.click();

    expect(renderAchievements).toHaveBeenCalled();
});

test("achievement が空の状態で save-btn を click すると記録が拒否される", () => {
    const saveButton = document.getElementById("save-btn");

    vi.spyOn(global, "alert").mockImplementation(() => { });

    saveButton.click();

    expect(alert).toHaveBeenCalled();
});

test("achievement が空でない状態で save-btn を click すると saveAchievement が呼ばれる", () => {
    const saveButton = document.getElementById("save-btn");
    const achievementInput = document.getElementById("achievement");
    const listTab = document.querySelector("[data-tab='list']");
    const listTabContent = document.getElementById("list-tab");

    vi.spyOn(global, "alert").mockImplementation(() => { });

    achievementInput.value = "test achievement";
    saveButton.click();

    expect(alert).toHaveBeenCalled();
    expect(saveAchievement).toHaveBeenCalledWith("test achievement");
    expect(achievementInput.value).toBe("");
    expect(listTab.classList).toContain("active");
    expect(listTabContent.classList).toContain("active");
});
