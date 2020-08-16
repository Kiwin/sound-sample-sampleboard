"use strict";
class UtilityFunctions {
    /**
     * MethFod for constraining a value to a range.
     * @param value The value to constrain.
     * @param a The first boundary of the range.
     * @param b The second boundary of the range.
     * Returns the value if it is within the range constrains,
     * Else return the nearest constrain.
     */
    static constrain(value, a, b) {
        //Determine the upper and lower bound of the range.
        let min, max;
        if (a > b) {
            min = b;
            max = a;
        }
        else {
            min = a;
            max = b;
        }
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    }
}
class HtmlGenerator {
    static generateElementFromHtml(html) {
        const template = document.createElement("div");
        const trimmedHtml = html.trim();
        template.innerHTML = trimmedHtml;
        const element = template.firstChild;
        //Error check after generation.
        if (!element)
            throw "Failed to convert html to element";
        return element;
    }
}
class Factory {
    static createSoundSampleElement(title) {
        const html = `<div class="gallery-item sample draggable" draggable="true" data-audio-src="./sounds/clap.ogg">
                      <p>${title}</p>
                      <svg viewBox="0 0 16 16" class="bi bi-music-note-beamed" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z" />
                          <path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z" />
                          <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
                      </svg>
                  </div>`;
        return HtmlGenerator.generateElementFromHtml(html);
    }
    static createSoundTrackElement() {
        const element = document.createElement("div");
        element.className += "track";
        return element;
    }
    static createSoundTrackCellElement() {
        const element = document.createElement("div");
        element.className += "cell";
        return element;
    }
}
function configureSampleTrackCells() {
    const trackCells = document.querySelectorAll(".cell");
    function onCellDragOver(event) {
        event.preventDefault();
    }
    trackCells.forEach(cell => {
        cell.addEventListener("ondragover", onCellDragOver);
    });
}
function configureBpmButton(bpmInput, bpmDiv) {
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
        const min = parseInt(bpmInput.getAttribute("min"));
        const max = parseInt(bpmInput.getAttribute("max"));
        const constrainedValue = UtilityFunctions.constrain(buttonValue, min, max);
        bpmInput.value = constrainedValue.toString();
    });
}
function populateSoundTrackContainer(soundTrackContainer, soundTrackCount = 3, soundTrackCellCount = 8) {
    for (let i = 0; i < soundTrackCount; i++) {
        const SoundTrack = Factory.createSoundTrackElement();
        for (let j = 0; j < soundTrackCellCount; j++) {
            const soundTrackCell = Factory.createSoundTrackCellElement();
            SoundTrack.appendChild(soundTrackCell);
        }
        soundTrackContainer.appendChild(SoundTrack);
    }
}
async function populateSoundSampleGallery(audioSampleGallery) {
    const response = await fetch("./SoundSample/AvailableSounds");
    const audioFilePaths = await response.json();
    audioFilePaths.forEach(filePath => {
        const fileNamePattern = /([\w\-\_]+\.ogg)/;
        const fileName = filePath.match(fileNamePattern)[1] || "Sound Title";
        //Create sound sample from file path.
        const audioSampleElement = Factory.createSoundSampleElement(fileName);
        //Set to play sound on right click.
        const audioPlayer = new Audio(filePath);
        audioSampleElement.addEventListener("contextmenu", event => {
            event.preventDefault();
            //Reset the sound player.
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        });
        //Add sound sample to the gallery.
        audioSampleGallery.appendChild(audioSampleElement);
    });
}
function initializeApp() {
    //Setup Sound Sample Gallery.
    const SoundSampleGallery = document.getElementById("gallery");
    populateSoundSampleGallery(SoundSampleGallery);
    const trackContainer = document.getElementById("track-container");
    populateSoundTrackContainer(trackContainer);
    //Setup Beats per minute controls.
    const bpmDiv = document.getElementById("bpm-div");
    const bpmInput = document.getElementById("bpm");
    configureBpmButton(bpmInput, bpmDiv);
    configureSampleTrackCells();
    //const playPauseButton = document.getElementById("play-pause-button") as HTMLButtonElement;
    //const resetButton = document.getElementById("reset-button") as HTMLButtonElement;
}
//Main program
initializeApp();
//# sourceMappingURL=Index.js.map