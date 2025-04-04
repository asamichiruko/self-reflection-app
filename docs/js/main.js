import { Storage } from "./Storage.js";
import { RecordModel } from "./RecordModel.js";
import { RecordView } from "./RecordView.js";
import { RecordViewModel } from "./RecordViewModel.js";
import { InputView } from "./InputView.js";
import { SettingsView } from "./SettingsView.js";
import { TabModel } from "./TabModel.js";
import { TabView } from "./TabView.js";
import { TabViewModel } from "./TabViewModel.js";

document.addEventListener("DOMContentLoaded", () => {
    const tabModel = new TabModel();
    const tabViewModel = new TabViewModel(tabModel);

    const storage = new Storage();
    const recordModel = new RecordModel(storage);
    const recordViewModel = new RecordViewModel(recordModel);

    new TabView(tabViewModel);
    new InputView(recordViewModel, tabViewModel);
    new RecordView(recordViewModel);
    new SettingsView(recordViewModel);
});
