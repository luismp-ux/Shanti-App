/**
 * updatesService.ts - Gestor de actualizaciones Over-The-Air (OTA) dentro de la aplicación.
 *
 * En React Native + Expo:
 * Utiliza 'expo-updates' para verificar el canal EAS y descargar
 * el nuevo código JS y assets sin requerir una nueva instalación de APK.
 *
 * En Web / PWA:
 * Verifica el hash/versión del build y actualiza el Service Worker.
 */

export interface UpdateStatus {
  isChecking: boolean;
  isDownloading: boolean;
  isUpdateAvailable: boolean;
  isDownloaded: boolean;
  currentVersion: string;
  updateVersion?: string;
  lastCheckedTime: string | null;
  channel: string;
}

class InAppUpdatesService {
  private currentVersion = '1.0.4';
  private channel = 'preview';

  /**
   * Comprueba si hay una nueva versión publicada en EAS Update
   */
  public async checkForUpdate(): Promise<{ available: boolean; newVersion?: string }> {
    // Simulación de comprobación de red con el endpoint de EAS / Servidor
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Para fines de prueba y demostración en la app, simulamos que hay disponible un parche OTA
    const hasUpdate = true;
    return {
      available: hasUpdate,
      newVersion: '1.0.5-ota.shanti',
    };
  }

  /**
   * Descarga el bundle de actualización en segundo plano
   */
  public async fetchUpdate(): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return true;
  }

  /**
   * Aplica la actualización y reinicia la app al nuevo estado
   */
  public async reloadApp(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  public getCurrentVersion(): string {
    return this.currentVersion;
  }

  public getChannel(): string {
    return this.channel;
  }
}

export const updatesService = new InAppUpdatesService();
