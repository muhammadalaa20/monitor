// lib/alerts.ts
let alertAudio: HTMLAudioElement | null = null;

export function initAlertSound() {
  if (typeof window !== "undefined") {
    alertAudio = new Audio("/alert.mp3");
    alertAudio.load(); // Preload it
  }
}

export function playAlertSound() {
  if (!alertAudio) return;
  alertAudio.currentTime = 0;
  alertAudio
    .play()
    .catch((err) => {
      console.warn("Sound blocked or failed to play:", err);
    });
}
