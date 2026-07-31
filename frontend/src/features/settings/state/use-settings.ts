import { usePreferencesStore } from "./preferences-store";

export function useSettings() {
  const compact = usePreferencesStore((state) => state.compact);
  const notifications = usePreferencesStore((state) => state.notifications);
  const toggleCompact = usePreferencesStore((state) => state.toggleCompact);
  const toggleNotifications = usePreferencesStore(
    (state) => state.toggleNotifications,
  );

  return {
    model: { compact, notifications },
    actions: { toggleCompact, toggleNotifications },
  };
}

export type SettingsController = ReturnType<typeof useSettings>;
