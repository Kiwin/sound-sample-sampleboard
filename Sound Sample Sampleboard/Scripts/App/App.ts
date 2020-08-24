abstract class UtilityFunctions {
    /**
     * MethFod for constraining a value to a range.
     * @param value The value to constrain.
     * @param a The first boundary of the range.
     * @param b The second boundary of the range.
     * Returns the value if it is within the range constrains,
     * Else return the nearest constrain.
     */
    static constrain(value: number, a: number, b: number): number {

        //Determine the upper and lower bound of the range.
        let min, max;
        if (a > b) {
            min = b;
            max = a;
        } else {
            min = a;
            max = b;
        }

        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
}

abstract class HtmlGenerator {
    static generateElementFromHtml(html: string): HTMLElement {
        const template = document.createElement("div");
        const trimmedHtml = html.trim();
        template.innerHTML = trimmedHtml;
        const element = template.firstChild as HTMLElement;

        //Error check after generation.
        if (!element) throw "Failed to convert html to element";
        return element;
    }
}

function configureBpmButton(bpmInput: HTMLInputElement, bpmDiv: HTMLDivElement) {
    const DEFAULT_BPM = 83;

    //QOL: Focus bmpInput when the surrounding div is clicked.
    bpmDiv.addEventListener("click", () => bpmInput.focus());

    //Limit the bmpInput to it's specified range.
    addEventListener("input", () => {
        const buttonValue = parseInt(bpmInput.value);

        //If set value is NaN then set value to default.
        if (isNaN(buttonValue)) {
            bpmInput.setAttribute("value", DEFAULT_BPM.toString());
            return;
        }

        const min = parseInt(bpmInput.getAttribute("min") as string);
        const max = parseInt(bpmInput.getAttribute("max") as string);
        const constrainedValue = UtilityFunctions.constrain(buttonValue, min, max);
        bpmInput.value = constrainedValue.toString();
    });
}

function soundTrackCellOnDragOver(event: DragEvent): void {
    event.preventDefault();
}

function soundTrackCellOnDrop(event: DragEvent): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData("text");
    if (!data) return;
    const cell = event.target as HTMLElement;
    const fileNamePattern = /([\w\-\_]+\.ogg)/
    const fileName = (data.match(fileNamePattern) as string[])[1] || "?";

    cell.setAttribute("data-audio-src", data);
    cell.innerHTML = fileName;
}

function soundSampleOnDragStart(event: DragEvent): void {
    const sample = event.target as HTMLElement
    const audioSource = sample.getAttribute("data-audio-src");
    if (!audioSource) return;
    event.dataTransfer?.setData("text", audioSource);
}

function configureSoundTrackCell(cell: HTMLElement): void {
    //Allow Drop
    cell.addEventListener("dragover", soundTrackCellOnDragOver);

    cell.addEventListener("drop", soundTrackCellOnDrop);

}

function populateSoundTrackContainer(soundTrackContainer: HTMLDivElement, soundTrackCount = 3, soundTrackCellCount = 8): void {
    for (let i = 0; i < soundTrackCount; i++) {
        const SoundTrack = OldFactory.createSoundTrackElement();

        for (let j = 0; j < soundTrackCellCount; j++) {
            const soundTrackCell = OldFactory.createSoundTrackCellElement();
            configureSoundTrackCell(soundTrackCell);
            SoundTrack.appendChild(soundTrackCell);
        }
        soundTrackContainer.appendChild(SoundTrack);
    }
}

async function populateSoundSampleGallery(audioSampleGallery: HTMLDivElement) {
    const response = await fetch("./SoundSample/AvailableSounds");
    const audioFilePaths = await response.json() as string[];

    //Create and configure audio sample for each file path.
    audioFilePaths.forEach(filePath => {

        //Find the name of the file.
        const fileNamePattern = /([\w\-\_]+\.ogg)/
        const fileName = (filePath.match(fileNamePattern) as string[])[1] || "Sound Title";

        //Create sound sample from file path.
        const audioSampleElement = OldFactory.createSoundSampleElement(fileName);

        //Set the sound sample to play sound on right click.
        const audioPlayer = new Audio(filePath)
        audioSampleElement.addEventListener("contextmenu", event => {
            event.preventDefault();
            //Reset the sound player.
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        });

        //Configure drag and drop functionality.
        audioSampleElement.setAttribute("data-audio-src", filePath);
        audioSampleElement.addEventListener("dragstart", soundSampleOnDragStart);

        //Add sound sample to the gallery.
        audioSampleGallery.appendChild(audioSampleElement);
    })
}

abstract class OldFactory {
    static createSoundSampleElement(title: string): HTMLElement {
        const html = `<div class="gallery-item sample draggable" draggable="true">
                      <p>${title}</p>
                      <svg viewBox="0 0 16 16" class="bi bi-music-note-beamed" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z" />
                          <path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z" />
                          <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
                      </svg>
                  </div>`;
        return HtmlGenerator.generateElementFromHtml(html);
    }

    static createSoundTrackElement(): HTMLElement {
        const element = document.createElement("div");
        element.className += "track";
        return element;
    }

    static createSoundTrackCellElement(): HTMLElement {
        const element = document.createElement("div");
        element.className += "cell";
        return element;
    }
}

class SampleTrackCell {

}

class SampleTrack extends HTMLElement {

    constructor(cellCount: number) {
        super();
        for (var i = 0; i < cellCount; i++) {

        }
    }
}

interface ISampleTrackFactory {
    createSampleTrack(): SampleTrack
}

interface S3bFactory extends ISampleTrackFactory {
    createTrackContainer(): TrackContainer;
    createControlPanel(): ControlPanel;
    createSampleGallery(): SampleGallery;
}

abstract class Factory implements S3bFactory {
    create(): TrackContainer {
        throw new Error("Method not implemented.");
    }
    public createTrackContainer(): TrackContainer {
        return new TrackContainer();
    }
    public createControlPanel(): ControlPanel {
        return new ControlPanel();
    }
    public createSampleGallery(): SampleGallery {

        throw new Error("Method not implemented.");
        /*
        const response = await fetch("./SoundSample/AvailableSounds");
        const audioFilePaths = await response.json() as string[];
        return new SampleGallery(new FromPathAudioSampleGenerator(audioFilePaths));
        */
    } createSampleTrack(): SampleTrack {
        return new SampleTrack();
    }
}


class TrackContainer extends HTMLElement {

    tracks: SampleTrack[]

    constructor(trackCount: number, sampleTrackFactory: ISampleTrackFactory) {
        super();
        this.tracks = [];
        for (let i = 0; i < trackCount; i++) {
            const sampleTrack = sampleTrackFactory.createSampleTrack();
            this.tracks.push(sampleTrack);
        }
    }
}

class ControlPanel extends HTMLElement {
    constructor() {
        super();

    }

}

class AudioSample extends HTMLElement {

    constructor() {
        super();
    }
}

interface AudioSampleGenerator {
    generateAudioSamples();
}

class FromPathAudioSampleGenerator implements AudioSampleGenerator {

    private audioFilePaths: string[];

    constructor(audioFilePaths: string[]) {
        this.audioFilePaths = audioFilePaths;
    }

    public generateAudioSamples() {
        throw new Error("Method not implemented.");
    }
}

class SampleGallery extends HTMLElement {

    private audioSamples: AudioSample[];

    constructor(audioSampleGenerator: AudioSampleGenerator) {
        super();
        this.audioSamples = audioSampleGenerator.generateAudioSamples();
    }
}

class App extends HTMLElement {

    //private sampleGallery: SampleGallery;
    private sampleBoard: TrackContainer;
    private controlPanel: ControlPanel;
    private sampleGallery: SampleGallery;

    constructor(factory: S3bFactory) {
        super();

        //this.sampleGallery = this.createSampleGallery();
        //this.appendChild(this.sampleGallery);

        this.sampleBoard = factory.createTrackContainer();
        this.appendChild(this.sampleBoard);

        this.controlPanel = factory.createControlPanel();
        this.appendChild(this.controlPanel);

        this.sampleGallery = factory.createSampleGallery();
        this.appendChild(this.controlPanel);

    }
}

customElements.define("s3b-app", App);

async function initializeApp() {
    //Setup Sound Sample Gallery.
    const SoundSampleGallery = document.getElementById("gallery") as HTMLDivElement;
    populateSoundSampleGallery(SoundSampleGallery);

    const trackContainer = document.getElementById("track-container") as HTMLDivElement;
    populateSoundTrackContainer(trackContainer);

    //Setup Beats per minute controls.
    const bpmDiv = document.getElementById("bpm-div") as HTMLDivElement;
    const bpmInput = document.getElementById("bpm") as HTMLInputElement;
    configureBpmButton(bpmInput, bpmDiv);

    //const playPauseButton = document.getElementById("play-pause-button") as HTMLButtonElement;
    //const resetButton = document.getElementById("reset-button") as HTMLButtonElement;

}

//Main program
initializeApp();