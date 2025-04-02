import { TabModel } from "../TabModel.js";

describe("TabModel", () => {
    let tabModel;

    beforeEach(() => {
        tabModel = new TabModel();
    });

    test("activeTab の初期値が input である", () => {
        expect(tabModel.activeTab).toBe("input");
    });

    test("activeTab がセットされたときにlistenerに通知する", () => {
        const listener = vi.fn();
        tabModel.subscribe(listener);
        tabModel.setActiveTab("list");

        expect(listener).toHaveBeenCalledWith("list");
    });
});
