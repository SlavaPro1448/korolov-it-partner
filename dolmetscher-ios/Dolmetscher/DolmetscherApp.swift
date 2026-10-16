import SwiftUI

@main
struct DolmetscherApp: App {
    @StateObject private var model = AppModel()
    @StateObject private var contacts = ContactsStore()
    @StateObject private var live = LiveFeed()
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(model)
                .environmentObject(contacts)
                .environmentObject(live)
                .onChange(of: scenePhase) { _, phase in
                    if phase == .active { Task { await model.refreshAccount() } }
                }
        }
    }
}

enum Tab: Hashable { case history, contacts, keypad, rates }

struct RootView: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        tabs.sheet(isPresented: $model.showLive) {
            LiveView().presentationDetents([.medium, .large]).presentationDragIndicator(.visible)
        }
    }

    private var tabs: some View {
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
