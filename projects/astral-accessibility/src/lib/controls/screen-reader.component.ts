import { DOCUMENT, NgIf, NgClass } from "@angular/common";
import { Component, inject, Renderer2, Optional, SkipSelf } from "@angular/core";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from "../izmo-accessibility.component";

@Component({
  selector: "izmo-screen-reader",
  standalone: true,
  template: `
    <button
      [disabled]="!synthesisAvailable"
      (click)="nextState()"
      [ngClass]="{
        'in-use': currentState !== 0,
        'disabled-button': !synthesisAvailable
      }"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div
            class="icon action-icon d-flex align-items-center"
            [ngClass]="{
              inactive: currentState === 0,
              active: currentState !== 0,
              disabled: !synthesisAvailable
            }"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 40 27"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="vlgiro5t1a">
                  <path d="M1440 0v900H0V0h1440z" />
                </clipPath>
                <clipPath id="avls4jsytb">
                  <path
                    d="M13.956 0a1.266 1.266 0 0 1 1.26 1.058L19 23.735l3.277-19.642a1.266 1.266 0 0 1 2.486-.07l3.184 14.086 1.909-6.482a1.266 1.266 0 0 1 2.417-.043l1.294 3.877.52-1.563a1.267 1.267 0 0 1 1.203-.864h2.077a.633.633 0 1 1 0 1.265H35.29l-.52 1.562a1.267 1.267 0 0 1-2.403 0l-1.296-3.877-1.909 6.482c-.162.553-.679.926-1.255.907a1.25 1.25 0 0 1-1.196-.985L23.527 4.304 20.25 23.943A1.247 1.247 0 0 1 19 25a1.247 1.247 0 0 1-1.25-1.057L13.966 1.268l-2.748 18.294a1.266 1.266 0 0 1-2.478.131L6.177 9.882l-1.63 3.668a1.267 1.267 0 0 1-1.159.749H.633a.633.633 0 1 1 0-1.265h2.755l1.632-3.67a1.267 1.267 0 0 1 2.383.195l2.563 9.812 2.748-18.293A1.266 1.266 0 0 1 13.956 0z"
                  />
                </clipPath>
              </defs>
              <g clip-path="url(#vlgiro5t1a)" transform="translate(-1084 -271)">
                <g clip-path="url(#avls4jsytb)" transform="translate(1085 272)">
                  <path fill="currentColor" d="M0 0h38v25H0V0z" />
                </g>
                <path
                  d="M1104 297a1.247 1.247 0 0 1-1.25-1.057l-3.784-22.675-2.748 18.294a1.266 1.266 0 0 1-2.478.131l-2.563-9.811-1.63 3.668a1.267 1.267 0 0 1-1.159.749h-2.755a.633.633 0 1 1 0-1.265h2.755l1.632-3.67a1.267 1.267 0 0 1 2.383.195l2.563 9.812 2.748-18.293a1.266 1.266 0 0 1 2.502-.02l3.784 22.677 3.277-19.642a1.266 1.266 0 0 1 2.486-.07l3.184 14.086 1.909-6.482a1.266 1.266 0 0 1 2.417-.043l1.294 3.877.52-1.563a1.267 1.267 0 0 1 1.203-.864h2.077a.633.633 0 1 1 0 1.265h-2.077l-.52 1.562a1.267 1.267 0 0 1-2.403 0l-1.296-3.877-1.909 6.482c-.162.553-.679.926-1.255.907a1.25 1.25 0 0 1-1.196-.985l-3.184-14.084-3.277 19.639A1.247 1.247 0 0 1 1104 297z"
                  stroke="currentColor"
                  fill="none"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
          </div>

          <div class="state-dots-wrap">
            <span>{{
              synthesisAvailable ? states[currentState] : unavailableMessage
            }}</span>            <div
              class="dots"
              [ngClass]="{ inactive: currentState === 0 }"
            >
              <div
                class="dot"
                [ngClass]="{ active: currentState === 1 }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: currentState === 2 }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: currentState === 3 }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <izmo-widget-checkmark
        [isActive]="currentState !== 0"
      ></izmo-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
})
export class ScreenReaderComponent {
  globalListenFunction: Function;
  speech = new SpeechSynthesisUtterance();
  userAgent = navigator.userAgent;
  isApple = false;
  isEdgeAndroid = false;
  synthesisAvailable = true;
  
  i18n = inject(I18nService);

  constructor(
    private renderer: Renderer2,
    @Optional() @SkipSelf() private parent?: IzmoAccessibilityComponent
  ) {
    if (this.parent) {
      this.parent.resetEvent.subscribe(() => this.reset());
    }

    // How to use Web Speech API
    // https://betterprogramming.pub/convert-text-to-speech-using-web-speech-api-in-javascript-c9710bbb2d41

    let voices = [];
    voices = speechSynthesis.getVoices();

    // default settings, currently user has no way of modifying these
    const defaultVoice = this.getDefaultVoice(
      voices,
      this.isApple,
      this.isEdgeAndroid,
    );
    if (defaultVoice) {
      this.speech.voice = defaultVoice;
    }
    this.speech.lang = "en";
    this.speech.rate = 1;
    this.speech.pitch = 1;
    this.speech.volume = 1;

    // Voices doesn't get immediately returned sometimes
    // https://www.bennadel.com/blog/3955-having-fun-with-the-speechsynthesis-api-in-angular-11-0-5.htm
    if (!voices.length) {
      speechSynthesis.addEventListener("voiceschanged", () => {
        voices = speechSynthesis.getVoices();
        const newVoice = this.getDefaultVoice(
          voices,
          this.isApple,
          this.isEdgeAndroid,
        );
        if (newVoice) {
          this.speech.voice = newVoice;
        }
      });
    }

    // find the element that the user tapped/clicked on
    this.globalListenFunction = this.renderer.listen(
      "document",
      "click",
      (e) => {
        this.readText(e.x, e.y);
      },
    );
    this.globalListenFunction = this.renderer.listen(
      "document",
      "touchstart",
      (e) => {
        var touch = e.touches[0] || e.changedTouches[0];
        this.readText(touch.pageX, touch.pageY);
      },
    );
  }

  ngOnDestroy() {
    // remove listener
    this.globalListenFunction();
  }

  document = inject(DOCUMENT);
  currentState = 0;
  
  // Make these reactive to language changes
  get base() {
    return this.i18n.getTranslation('screen-reader');
  }
  
  get unavailableMessage() {
    return this.i18n.getTranslation('screen-reader-unavailable');
  }
  
  get states() {
    return [
      this.base, 
      this.i18n.getTranslation('read-normal'), 
      this.i18n.getTranslation('read-fast'), 
      this.i18n.getTranslation('read-slow')
    ];
  }

  _style: HTMLStyleElement;

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;

    this._runStateLogic();
  }
  private _runStateLogic() {
    this._style?.remove?.();
    this._style = this.document.createElement("style");

    if (this.currentState === 1) {
      this.speech.rate = 0.8;
    }

    if (this.currentState === 2) {
      this.speech.rate = this.isApple ? 1.3 : 1.7;
    }

    if (this.currentState === 3) {
      this.speech.rate = 0.4;
    }

    if (this.currentState === 0) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    }
    this.document.body.appendChild(this._style);
  }

  reset() {
    this.currentState = 0;
    speechSynthesis.cancel();
  }

  readText(x: number, y: number) {
    let element = document.elementFromPoint(x, y);
    if (element) {
      if (this.currentState !== 0) {
        if ((element as HTMLElement).ariaLabel) {
          this.speech.text = (element as HTMLElement).ariaLabel ?? '';
        } else {
          this.speech.text = (element as HTMLElement).textContent || "";
        }
        speechSynthesis.cancel();
        speechSynthesis.speak(this.speech);
      }
    }
  }

  getDefaultVoice(
    voices: Array<SpeechSynthesisVoice>,
    isApple = false,
    isEdgeAndroid = false,
  ): SpeechSynthesisVoice | undefined {
    const defaultVoice = "Daniel";
    if (voices.length > 0 || isEdgeAndroid) {
      this.synthesisAvailable = true;
    } else {
      this.synthesisAvailable = false;
      return undefined;
    }
    const voiceIdx = voices.findIndex((v) => {
      return v.name.toUpperCase().includes(defaultVoice.toUpperCase());
    });
    if (voiceIdx !== -1) {
      this.synthesisAvailable = true;
      return voices[voiceIdx];
    }
    let i = 0;
    voices = voices.filter((voice) => /en-US/i.test(voice.lang));
    while (
      !voices[i]?.default &&
      i < voices.length &&
      !voices[i]?.voiceURI?.toUpperCase().includes("FLO")
    ) {
      i++;
    }
    if (i < voices.length) {
      return voices[i];
    } else {
      return voices[0];
    }
  }

  get isActive(): boolean {
    return this.currentState !== 0;
  }

  /**
   * Programmatically activate/deactivate from profile selection
   */
  toggleFromProfile(desiredState: boolean) {
    if (desiredState && this.currentState === 0) {
      this.currentState = 1;
      this._runStateLogic();
    } else if (!desiredState && this.currentState !== 0) {
      this.currentState = 0;
      this._runStateLogic();
    }
  }
}
