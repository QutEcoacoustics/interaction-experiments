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
            externalHtmlPreamble: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: "External HTML Preamble",
                default: null,
                description: "URI address of an external HTML file."
            },
            max_width: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: "Image Width",
                default: null,
                description:
                    "Maximum width of the audio element. Image element will be 239px smaller than the audio element."
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

    plugin.trial = function(display_element, trial) {
        var player = null;
        var data = {
            actions: [],
            mediaEvents: []
        };

        /**
         * Resets the innerHTML and finishes the trial
         */
        var end_trial = function() {
            display_element.innerHTML = "";
            jsPsych.finishTrial(data);
        };

        //Returns the audio file type
        /**
         * Returns the audio file extension (eg 'wav')
         * @returns {string} Audio file extension
         */
        function getFileExtension() {
            let splits = trial.audio.split(".");
            return splits[splits.length - 1];
        }

        /**
         * Pushes the relevant data from an event into the data variable.
         * @param {string} event Name of action/event
         * @param {object} annotation Annotation object returned by event
         * @returns {void}
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
                mediaPosition: null
            });
        };

        /**
         * Create the audio player
         */
        function makePlayer() {
            var checkAudio = setInterval(function() {
                let audio = `<audio id="player" preload="none" style="width: 100%; height: 100%;"
    controls width="100%" height="100%" controls ${trial.loop ? "loop" : ""} ${
        trial.autoplay ? "autoplay" : ""
    }><source src="${trial.audio}" type="audio/${getFileExtension(trial.audio)}"/></audio>`;

                //Create audio element with the following additional options: loop, autoplay
                let container = document.getElementById("player-container");

                if (!container) {
                    // dom is not ready, skip, wait try again later
                    return;
                }

                container.innerHTML = audio;

                player = new MediaElementPlayer("player", {
                    success: function() {}
                });

                setAudioVolume();

                clearInterval(checkAudio);
            }, 50); //Wait 50ms for image to load
        }

        /**
         * Enable image annotations
         */
        function makeAnnotatable() {
            var checkImage = setInterval(function() {
                //Image has loaded, make it annotatable
                let image = display_element.querySelector("#jspsych-audio-image");
                if (image && image.width > 0) {
                    clearInterval(checkImage);

                    // hardcoding width and height because annotorious can't deal
                    // with size changes - this canvas does not seem to stretch
                    var column = document.querySelector("#columnContainer");
                    column.style.width = (image.naturalWidth + 92 + 59).toString() + "px";


                    // if annotorious has been used before on same dom element
                    // it seems it breaks. Adding in a reset to counter.
                    anno.reset();

                    anno.makeAnnotatable(image);

                    // event bindings were moved to global because there is no
                    // way to reset the bindings globally and it was causing
                    // repeated firing of events.

                    addAxes();
                }
            }, 50); //Wait 50ms for image to load
        }

        function addAxes() {
            if (trial.axes) {
                // add our axes overlay
                let container = display_element.querySelector(".annotorious-annotationlayer");
                let dimensions = container.getBoundingClientRect();

                var axes = d3.select(container)
                    .append("svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("preserveAspectRatio", "none")

                    .attr("class", "axes-container")
                    .attr("viewBox", "0 0 1440 256");

                let x = trial.axes.x;
                if (x) {
                    let xScale = d3.scaleUtc().domain([new Date(x.min), new Date(x.max)]).range([0, 1440]);
                    let xAxis = d3.axisBottom(xScale).ticks(d3.timeHour);
                    axes.append("g")
                        .attr("transform", "translate(0, 256)")
                        .call(xAxis);
                }
                let y = trial.axes.y;
                if (y) {
                    let yScale = d3.scaleLinear().domain([y.min, y.max]).range([256, 0]);
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
            let image_container = `<div style="display: flex; flex-direction: row">
          <div style="width: 92px; flex-shrink: 0;"></div>
          <img
            src="${trial.image}"
            id="jspsych-audio-image"
            class="annotatable"
            style="flex: 1;"
          />
          <div style="width: 59px; flex-shrink: 0;"></div>
        </div>`;

            let audio = "<div id='player-container' class='media-wrapper' style='flex: 1; flex-shrink: 0; z-index: 100'></div>";

            let container = `<div id='columnContainer' style="display: flex; flex-direction: column; margin-bottom: 1ex; margin-top: 1ex;">${image_container}${audio}</div>`;

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
            .annotorious-annotationlayer {
                margin-bottom: 32px
            }
            .axes-container {
                background-color: transparent;
                height: 100%;
                pointer-events: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                overflow: visible;
            }
            <style>`;

            //Create submit button
            let button = document.createElement("button");
            button.innerHTML = trial.continue_label;
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
