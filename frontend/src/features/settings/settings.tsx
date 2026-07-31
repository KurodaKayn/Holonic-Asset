import { SettingsWorkspace } from "./settings-workspace";
import { useSettings } from "./state/use-settings";

export function Settings() {
  const settings = useSettings();

  return <SettingsWorkspace settings={settings} />;
}
