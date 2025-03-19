import { renderAchievements } from "../ui";
import { getAchievements, updatePoints, deleteAchievement } from "../storage";

vi.mock("../storage", () => ({
    getAchievements: vi.fn(),
    updatePoints: vi.fn(),
    deleteAchievement: vi.fn()
}));

describe("renderAchievements", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <ul id="achievements-list"></ul>
            <div id="empty-state"></div>
        `;
    });

    test("達成事項が存在しなければ empty-state を表示する", () => {
        getAchievements.mockReturnValue([]);
        renderAchievements();

        expect(document.getElementById("empty-state").style.display).toBe("block");
        expect(document.getElementById("achievements-list").innerHTML).toBe("");
    });

    test("達成事項が存在するときリストを表示する", () => {
        getAchievements.mockReturnValue([
            {
                id: 1, content: "test achievements", date: "2025/03/17 12:00:00", points: 1, pointsHistory: [{
                    date: new Date(2025, 3, 18, 15, 0, 0).toLocaleString('ja-JP'),
                    points: 1,
                    reason: "some reason"
                }]
            }
        ]);

        renderAchievements();

        expect(document.getElementById("empty-state").style.display).toBe("none");
        expect(document.querySelector(".achievement-item")).not.toBeNull();
    });
});

describe("イベントリスナー", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <ul id="achievements-list"></ul>
            <div id="empty-state"></div>
            <ul id="achievements-list">
                <li class="achievement-item" data-id="1">
                    <button class="points-button" data-points="1" data-id="1">+1点</button>
                    <button class="custom-points-button" data-id="1">カスタム加点</button>
                    <button class="delete-button" data-id="1">削除</button>
                </li>
            </ul>
        `;

        renderAchievements();
    });

    test("加点ボタンを click すると updatePoints が呼ばれる", () => {
        vi.spyOn(global, "prompt").mockReturnValue("addPoints reason");
        const button = document.querySelector(".points-button");
        button.click();

        expect(updatePoints).toHaveBeenCalledWith(1, 1, "addPoints reason");
    });

    test("カスタム加点を click して prompt に有効な数値を入力した場合に updatePoints が呼ばれる", () => {
        vi.spyOn(global, "prompt").mockReturnValueOnce("5").mockReturnValueOnce("custom addPoints reason");

        const button = document.querySelector(".custom-points-button");
        button.click();

        expect(updatePoints).toHaveBeenCalledWith(1, 5, "custom addPoints reason");
    });

    test("削除ボタンを click すると deleteAchievement が呼ばれる", () => {
        vi.spyOn(global, "confirm").mockReturnValue(true);

        const button = document.querySelector(".delete-button");
        button.click();

        expect(deleteAchievement).toHaveBeenCalledWith(1);
    });
})
