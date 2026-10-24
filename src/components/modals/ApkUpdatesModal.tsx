import React, { useState } from 'react';
import { updatesService } from '../../services/updatesService';
import {
  Download,
  Smartphone,
  RefreshCw,
  Sparkles,
  GitBranch,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';

interface ApkUpdatesModalProps {
  onClose: () => void;
}

export const ApkUpdatesModal: React.FC<ApkUpdatesModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'ota' | 'apk' | 'github'>('ota');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [updateReady, setUpdateReady] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const currentVersion = updatesService.getCurrentVersion();
  const channel = updatesService.getChannel();

  const handleCheckForUpdates = async () => {
    setIsChecking(true);
    setUpdateAvailable(false);
    setUpdateReady(false);

    try {
      const res = await updatesService.checkForUpdate();
      setIsChecking(false);
      if (res.available) {
        setUpdateAvailable(true);
      }
    } catch {
      setIsChecking(false);
    }
  };

  const handleDownloadAndApply = async () => {
    setIsDownloading(true);
    setDownloadProgress(20);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 400);

    await updatesService.fetchUpdate();
    clearInterval(interval);
    setDownloadProgress(100);
    setIsDownloading(false);
    setUpdateReady(true);
  };

  const handleReload = () => {
    updatesService.reloadApp();
  };

  const copyToClipboard = (text: string, id: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedCmd(id);
      setTimeout(() => setCopiedCmd(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl h-[85vh] bg-[#14121d] border border-stone-700/70 rounded-3xl flex flex-col overflow-hidden shadow-2xl text-stone-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between shrink-0 bg-[#171524]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold font-display text-white text-base sm:text-lg">
                  APK, Actualizaciones OTA & GitHub
                </h3>
                <span className="text-[10px] font-pixel text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40">
                  v{currentVersion}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Entrega continua: instala una vez el APK y actualiza la app sin reinstalar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex items-center border-b border-stone-800 bg-[#12101b] px-4 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ota')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ota'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualizaciones In-App (OTA)</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'apk'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Generar & Descargar APK</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitHub & Antigravity IDE</span>
          </button>
        </div>

        {/* Contenido según Pestaña */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-sm text-stone-300">
          {/* ========================================================= */}
          {/* PESTAÑA 1: ACTUALIZACIONES IN-APP OVER-THE-AIR (OTA)      */}
          {/* ========================================================= */}
          {activeTab === 'ota' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-stone-900 border border-amber-500/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-pixel text-amber-400 uppercase tracking-widest block mb-1">
                      Sistema EAS Update / Expo Updates
                    </span>
                    <h4 className="font-bold text-white text-base">
                      Actualizaciones sin reinstalar el archivo APK
                    </h4>
                    <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                      Con la configuración incluida en <code className="text-amber-200">app.json</code> y{' '}
                      <code className="text-amber-200">eas.json</code>, cada vez que publiques un cambio, la
                      aplicación descargará automáticamente el nuevo código JS y recursos en segundo plano.
                    </p>
                  </div>
                  <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl shrink-0">
                    <RefreshCw className={`w-6 h-6 ${isChecking ? 'animate-spin' : ''}`} />
                  </div>
                </div>

                {/* Panel de Comprobación en Vivo */}
                <div className="mt-4 pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-stone-300">
                    <div>
                      Canal de distribución: <strong className="text-white capitalize">{channel}</strong>
                    </div>
                    <div>
                      Versión instalada: <strong className="text-white">{currentVersion}</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckForUpdates}
                    disabled={isChecking || isDownloading}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                    <span>{isChecking ? 'Comprobando canal...' : 'Comprobar actualizaciones ahora'}</span>
                  </button>
                </div>
              </div>

              {/* Estado cuando se detecta actualización */}
              {updateAvailable && !updateReady && (
                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-700/80 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-white text-sm">
                        ¡Nueva versión disponible! (v1.0.5)
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      OTA Patch
                    </span>
                  </div>
                  <p className="text-xs text-stone-300">
                    Se han encontrado mejoras en los escenarios (Mañana, Tarde, Noche) y optimizaciones de audio.
                  </p>

                  {isDownloading ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-stone-400">
                        <span>Descargando bundle OTA...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleDownloadAndApply}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar e instalar en la app</span>
                    </button>
                  )}
                </div>
              )}

              {/* Estado cuando la actualización se descargó */}
              {updateReady && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h5 className="font-bold text-sm text-emerald-200">
                        ¡Actualización descargada con éxito!
                      </h5>
                      <p className="text-xs text-stone-300">
                        Reinicia la aplicación para cargar el nuevo código al instante.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReload}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shrink-0 transition-colors shadow-md"
                  >
                    Reiniciar App
                  </button>
                </div>
              )}

              {/* Guía de cómo lanzar actualizaciones OTA desde la terminal */}
              <div className="p-4 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-2">
                <h5 className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>¿Cómo publicar una nueva actualización a los usuarios?</span>
                </h5>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Cuando hagas cambios en el código de Shanti, no necesitas enviar otro APK. Solo ejecuta en tu
                  terminal:
                </p>
                <div className="p-3 bg-black/60 rounded-xl border border-stone-800 flex items-center justify-between font-mono text-xs text-amber-200">
                  <code>npx eas-cli update --branch preview --message "Mejoras de Shanti"</code>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'npx eas-cli update --branch preview --message "Mejoras de Shanti"',
                        'cmd-update'
                      )
                    }
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                  >
                    {copiedCmd === 'cmd-update' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PESTAÑA 2: GENERAR & DESCARGAR ARCHIVO APK                */}
          {/* ========================================================= */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
                <span className="text-[10px] font-pixel text-amber-400 uppercase tracking-widest block">
                  Compilación de APK Autónomo para Android
                </span>
                <h4 className="font-bold text-white text-base">
                  ¿Cómo obtener el archivo .apk instalable en cualquier teléfono?
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  El archivo <code className="text-amber-200">eas.json</code> del proyecto ya está configurado con
                  el perfil <code className="text-amber-200">preview</code> para generar directamente un archivo{' '}
                  <strong>.apk</strong> (no un archivo .aab de Google Play).
                </p>

                <div className="p-3.5 rounded-xl bg-black/50 border border-stone-800 space-y-2">
                  <span className="text-xs font-semibold text-stone-300">
                    Comando de 1 solo paso para compilar el APK en la nube de EAS:
                  </span>
                  <div className="flex items-center justify-between p-2.5 bg-stone-950 rounded-lg border border-stone-800 font-mono text-xs text-amber-200">
                    <code>npx eas-cli build -p android --profile preview</code>
                    <button
                      onClick={() =>
                        copyToClipboard('npx eas-cli build -p android --profile preview', 'cmd-build')
                      }
                      className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                    >
                      {copiedCmd === 'cmd-build' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Al terminar, la consola te devolverá un enlace directo para descargar el archivo{' '}
                    <strong>Shanti.apk</strong> e instalarlo en cualquier dispositivo Android.
                  </p>
                </div>
              </div>

              {/* Instalación instantánea como PWA / WebAPK */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-indigo-200">
                    Instalación alternativa sin compilar (WebAPK)
                  </h5>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    También puedes abrir la URL de la app en Chrome en tu teléfono Android, tocar en los 3 puntos
                    del navegador y elegir <strong>"Instalar aplicación"</strong> o <strong>"Añadir a pantalla de inicio"</strong>.
                    Se instalará como una app nativa con icono de Shanti y se actualizará automáticamente con cada despliegue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PESTAÑA 3: GITHUB & ANTIGRAVITY IDE                       */}
          {/* ========================================================= */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
                <span className="text-[10px] font-pixel text-amber-400 uppercase tracking-widest block">
                  Repositorio Git Inicializado & Listo
                </span>
                <h4 className="font-bold text-white text-base">
                  Subir a tu cuenta de GitHub (como en SpotyLuis)
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Ya hemos inicializado el repositorio local Git en la rama principal <code className="text-amber-200">main</code>{' '}
                  con todos los archivos de Shanti guardados en el commit inicial.
                </p>

                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-stone-300">
                    1. En GitHub, crea un nuevo repositorio vacío (ej: <code className="text-amber-200">shanti</code>).
                  </span>
                  <span className="text-xs font-semibold text-stone-300 block">
                    2. Enlaza tu repositorio remoto y haz push con estos dos comandos:
                  </span>

                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2 font-mono text-xs text-amber-200">
                    <div className="flex items-center justify-between">
                      <code>git remote add origin https://github.com/luismoncadapons/shanti.git</code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            'git remote add origin https://github.com/luismoncadapons/shanti.git',
                            'cmd-remote'
                          )
                        }
                        className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                      >
                        {copiedCmd === 'cmd-remote' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                      <code>git push -u origin main</code>
                      <button
                        onClick={() => copyToClipboard('git push -u origin main', 'cmd-push')}
                        className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                      >
                        {copiedCmd === 'cmd-push' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conexión con Antigravity IDE */}
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-purple-400" />
                  <h5 className="font-bold text-xs text-purple-200">
                    Conectar con Antigravity IDE / Project IDX
                  </h5>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Una vez subido a tu GitHub, puedes abrir **Antigravity IDE** o **Google Project IDX** directamente
                  introduciendo el enlace de tu repositorio de GitHub para continuar programando con agente de IA,
                  soporte completo de emulador Android en la nube y terminal integrado.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
