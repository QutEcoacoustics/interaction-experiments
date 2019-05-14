// test
/* exported experimentInit */
function experimentInit() {
    const enterKeyPress = 13;

    // other stuff

    // if a subject has given consent to participate.
    var checkConsent = function(elem) {
        if (elem.querySelector("#consentCheckbox").checked) {
            return true;
        }
        else {
            alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
            return false;
        }
    };

    // site visualization combos
    // TODO: need to add correct resources... but for now proves the point
    var visualizationStyles = ["fcs", "spectrogram", "waveform", "audioOnly"];
    var sites = [
        {
            name: "Liz Tasmania",
            images: {
                fcs: "./images/FCS_Liz.PNG",
                spectrogram: "./images/FCS_Liz.PNG",
                waveform: "./images/greyscale_Liz_Lewin's Rail_cropped.png",
                audioOnly: "placeholder.png"
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/audio-image-audio.wav"
        },
        {
            name: "Sheryn",
            images: {
                fcs: "./images/FCS_Liz.PNG",
                spectrogram: "./images/FCS_Liz.PNG",
                waveform: "./images/greyscale_Liz_Lewin's Rail_cropped.png",
                audioOnly: "placeholder.png"
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/audio-image-audio.wav"
        },
        {
            name: "Inala",
            images: {
                fcs: "./images/FCS_Liz.PNG",
                spectrogram: "./images/FCS_Liz.PNG",
                waveform: "./images/greyscale_Liz_Lewin's Rail_cropped.png",
                audioOnly: "placeholder.png"
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/audio-image-audio.wav"
        }
    ];

    // timeline

    var timeline = [];

    var welcome = {
        type: "external-html",
        url: "welcome/index.html",
        cont_key: enterKeyPress,
        cont_btn: "continue"
    };
    timeline.push(welcome);

    var ethics = {
        type: "external-html",
        url: "ethics/index.html",
        cont_key: enterKeyPress,
        cont_btn: "continue",
        check_fn: checkConsent
    };
    timeline.push(ethics);

    var survey = {
        type: "survey-text",
        questions:[
            "Placeholder"
        ],
        preamble: "Probably need to use a more fleshed out tool https://github.com/surveyjs/survey-library"
    };
    timeline.push(survey);

    var audioImage = {
        type: "annotate-audio-image",
        image: "./wavform_Liz_cropped.png",
        audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/audio-image-audio.wav",
    }
    timeline.push(audioImage);
    
    // for testing, remove later
    var debug = {
        type: "html-button-response",
        choices: ["OK"],
        stimulus: function() {
            var data = {
                site: jsPsych.timelineVariable("sites")(),
                visualizationStyles: jsPsych.timelineVariable("visualizationStyles")()
            };
            var trialData = JSON.stringify(data, null, 2);
            return `<pre>${trialData}</pre>`;
        }
    };

    var instructions = {
        type: "instructions",
        pages: [
            "Welcome to the experiment. Click next to begin.",
            "This is the second page of instructions.",
            "This is the final page."
        ],
        show_clickable_nav: true,
        
    };

    var audioImage = {
        type: "audio-image",
        image: null, // set in our on_start function just below
        audio: null, // set in our on_start function just below
        on_start: function(trial) {
            var data =  jsPsych.timelineVariable("sites")();
            var visualization = jsPsych.timelineVariable("visualizationStyles")();
            trial["image"] = data.images[visualization];
            trial["audio"] = data.audio;
        }
    };

    var mainExperiment = {
        timeline: [
            debug,
            instructions,
            audioImage,
        ],
        timeline_variables: jsPsych.randomization.factorial({
            sites: sites, 
            visualizationStyles: visualizationStyles
        }, 1, false),
        sample: {
            type: "without-replacement",
            size: 1
        }
    };
    timeline.push(mainExperiment);

    return {
        timeline: timeline,
        show_progress_bar: true,
        auto_update_progress_bar: true,
        exclusions: {
            audio: true,
            min_width: 1500
        }
    };
}
  