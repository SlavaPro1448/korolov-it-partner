import Intents
import SwiftUI

@main
struct DolmetscherApp: App {
    @StateObject private var model = AppModel()
    @StateObject private var contacts = ContactsStore()
    @StateObject private var live = LiveFeed()
    @StateObject private var calls = CallManager()
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(model)
                .environmentObject(contacts)
                .environmentObject(live)
                .environmentObject(calls)
                // Нажатие на этот звонок в «Недавних» системного «Телефона»: номер — в клавиатуру
                .onContinueUserActivity(NSStringFromClass(INStartCallIntent.self)) { activity in
                    let intent = activity.interaction?.intent as? INStartCallIntent
                    if let value = intent?.contacts?.first?.personHandle?.value { model.dial(value) }
                }
                .onChange(of: scenePhase) { _, phase in
                    if phase == .active { Task { await model.refreshAccount() } }
                }
                .onAppear {
                    // Входящие в приложение: регистрация VoIP-пуша при каждом запуске
                    calls.nameForNumber = { [contacts] number in MainActor.assumeIsolated { contacts.name(for: number) } }
                    calls.enableIncoming(api: model.api)
                    Task { if !contacts.loaded { await contacts.load() } }
                }
        }
    }
}

enum Tab: Hashable { case history, contacts, keypad, rates }

struct RootView: View {
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var calls: CallManager

    var body: some View {
        tabs.sheet(isPresented: $model.showLive) {
            LiveView().presentationDetents([.medium, .large]).presentationDragIndicator(.visible)
        }
        .fullScreenCover(isPresented: Binding(get: { calls.isActive }, set: { if !$0 { calls.dismiss() } })) {
            InCallView()
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
