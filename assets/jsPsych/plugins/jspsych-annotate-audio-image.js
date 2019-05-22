/**
 * @description Image viewer with annotation abilities that displays an audio player underneath.
 * The width of the audio player timeline matches the size of the image so that users can easily
 * view where in the image the audio relates to.
 * @requires Required external libraries include: annotorious, and mediaelement. They must be loaded and available in the global scope.
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
                description: "Plays the audio recording immediatly"
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

    plugin.trial = function(display_element, trial) {
        var data = {
            actions: []
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
        function pushAction(event, annotation) {
            data.actions.push({
                event: event,
                text: annotation.text,
                height: annotation.shapes[0].geometry.height,
                width: annotation.shapes[0].geometry.width,
                x: annotation.shapes[0].geometry.x,
                y: annotation.shapes[0].geometry.y
            });
        }

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
                document.getElementById("player-container").innerHTML = audio;

                var player = new MediaElementPlayer("player", {
                    success: function() {}
                });

                clearInterval(checkAudio);
            }, 50); //Wait 50ms for image to load
        }

        /**
         * Enable image annotations
         */
        function makeAnnotatable() {
            var checkImage = setInterval(function() {
                //Image has loaded, make it annotatable
                if (display_element.querySelector("#jspsych-audio-image")) {
                    anno.makeAnnotatable(document.getElementById("jspsych-audio-image"));
                    anno.addHandler("onAnnotationCreated", function(annotation) {
                        pushAction("AnnotationCreated", annotation);
                    });
                    anno.addHandler("onAnnotationUpdated", function(annotation) {
                        pushAction("AnnotationUpdated", annotation);
                    });
                    anno.addHandler("onAnnotationRemoved", function(annotation) {
                        pushAction("AnnotationRemoved", annotation);
                    });
                    clearInterval(checkImage);
                }
            }, 50); //Wait 50ms for image to load
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

            let audio = "<div id='player-container' class='media-wrapper' style='flex: 1; flex-shrink: 0;'></div>";

            let container = `<div style="display: flex; flex-direction: column;${
                trial.max_width ? `max-width: ${trial.max_width};` : ""
            }">${image_container}${audio}</div>`;

            let stylesToDisable = [
                "mejs__volume-button",
                "mejs__mute",
                "mejs__horizontal-volume-current",
                "mejs__controls a"
            ];

            let style = `<style>${stylesToDisable.map(
                classItem => `.${classItem}`
            )}, .annotorious-hint { display: none }<style>`;
            console.log(style);

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
            setAudioVolume();
            makeAnnotatable();
        }

        if (trial.externalHtmlPreamble) {
            var xmlhttp;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    generatePage(xmlhttp.responseText);
                }
            };
            xmlhttp.open("GET", trial.externalHtmlPreamble, true);
            xmlhttp.send();
        } else {
            generatePage();
        }
    };

    return plugin;
})();
