import { RecordView } from "../RecordView.js";
import { validAchievements, validStars, validRecords } from "./testData.js";

describe("RecordView", () => {
    let recordView;
    let mockViewModel;

    beforeEach(() => {
        document.body.innerHTML = `
        <div id="list-tab">
            <div class="container"></div>
        </div>
        `;

        mockViewModel = {
            subscribe: vi.fn(),
            addAchievement: vi.fn(() => validAchievements),
            addStar: vi.fn(() => validStars),
            getRecords: vi.fn(() => validRecords)
        };
        recordView = new RecordView(mockViewModel);
    });

    afterEach(() => {});

    test("render (empty record)", () => {
        const spyRenderFunc = vi.spyOn(recordView, "renderEmptyState");
        recordView.render([]);
        expect(spyRenderFunc).toHaveBeenCalled();
        spyRenderFunc.mockReset();
    });

    test("render", () => {
        const spyRenderFunc = vi.spyOn(recordView, "renderRecordList");
        const expectRecords = Array.from(validRecords).sort((a, b) => b.date - a.date);
        recordView.render(validRecords);
        expect(spyRenderFunc).toHaveBeenCalledWith(expectRecords);
        spyRenderFunc.mockReset();
    });

    test("renderEmptyState", () => {
        const spyEmptyStateElement = vi.spyOn(recordView, "createEmptyStateElement");

        recordView.renderEmptyState();

        const renderedElement = document.getElementById("empty-state");
        expect(renderedElement.classList).toContain("empty-state");
        expect(spyEmptyStateElement).toHaveBeenCalled();

        spyEmptyStateElement.mockReset();
    });

    test("renderRecordList", () => {
        const spyRecordElement = vi.spyOn(recordView, "createRecordElement");

        recordView.renderRecordList(validRecords);

        const renderedElement = document.getElementById("achievement-list");
        expect(renderedElement).toBeTruthy();
        for (let record of validRecords) {
            expect(spyRecordElement.mock.calls).toContainEqual([record]);
        }

        const buttons = document.querySelectorAll(".star-button");
        const mockPrompt = vi.spyOn(globalThis, "prompt").mockReturnValue("test prompt");

        buttons.forEach((button) => {
            button.click();

            expect(mockPrompt).toHaveBeenCalled();
            expect(mockViewModel.addStar).toHaveBeenCalledWith({
                achievementId: button.getAttribute("achievement-id"),
                content: "test prompt"
            });
        });

        mockPrompt.mockReset();
        spyRecordElement.mockReset();
    });

    test("createEmptyStateElement", () => {
        const elem = recordView.createEmptyStateElement();
        expect(elem.tagName).toBe("P");
    });

    test("createRecordElement", () => {
        const spyContent = vi.spyOn(recordView, "createContentElement");
        const spyDate = vi.spyOn(recordView, "createDateElement");
        const spyAchievementActions = vi.spyOn(recordView, "createAchievementActionsElement");
        const spyTotalStar = vi.spyOn(recordView, "createTotalStarElement");
        const spyStarList = vi.spyOn(recordView, "createStarListElement");

        validRecords.forEach((record) => {
            let elem = recordView.createRecordElement(record);
            expect(elem.classList).toContain("achievement-item");
            expect(elem.getAttribute("achievement-id")).toBe(record.achievement.id);

            expect(spyContent.mock.lastCall).toEqual([record.achievement.content]);
            expect(spyDate.mock.lastCall).toEqual([record.achievement.date]);
            expect(spyAchievementActions.mock.lastCall).toEqual([record.achievement.id]);
            if (!record.stars) {
                return;
            }
            expect(spyTotalStar.mock.lastCall).toEqual([record.stars.length]);
            expect(spyStarList.mock.lastCall).toEqual([record.stars]);
        });

        spyContent.mockReset();
        spyDate.mockReset();
        spyAchievementActions.mockReset();
        spyTotalStar.mockReset();
        spyStarList.mockReset();
    });

    test("createContentElement", () => {
        const elem = recordView.createContentElement("test content");
        expect(elem.textContent).toBe("test content");
        expect(elem.classList).toContain("achievement-content");
    });

    test("createDateElement", () => {
        const date = new Date("2025-04-01");
        const elem = recordView.createDateElement(date);
        expect(elem.textContent).toContain(date.toLocaleString());
        expect(elem.classList).toContain("achievement-date");
    });

    test("createAchievementActionsElement", () => {
        const elem = recordView.createAchievementActionsElement("test-id");
        expect(elem.classList).toContain("achievement-actions");

        const buttons = elem.getElementsByClassName("star-button");
        expect(buttons.length).not.toBe(0);
        for (let button of buttons) {
            expect(button.getAttribute("achievement-id")).toBe("test-id");
        }
    });

    test("createTotalStarElement", () => {
        const elem = recordView.createTotalStarElement(42);
        expect(elem.textContent).toContain("42");
        expect(elem.classList).toContain("achievement-star");
    });

    test("createStarListElement", () => {
        const spy = vi.spyOn(recordView, "createStarListItemElement");

        const elem = recordView.createStarListElement(validStars);
        expect(elem.classList).toContain("star-history");

        console.log(spy.mock.calls);
        validStars.forEach((star) => {
            expect(spy.mock.calls).toContainEqual([star]);
        });
        spy.mockReset();
    });

    test("createStarListItemElement", () => {
        const star = validStars[0];
        const elem = recordView.createStarListItemElement(star);
        expect(elem.textContent).toContain(star.date.toLocaleString());
        expect(elem.textContent).toContain(star.content);
    });
});
