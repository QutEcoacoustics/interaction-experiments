/**
 * @description Image viewer with annotation abilities that displays an audio player underneath.
 * The width of the audio player timeline matches the size of the image so that users can easily
 * view where in the image the audio relates to.
 * @returns List of annotation events (creation, updates, removals)
 * @requires ./lib
 * @author Charles Alleman
 */
jsPsych.plugins["audio-image"] = (function() {
  var plugin = {};

  plugin.info = {
    name: "audio-image",
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
      width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Image Width",
        default: null,
        description:
          "Width of the image element. This does not work with percentage values."
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
      return trial.audio.split(".")[1];
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
     * Create a javascript HTMLScriptElement to insert into the document.
     * @param {string} filePath Path to javascript file
     * @param {function} onload Function to run onload of javascript file
     * @returns {HTMLScriptElement} Javascript element to insert into document
     */
    function loadJavascript(filePath, onload) {
      let js = document.createElement("script");
      js.type = "application/javascript";
      js.src = filePath;
      if (onload) js.onload = onload;

      return js;
    }

    /**
     * Create a css HTMLLinkElement to insert into the document.
     * @param {string} filePath Path to css file
     * @returns {HTMLLinkElement} CSS element to insert into document
     */
    function loadStylesheet(filePath) {
      let css = document.createElement("link");
      css.type = "text/css";
      css.rel = "stylesheet";
      css.href = filePath;

      return css;
    }

    /**
     * Create the audio player
     */
    let makePlayer = () => {
      const END_OFFSET = 239;
      let image_width = document.getElementById("jspsych-audio-image")
        .offsetWidth;
      width = parseInt(image_width + END_OFFSET) + "px";

      let audio = `<audio id="player" preload="none" controls width='${width}' ${
        trial.loop ? "loop" : null
      } ${trial.autoplay ? "autoplay" : null}><source src="${
        trial.audio
      }" type="audio/${getFileExtension(trial.audio)}"/></audio>`;

      console.log(audio);

      //Create audio element with the following additional options: loop, autoplay
      document.getElementById("player-container").innerHTML = audio;

      var player = new MediaElementPlayer("player", {
        success: function(mediaElement, originalNode, instance) {}
      });
    };

    /**
     * Enable image annotations
     */
    let makeAnnotatable = () => {
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
    };

    //Download annotorious files
    let annotorious_js = loadJavascript(
      "http://annotorious.github.com/latest/annotorious.min.js",
      makeAnnotatable
    );
    let annotorious_css = loadStylesheet(
      "http://annotorious.github.com/latest/annotorious.css"
    );

    //Download mediaelementplayer files
    let mediaelementplayer_js = loadJavascript(
      "lib/mediaelement-and-player.js",
      makePlayer
    );
    let mediaelementplayer_css = loadStylesheet("lib/mediaelementplayer.css");

    //Create image and audio
    let image_html = `<img src="${
      trial.image
    }" id="jspsych-audio-image" class="annotatable" style="margin-left: -58px;${
      trial.width ? ` width: ${trial.width};` : ""
    }"></img>`;

    let audio_html = `<div id="player-container" class="media-wrapper"></div>`;

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
    display_element.innerHTML = image_html;
    display_element.innerHTML += audio_html;
    display_element.appendChild(button_div);
    display_element.appendChild(annotorious_js);
    display_element.appendChild(annotorious_css);
    display_element.appendChild(mediaelementplayer_js);
    display_element.appendChild(mediaelementplayer_css);
  };

  return plugin;
})();
