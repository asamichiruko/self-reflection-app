export class TabView {
    constructor(viewModel) {
        this.viewModel = viewModel;
        this.viewModel.subscribe((activeTab) => this.render(activeTab));

        this.tabElements = document.querySelectorAll(".tab-container .tab");
        this.tabContentElements = document.querySelectorAll(".tab-content");

        this.tabElements.forEach((tab) => {
            tab.addEventListener("click", (e) => {
                const tabName = e.target.getAttribute("tab-name");
                this.viewModel.notify(tabName);
            });
        });

        this.render(this.viewModel.getActiveTab());
    }

    render(activeTab) {
        this.tabElements.forEach((tab) => {
            if (tab.getAttribute("tab-name") === activeTab) {
                tab.classList.add("active");
            } else {
                tab.classList.remove("active");
            }
        });

        this.tabContentElements.forEach((tabContent) => {
            if (tabContent.getAttribute("tab-name") === activeTab) {
                tabContent.classList.add("active");
            } else {
                tabContent.classList.remove("active");
            }
        });
    }
}
