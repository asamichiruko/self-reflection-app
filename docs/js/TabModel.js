export class TabModel {
    constructor() {
        this.activeTab = "input";
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach((listener) => listener(this.activeTab));
    }

    setActiveTab(tab) {
        this.activeTab = tab;
        this.notify();
    }
}
