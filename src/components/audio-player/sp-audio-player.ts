import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import styles from "./sp-audio-player.css?inline";
import { SpConfig } from "../../config.js";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function fmt(s: number): string {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/**
 * Audio Player — reproductor de audio con controles personalizados.
 *
 * @element sp-audio-player
 *
 * @prop {string}  src     - URL del archivo de audio
 * @prop {string}  title   - Título de la pista
 * @prop {string}  artist  - Artista
 * @prop {string}  cover   - URL de la imagen de portada
 * @prop {boolean} autoplay
 * @prop {boolean} loop
 */
@customElement("sp-audio-player")
export class SpAudioPlayerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) src = "";
  @property({ type: String }) title = "";
  @property({ type: String }) artist = "";
  @property({ type: String }) cover = "";
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) loop = false;

  @state() private _playing = false;
  @state() private _current = 0;
  @state() private _duration = 0;
  @state() private _volume = 1;
  @state() private _muted = false;
  @state() private _speedIdx = 2; // index into SPEEDS = 1x

  @query("audio") private _audio!: HTMLAudioElement;

  #play() {
    if (this._playing) {
      this._audio.pause();
    } else {
      this._audio.play();
    }
  }

  #seek(e: Event) {
    const v = Number((e.target as HTMLInputElement).value);
    this._audio.currentTime = v;
    this._current = v;
  }

  #volume(e: Event) {
    const v = Number((e.target as HTMLInputElement).value);
    this._volume = v;
    this._audio.volume = v;
    this._muted = v === 0;
  }

  #toggleMute() {
    this._muted = !this._muted;
    this._audio.muted = this._muted;
  }

  #cycleSpeed() {
    this._speedIdx = (this._speedIdx + 1) % SPEEDS.length;
    this._audio.playbackRate = SPEEDS[this._speedIdx]!;
  }

  #skip(s: number) {
    this._audio.currentTime = Math.max(0, Math.min(this._duration, this._audio.currentTime + s));
  }

  override render() {
    const progress = this._duration ? (this._current / this._duration) * 100 : 0;
    const speed = SPEEDS[this._speedIdx];

    return html`
      <audio
        src=${this.src}
        ?autoplay=${this.autoplay}
        ?loop=${this.loop}
        @timeupdate=${() => { this._current = this._audio.currentTime; }}
        @loadedmetadata=${() => { this._duration = this._audio.duration; }}
        @play=${() => { this._playing = true; }}
        @pause=${() => { this._playing = false; }}
        @ended=${() => { this._playing = false; this._current = 0; }}
      ></audio>

      <div class="sp-audio">
        <!-- Cover -->
        <div class="sp-audio-cover">
          ${this.cover ? html`<img src=${this.cover} alt=${this.title}/>` : html`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          `}
        </div>

        <!-- Info -->
        ${this.title || this.artist ? html`
          <div class="sp-audio-info">
            ${this.title ? html`<div class="sp-audio-title">${this.title}</div>` : nothing}
            ${this.artist ? html`<div class="sp-audio-artist">${this.artist}</div>` : nothing}
          </div>
        ` : nothing}

        <!-- Controls -->
        <div class="sp-audio-controls">
          <button class="sp-audio-btn" @click=${() => this.#skip(-10)} title="−10s">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/><text x="9" y="16" font-size="7" fill="currentColor" stroke="none">10</text>
            </svg>
          </button>
          <button class="sp-audio-btn sp-audio-btn--play" @click=${() => this.#play()}>
            ${this._playing
              ? html`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
              : html`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`
            }
          </button>
          <button class="sp-audio-btn" @click=${() => this.#skip(10)} title="+10s">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/><text x="9" y="16" font-size="7" fill="currentColor" stroke="none">10</text>
            </svg>
          </button>
        </div>

        <!-- Progress -->
        <div class="sp-audio-progress-wrap">
          <input
            type="range"
            class="sp-audio-seek"
            min="0"
            max=${this._duration || 100}
            step="0.1"
            .value=${String(this._current)}
            @input=${(e: Event) => this.#seek(e)}
            style="background: linear-gradient(to right, var(--sp-primary,#6366f1) ${progress}%, var(--sp-bg-muted,#e5e7eb) ${progress}%)"
          />
          <div class="sp-audio-time">
            <span>${fmt(this._current)}</span>
            <span>${fmt(this._duration)}</span>
          </div>
        </div>

        <!-- Volume -->
        <div class="sp-audio-volume">
          <button class="sp-audio-btn" @click=${() => this.#toggleMute()} style="width:28px;height:28px">
            ${this._muted || this._volume === 0
              ? html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
              : html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
            }
          </button>
          <input
            type="range"
            class="sp-audio-volume-slider"
            min="0"
            max="1"
            step="0.05"
            .value=${String(this._muted ? 0 : this._volume)}
            @input=${(e: Event) => this.#volume(e)}
          />
        </div>

        <!-- Speed -->
        <button class="sp-audio-speed" @click=${() => this.#cycleSpeed()} title=${SpConfig.locale.audioPlayer.speedLabel}>
          ${speed === 1 ? "1×" : `${speed}×`}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-audio-player": SpAudioPlayerComponent; }
}
