// alerts.ts
let audio: HTMLAudioElement | null = null;

export function initAlertSound() {
  if (!audio) {
    audio = new Audio("/alert.mp3");
    audio.load();
    document.body.addEventListener("click", () => {
      audio!.play().catch(() => { }); // "Unlock" the audio
    }, { once: true });
  }
}

export function playAlertSound() {
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => { }); // Fail silently if still blocked
  }
}
