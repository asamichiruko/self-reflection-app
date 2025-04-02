export class TabViewModel {
    constructor(model) {
        this.model = model;
        this.listeners = [];

        this.model.subscribe((activeTab) => this.notify(activeTab));
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify(activeTab) {
        this.listeners.forEach((listener) => listener(activeTab));
    }

    setActiveTab(tab) {
        this.model.setActiveTab(tab);
    }

    getActiveTab() {
        return this.model.activeTab;
    }
}
