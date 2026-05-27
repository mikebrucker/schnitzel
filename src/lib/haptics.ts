import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

const isNative = Capacitor.isNativePlatform();

export const haptics = {
  async tap(): Promise<void> {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      /* silent */
    }
  },

  async correct(): Promise<void> {
    if (!isNative) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      /* silent */
    }
  },

  async wrong(): Promise<void> {
    if (!isNative) return;
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch {
      /* silent */
    }
  },
};
