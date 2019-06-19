/*globals anno*/
/*globals MediaElementPlayer*/
/*globals d3*/
/**
 * @description Image viewer with annotation abilities that displays an audio player underneath.
 * The width of the audio player timeline matches the size of the image so that users can easily
 * view where in the image the audio relates to.
 * @requires Required external libraries include: annotorious, mediaelement, and optionally D3. They must be loaded and available in the global scope.
 * @returns List of annotation events (creation, updates, removals)
 * @author Charles Alleman
 */
jsPsych.plugins["annotate-audio-image"] = (function() {
    var plugin = {};

    plugin.info = {
        name: "annotate-audio-image",
        parameters: {
            image: {
                type: jsPsych.plugins.parameterType.IMAGE,
                pretty_name: "Image",
                default: undefined,
                description: "Image element to display"
            },
            axes: {
                type: jsPsych.plugins.parameterType.OBJECT,
                pretty_name: "Axes",
                default: null,
                description: "Whether or not to show axes. If defined, should take the form of: {x: {min: 0, step: 1; max: 100}, y: {min: 0, step: 1; max: 100}}"
            },
            audio: {
                type: jsPsych.plugins.parameterType.AUDIO,
                pretty_name: "Audio",
                default: undefined,
                description: "Audio element to display control panel for and play"
            },
            codecs: {
                type: jsPsych.plugins.parameterType.COMPLEX,
                array: true,
                default: [[".weba", "audio/webm"], [".mp3", "audio/mpeg"], [".oga", "audio/ogg"], [".ogg", "audio/ogg"]],
                pretty_name: "Alternative codecs",
                description: "Allow the browser to choose it's preferred audio format"
            },
            externalHtmlPreamble: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: "External HTML Preamble",
                default: null,
                description: "URI address of an external HTML file."
            },
            autoplay: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: "Autoplay",
                default: null,
                description: "Plays the audio recording immediately"
            },
            loop: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: "Loop",
                default: null,
                description: "Loops the audio recording"
            },
            continue_label: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: "Continue label",
                default: "Continue",
                description: "The label to use for the continue button"
            }
        }
    };

    // event bindings for annotorious. they have to only bound once!
    var annotationAction = null;

    anno.addHandler("onAnnotationCreated", function(annotation) {
        annotationAction("AnnotationCreated", annotation);
    });
    anno.addHandler("onAnnotationUpdated", function(annotation) {
        annotationAction("AnnotationUpdated", annotation);
    });
    anno.addHandler("onAnnotationRemoved", function(annotation) {
        annotationAction("AnnotationRemoved", annotation);
    });

    const dimensions = {
        left: 110,
        right: 20,
        imageWidth: 1440,
        imageHeight: 256,
    };

    plugin.trial = function(display_element, trial) {
        // interval handles that needs to be cleared on trial finish
        var checkImageIntervalHandle, checkAudioIntervalHandle = null;
        var player = null;
        var data = {
            actions: [],
            mediaEvents: [],
            totalTimePlaying: 0,
            bufferedTimeRanges: null
        };
        let cursor = null;
        let cursorBar = null;

        /**
         * Resets the innerHTML and finishes the trial
         */
        var end_trial = function() {
            clearInterval(checkImageIntervalHandle);
            clearInterval(checkAudioIntervalHandle);
            clearInterval(cursor);

            player.pause();
            data.bufferedTimeRanges = Array
                .from(player.buffered)
                .map((x,i) => ({start: player.buffered.start(i), end: player.buffered.end(i)}));

            var src = player.currentSrc;
            data.audioFileUsed = src && src.slice(src.lastIndexOf(".")) || src;

            var playState =  data.mediaEvents.reduce((state, event) => {
                switch (event.event) {
                case "playing":
                    state.on = event.mediaPosition;
                    break;
                case "seeking" :
                case "seeked":
                    // do nothing
                    break;
                case "pause":
                case "end":
                case "stalled":
                case "suspend":
                    state.total += event.mediaPosition - state.on;
                    state.on = null;
                }
                return state;
            },
            {on: false, total: 0});

            // in this case user did not stop playing before going to next screen
            if (playState.on) {
                playState.total += player.currentTime - playState.on;
            }

            data.totalTimePlaying = playState.total;

            while (display_element.firstChild) {
                display_element.removeChild(display_element.firstChild);
            }

            jsPsych.finishTrial(data);
        };

        /**
         * Create cursor on image to display the position of the audio
         */
        function createCursor() {
            cursorBar = document.createElement("div");
            cursorBar.classList = ["cursor-bar"];

            let image, audio;
            let interval = setInterval(function() {
                image = display_element.querySelector("#jspsych-audio-image");
                audio = display_element.querySelector("#player");

                if (audio && image && image.naturalWidth > 0) {
                    clearInterval(interval);

                    //Create cursor
                    display_element.querySelector(".annotorious-annotationlayer").appendChild(cursorBar);
                    updateCursor();

                    //Refresh cursor
                    cursor = setInterval(function() {
                        updateCursor();
                    }, 1000); //Update every second`;
                }
            }, 50);
        }

        /**
         * Updates the cursor on the annotatable image
         */
        function updateCursor() {
            let image, audio;

            let interval = setInterval(function() {
                image = display_element.querySelector("#jspsych-audio-image");
                audio = display_element.querySelector("#player");

                if (audio && image && image.naturalWidth > 0) {
                    clearInterval(interval);
                    cursorBar.style.width = `${image.width * (audio.currentTime / audio.duration)}px`;
                }
            }, 50);
        }

        /**
         * Pushes the relevant data from an event into the data variable.
         * @param {string} event Name of action/event
         * @param {object} annotation Annotation object returned by event
         */
        annotationAction = function pushAction(event, annotation) {
            data.actions.push({
                time_elapsed: jsPsych.totalTime(),
                event: event,
                text: annotation.text,
                height: annotation.shapes[0].geometry.height,
                width: annotation.shapes[0].geometry.width,
                x: annotation.shapes[0].geometry.x,
                y: annotation.shapes[0].geometry.y,
                mediaPosition: player && player.getCurrentTime() || null,
                paused: player ? player.paused : null

            });
        };

        /**
         * Create the audio player
         */
        function makePlayer() {
            checkAudioIntervalHandle = setInterval(function() {
                var audioWithoutExtension = trial.audio.slice(0, trial.audio.lastIndexOf("."));
                var sources = trial.codecs
                    .map(([extension, mime]) => `<source src="${audioWithoutExtension}${extension}" type="${mime}"/>`)
                    .join("\n");
                let audio = `
                <audio id="player" preload="none" style="width: 100%; height: 100%;"
                controls width="100%" height="100%" controls ${trial.loop ? "loop" : ""} ${trial.autoplay ? "autoplay" : ""}>
                    ${sources}
                </audio>`;

                // Create audio element with the following additional options: loop, autoplay
                let container = document.getElementById("player-container");

                if (!container) {
                    // dom is not ready, skip, wait try again later
                    return;
                }

                container.innerHTML = audio;

                new MediaElementPlayer("player", {
                    success: function(media) {
                        player = media;
                        setAudioVolume();

                        ["seeking", "seeked", "playing", "pause", "end", "stalled", "suspend", "abort"].forEach(function(eventName) {
                            media.addEventListener(
                                eventName,
                                () => {
                                    data.mediaEvents.push({
                                        time_elapsed: jsPsych.totalTime(),
                                        event: eventName,
                                        mediaPosition: media.currentTime
                                    });

                                    updateCursor();
                                });
                        });
                    },
                    alwaysShowHours: true,
                    features: [ "playpause", "current", "progress"]
                });

                clearInterval(checkAudioIntervalHandle);
            }, 50); // Wait 50ms for image to load
        }

        /**
         * Enable image annotations
         */
        function makeAnnotatable() {
            checkImageIntervalHandle = setInterval(function() {
                //Image has loaded, make it annotatable
                let image = display_element.querySelector("#jspsych-audio-image");
                if (image && image.naturalWidth > 0) {
                    clearInterval(checkImageIntervalHandle);

                    image.height = dimensions.imageHeight;
                    image.width = dimensions.imageWidth;

                    // hardcoding width and height because annotorious can't deal
                    // with size changes - this canvas does not seem to stretch
                    var column = document.querySelector("#columnContainer");
                    var imageContainer = column.querySelector(".image-container");

                    // if annotorious has been used before on same dom element
                    // it seems it breaks. Adding in a reset to counter.
                    anno.reset();

                    anno.makeAnnotatable(image);
                    var annoContainer = column.querySelector(".annotorious-annotationlayer");

                    // annotorious event bindings were moved to global because there is no
                    // way to reset the bindings globally and it was causing
                    // repeated firing of events.

                    addAxes();

                    var setScale = function() {
                        var rect = column.getBoundingClientRect();
                        var scale =  (rect.width - (dimensions.left + dimensions.right)) / dimensions.imageWidth;
                        annoContainer.style.transform = `scale(${scale})`;
                        // Array.from(annoContainer.children).forEach(
                        //     child => child.style.transform = `scale(${scale})`
                        // );
                        imageContainer.style.height = (dimensions.imageHeight * scale) + "px";
                        //annoContainer.style.width =
                    };
                    setScale();
                    window.addEventListener("resize", setScale);
                }
            }, 50); //Wait 50ms for image to load
        }

        /**
         * Add horizontal and vertical axes to the image
         */
        function addAxes() {
            if (trial.axes) {
                // add our axes overlay
                let container = display_element.querySelector(".annotorious-annotationlayer");
                //let dimensions = container.getBoundingClientRect();

                var axes = d3.select(container)
                    .append("svg")
                    .attr("width", dimensions.imageWidth)
                    .attr("height", dimensions.imageHeight)
                    .attr("preserveAspectRatio", "none")

                    .attr("class", "axes-container")
                    .attr("viewBox", `0 0 ${dimensions.imageWidth} ${dimensions.imageHeight}`);

                let x = trial.axes.x;
                if (x) {
                    let xScale = d3.scaleUtc()
                        .domain([new Date(x.min), new Date(x.max)])
                        .range([0, dimensions.imageWidth]);
                    let xAxis = d3.axisBottom(xScale).ticks(d3.timeHour);
                    axes.append("g")
                        .attr("transform", `translate(0, ${dimensions.imageHeight})`)
                        .call(xAxis);
                }
                let y = trial.axes.y;
                if (y) {
                    let yScale = d3.scaleLinear().domain([y.min, y.max]).range([dimensions.imageHeight, 0]);
                    //let ticks = d3.range(y.min, y.max, y.step || 1000);
                    let yAxis = d3.axisLeft(yScale);
                    axes.append("g")
                        .attr("transform", "translate(0, 0)")
                        .call(yAxis);
                }
            }
        }

        /**
         * Sets the audio level for the player to max
         */
        function setAudioVolume() {
            document.getElementById("player_html5").volume = 1.0;
        }

        /**
         * Generates the plugins HTML
         * @param {string} preamble HTML text to insert into document
         */
        function generatePage(preamble) {
            let image_container = `<div style="display: inline-flex; flex-direction: row; width: 100%">
          <div style="width: ${dimensions.left}px; flex-shrink: 0;"></div>
          <div class="image-container">
            <img
                src="${trial.image}"
                id="jspsych-audio-image"
                class="annotatable"
            />
          </div>
          <div style="width: ${dimensions.right}px; flex-shrink: 0;"></div>
        </div>`;

            let audio = "<div id='player-container' class='media-wrapper' style='flex: 1; flex-shrink: 0; z-index: 100'></div>";

            let container = `<div id='columnContainer' style="margin-bottom: 1ex; margin-top: 1ex;">${image_container}${audio}</div>`;

            let stylesToDisable = [
                "mejs__volume-button",
                "mejs__mute",
                "mejs__horizontal-volume-current",
                "mejs__controls a"
            ];

            let style = `<style>${stylesToDisable.map(
                classItem => `.${classItem}`
            )}, .annotorious-hint { display: none }

            .mejs__container { width: 100% !important; }

            .annotorious-editor, .annotorious-popup {
                /* z-index of editor panel (value is too low) */
                z-index: 200 !important;
            }
            .jspsych-display-element {
                overflow: unset !important;
            }
            .image-container {
                margin-bottom: 1%;
                flex-grow: 1;
                /* jspsych styles interfering */
                text-align: left;
                transform-origin: 0 0;
            }
            .annotorious-annotationlayer {
                z-index: 150;
                transform-origin: 0 0;
            }
            .image-container::after {
                content: ".";
                display: block;
                clear: both;
                visibility: hidden;
                line-height: 0;
                height: 0;
            }
            .axes-container {
                background-color: transparent;
                height: ${dimensions.imageHeight}px;
                pointer-events: none;
                position: absolute;
                top: 0;
                left: 0;
                width: ${dimensions.imageWidth}px;
                overflow: visible;
            }
            .cursor-bar {
                border-color: red;
                border-style: solid;
                border-width: 0px 2px 0px 0px;
                height: 100%;
                left: 0px;
                pointer-events: none;
                position: absolute;
                top: 0px;
                z-index: 175; //Greater than canvas(150) but less than popup(200)
            }
            <style>`;

            //Create submit button
            let button = document.createElement("button");
            button.innerHTML = trial.continue_label;
            button.id = "continue";
            button.classList.add("jspsych-btn", "mx-auto");
            button.onclick = end_trial;

            let button_div = document.createElement("div");
            button_div.classList.add("container");
            let inner_div = document.createElement("div");
            inner_div.classList.add("row");
            inner_div.appendChild(button);
            button_div.appendChild(inner_div);

            //Add elements to document
            display_element.innerHTML = container;
            display_element.innerHTML += style;
            display_element.appendChild(button_div);

            // process preamble so we can execute scripts
            if (preamble) {
                // the range API let's us safely create document fragments that can execute scripts
                var range = document.createRange();

                // Make the parent of the first div in the document becomes the context node
                range.selectNode(document.getElementsByTagName("div").item(0));
                var document_fragment = range.createContextualFragment(preamble);
                display_element.insertBefore(document_fragment, display_element.firstChild);
            }

            makePlayer();
            makeAnnotatable();
            createCursor();
        }

        if (trial.externalHtmlPreamble) {
            window.fetch(trial.externalHtmlPreamble)
                .then(response => response.text())
                .then(text => generatePage(text))
                .catch(error => console.log(error));
        } else {
            generatePage();
        }
    };

    return plugin;
})();
