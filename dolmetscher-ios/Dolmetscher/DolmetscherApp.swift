import SwiftUI

@main
struct DolmetscherApp: App {
    @StateObject private var model = AppModel()
    @StateObject private var contacts = ContactsStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(model)
                .environmentObject(contacts)
        }
    }
}

enum Tab: Hashable { case history, contacts, keypad, rates }

struct RootView: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        TabView(selection: $model.tab) {
            HistoryView()
                .tabItem { Label("Последние", systemImage: "clock.arrow.circlepath") }
                .tag(Tab.history)
            ContactsView()
                .tabItem { Label("Контакты", systemImage: "person.crop.circle") }
                .tag(Tab.contacts)
            KeypadView()
                .tabItem { Label("Клавиатура", systemImage: "circle.grid.3x3.fill") }
                .tag(Tab.keypad)
            RatesView()
                .tabItem { Label("Тарифы", systemImage: "eurosign.circle") }
                .tag(Tab.rates)
        }
    }
}
