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
    let makePlayer = () => {
      console.log("makePlayer");
      var checkAudio = setInterval(function() {
        console.log("Building Audio");

        const END_OFFSET = 239;

        let image_width = document.getElementById("jspsych-audio-image")
          .offsetWidth;
        width = parseInt(image_width + END_OFFSET) + "px";

        let audio = `<audio id="player" preload="none" controls width='${width}' ${
          trial.loop ? "loop" : ""
        } ${trial.autoplay ? "autoplay" : ""}><source src="${
          trial.audio
        }" type="audio/${getFileExtension(trial.audio)}"/></audio>`;

        //Create audio element with the following additional options: loop, autoplay
        document.getElementById("player-container").innerHTML = audio;

        var player = new MediaElementPlayer("player", {
          success: function(mediaElement, originalNode, instance) {}
        });

        clearInterval(checkAudio);
      }, 50); //Wait 50ms for image to load
    };

    /**
     * Enable image annotations
     */
    let makeAnnotatable = () => {
      console.log("makeAnnotatable")
      var checkImage = setInterval(function() {
        console.log("Annotating Image")

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
    };

    let image_container = `<div style="display: flex; flex-direction: row">
        <div style="width: 92px; flex-shrink: 0;"></div>
        <img
          src="${trial.image}"
          id="jspsych-audio-image"
          class="annotatable"
          style="flex: 1;"
        />
        <div style="width: 147px; flex-shrink: 0;"></div>
      </div>`;

    let audio = `<div id="player-container" class="media-wrapper" style="flex: 1; flex-shrink: 0;"></div>`;

    let container = `<div style="display: flex; flex-direction: column;${
      trial.max_width ? `max-width: ${trial.max_width};` : ""
    }">${image_container}${audio}</div>`;

    let disableAnnotatableIcon = `<style>.annotorious-hint { display: none }<style>`;

    //Create submit button
    let button = document.createElement("button");
    button.innerHTML = "Next";
    button.style.position = "absolute";
    button.style.right = "10%";
    button.onclick = end_trial;

    let button_div = document.createElement("div");
    button_div.style.width = "100%";
    button_div.appendChild(button);

    //Add elements to document
    display_element.innerHTML = container;
    display_element.innerHTML += disableAnnotatableIcon;
    display_element.appendChild(button_div);

    makePlayer();
    makeAnnotatable();
  };

  return plugin;
})();