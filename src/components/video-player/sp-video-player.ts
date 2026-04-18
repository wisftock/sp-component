import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-video-player.css?inline";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function fmt(s: number): string {
  if (!isFinite(s)) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
  return `${m}:${sec.toString().padStart(2,"0")}`;
}

/**
 * Video Player — reproductor de video con controles personalizados.
 *
 * @element sp-video-player
 *
 * @prop {string}  src       - URL del video
 * @prop {string}  poster    - Imagen de previsualización
 * @prop {boolean} autoplay
 * @prop {boolean} loop
 * @prop {boolean} muted
 */
@customElement("sp-video-player")
export class SpVideoPlayerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) src = "";
  @property({ type: String }) poster = "";
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean }) muted = false;

  @state() private _playing = false;
  @state() private _current = 0;
  @state() private _duration = 0;
  @state() private _volume = 1;
  @state() private _muted = false;
  @state() private _speedIdx = 2;
  @state() private _fullscreen = false;

  @query("video") private _video!: HTMLVideoElement;
  @query(".sp-video") private _wrap!: HTMLDivElement;

  override connectedCallback() {
    super.connectedCallback();
    this._muted = this.muted;
    document.addEventListener("fullscreenchange", () => {
      this._fullscreen = !!document.fullscreenElement;
    });
  }

  #toggle() {
    if (this._playing) this._video.pause();
    else this._video.play();
  }

  #seek(e: Event) {
    const v = Number((e.target as HTMLInputElement).value);
    this._video.currentTime = v;
    this._current = v;
  }

  #volume(e: Event) {
    const v = Number((e.target as HTMLInputElement).value);
    this._volume = v;
    this._video.volume = v;
    this._muted = v === 0;
    this._video.muted = this._muted;
  }

  #toggleMute() {
    this._muted = !this._muted;
    this._video.muted = this._muted;
  }

  #cycleSpeed() {
    this._speedIdx = (this._speedIdx + 1) % SPEEDS.length;
    this._video.playbackRate = SPEEDS[this._speedIdx]!;
  }

  #skip(s: number) {
    this._video.currentTime = Math.max(0, Math.min(this._duration, this._video.currentTime + s));
  }

  #fullscreen() {
    if (!document.fullscreenElement) {
      this._wrap.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  override render() {
    const progress = this._duration ? (this._current / this._duration) * 100 : 0;
    const speed = SPEEDS[this._speedIdx];

    return html`
      <div class=${classMap({ "sp-video": true, "paused": !this._playing })}>
        <video
          src=${this.src}
          poster=${this.poster}
          ?autoplay=${this.autoplay}
          ?loop=${this.loop}
          ?muted=${this._muted}
          @timeupdate=${() => { this._current = this._video.currentTime; }}
          @loadedmetadata=${() => { this._duration = this._video.duration; }}
          @play=${() => { this._playing = true; }}
          @pause=${() => { this._playing = false; }}
          @ended=${() => { this._playing = false; this._current = 0; }}
          @click=${() => this.#toggle()}
        ></video>

        <!-- Play overlay (shown when paused) -->
        <div class="sp-video-play-overlay" @click=${() => this.#toggle()}>
          <div class="sp-video-play-overlay-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </div>
        </div>

        <!-- Controls -->
        <div class="sp-video-controls">
          <!-- Seek -->
          <div class="sp-video-seek-wrap">
            <div class="sp-video-seek-fill" style="width:${progress}%"></div>
            <input
              type="range"
              class="sp-video-seek"
              min="0"
              max=${this._duration || 100}
              step="0.1"
              .value=${String(this._current)}
              @input=${(e: Event) => this.#seek(e)}
            />
          </div>

          <!-- Bottom bar -->
          <div class="sp-video-bar">
            <!-- Play/Pause -->
            <button class="sp-video-btn" @click=${() => this.#toggle()}>
              ${this._playing
                ? html`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
                : html`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`
              }
            </button>

            <!-- Skip -->
            <button class="sp-video-btn" @click=${() => this.#skip(-10)} title="−10s">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2.5 12a9.5 9.5 0 1 0 9.5-9.5A9.75 9.75 0 0 0 5.2 4.7L2.5 7.5"/>
                <path d="M2.5 2.5v5h5"/>
              </svg>
            </button>
            <button class="sp-video-btn" @click=${() => this.#skip(10)} title="+10s">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 12a9.5 9.5 0 1 1-9.5-9.5A9.75 9.75 0 0 1 18.8 4.7L21.5 7.5"/>
                <path d="M21.5 2.5v5h-5"/>
              </svg>
            </button>

            <!-- Time -->
            <span class="sp-video-time">${fmt(this._current)} / ${fmt(this._duration)}</span>

            <div class="sp-video-spacer"></div>

            <!-- Speed -->
            <button class="sp-video-speed" @click=${() => this.#cycleSpeed()}>
              ${speed === 1 ? "1×" : `${speed}×`}
            </button>

            <!-- Volume -->
            <div class="sp-video-vol-group">
              <button class="sp-video-btn" @click=${() => this.#toggleMute()}>
                ${this._muted || this._volume === 0
                  ? html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
                  : html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
                }
              </button>
              <input
                type="range"
                class="sp-video-vol-slider"
                min="0"
                max="1"
                step="0.05"
                .value=${String(this._muted ? 0 : this._volume)}
                @input=${(e: Event) => this.#volume(e)}
              />
            </div>

            <!-- Fullscreen -->
            <button class="sp-video-btn" @click=${() => this.#fullscreen()}>
              ${this._fullscreen
                ? html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`
                : html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`
              }
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-video-player": SpVideoPlayerComponent; }
}
