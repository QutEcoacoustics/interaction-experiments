// test

/* exported experimentInit */
function experimentInit() {
    const enterKeyPress = 13;


    // other stuff

    // if a subject has given consent to participate.
    // var checkConsent = function(elem) {
    //     if (elem.querySelector("#consentCheckbox").checked) {
    //         return true;
    //     } else {
    //         alert(
    //             "If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'"
    //         );
    //         return false;
    //     }
    // };

    // site visualization combos
    // TODO: need to add correct resources... but for now proves the point
    //images are updated - needs correct audio



    var visualizationStyles = ["fcs", "spectrogram", "waveform", "audioOnly"];
    var sites = [
        {
            name: "Liz Tasmania",
            images: {
                fcs: "./images/FCS_Liz.png",
                spectrogram: "./images/greyscale_Liz.png",
                waveform: "./images/waveform_Liz.png",
                audioOnly: "./images/blueblock.png"
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/audio-image-audio.wav"
        },
        {
            name: "Sheryn",
            images: {
                fcs: "./images/FCS_Sheryn.png",
                spectrogram: "./images/greyscale_Sheryn.png",
                waveform: "./images/waveform_Sheryn.png",
                audioOnly: "./images/blueblock.png"
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/audio-image-audio.wav"
        },
        {
            name: "Inala",
            images: {
                fcs: "./images/FCS_Inala.png",
                spectrogram: "./images/greyscale_Inala.png",
                waveform: "./images/waveform_Inala.png",
                audioOnly: "./images/blueblock.png"
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/audio-image-audio.wav"
        }
    ];

    //  scales for likert questions
    var scale1 = ["Very Low", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Very High"];
    var scale2 = ["Perfect", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Failure"];
    var scale3 = ["Not at all true", "", "", "Somewhat true", "", "", "Very true"];


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
        cont_btn: "continue"
    };
    timeline.push(ethics);

    var survey1 = {
        type: "survey-html-form",
        url: "introQs/index.html",
        button_label: "Continue"
    };
    timeline.push(survey1);




    //tutorial and experimental task
    var tutorial_pages = "Tutorial/index.html";

    var tutorialInstructions = {
        type: "instructions",
        pages: tutorial_pages,
        cont_btn: "continue"
    };

    // for testing, remove later
    var debug = {
        type: "html-button-response",
        choices: ["OK"],
        stimulus: function() {
            var data = {
                tuteSite: jsPsych.timelineVariable("tuteSite")(),
                site: jsPsych.timelineVariable("sites")(),
                visualizationStyles: jsPsych.timelineVariable("visualizationStyles")()
            };
            var trialData = JSON.stringify(data, null, 2);
            return `<pre>${trialData}</pre>`;
        }
    };

    var tutorialAnnotation = {
        type: "annotate-audio-image",
        externalHtmlPreamble: "Tutorial/index.html",
        image: function() {
            var data = jsPsych.timelineVariable("tuteSite")();
            var visualization = jsPsych.timelineVariable("visualizationStyles")();
            return data.images[visualization];
        },
        audio: function() {
            var data = jsPsych.timelineVariable("tuteSite")();
            return data.audio;
        }
    };

    var experimentAnnotation = {
        type: "annotate-audio-image",
        externalHtmlPreamble: "Task/index.html",
        image: function() {
            var data = jsPsych.timelineVariable("sites")();
            var visualization = jsPsych.timelineVariable("visualizationStyles")();
            return data.images[visualization];
        },
        audio: function() {
            var data = jsPsych.timelineVariable("sites")();
            return data.audio;
        }
    };


    var visualizationStyle = jsPsych.randomization.sampleWithoutReplacement(visualizationStyles, 1);
    var [tuteSite, studySite] = jsPsych.randomization.sampleWithoutReplacement(sites, 2);

    // adding taskinstructions here and in mainExperiment
    //currently not working but timeline should grab content from Tutorial.md, then taskinstructions, then Task.md

    var taskinstructions = {
        type: "survey-html-form",
        url: "Task_instructions/index.html",
        button_label: "continue"
    };


    var mainExperiment = {
        timeline: [
            debug,
            tutorialAnnotation,
            taskinstructions,
            experimentAnnotation
        ],
        timeline_variables: [
            {
                tuteSite: tuteSite,
                sites: studySite,
                visualizationStyles: visualizationStyle,
                tutePages: tutorial_pages
            }
        ],
        // sample: {
        //     type: "without-replacement",
        //     size: 1
        // }
    };
    timeline.push(mainExperiment);

    //adding a subjectID tied to condition - is this in the right place?

    var subject_id = jsPsych.randomization.randomID(5);

    jsPsych.data.addProperties({
        subject: subject_id,
        condition: visualizationStyle
    });


    // ideally randomise the two screens dealing with IMI and NASATLX - hence randomise-order:true which doesn't seem to be working


    var IMI = {
        type: "survey-likert",
        questions:
            [
                { prompt: "I would describe the task as very enjoyable", labels: scale3 },
                { prompt: "Doing the task was fun", labels: scale3 },
                { prompt: "I thought the task was very boring.", labels: scale3 },
                { prompt: "I found the task very interesting.", labels: scale3 },
                { prompt: "I enjoyed doing the task very much.", labels: scale3 },
                { prompt: "While I was working on the task, I was thinking about how much I enjoyed it.", labels: scale3 },
                { prompt: "I thought the task was very interesting.", labels: scale3 },
            ],
        preamble: "For each of the following statements, please indicate how true it is for you, using the following scale:",
        randomise_order: true
    };

    var IMIArray = IMI.questions;
    var shuffledArray = jsPsych.randomization.shuffle(IMIArray);
    IMI.questions = shuffledArray;
    timeline.push(IMI);

    var NASATLX = {
        type: "survey-likert",
        questions:
            [
                { prompt: "How mentally demanding was the task?", labels: scale1 },
                { prompt: "How physically demanding was the task?", labels: scale1 },
                { prompt: "How hurried or rushed was the pace of the task?", labels: scale1 },
                { prompt: "How sucessful were you in accomplishing what you were asked to do?", labels: scale2 },
                { prompt: "How hard did you have to work to accomplish your level of performance?", labels: scale1 },
                { prompt: "How insecure, discouraged, irritated, stressed, and annoyed were you?", labels: scale1 },
            ],
        preamble: "Please answer the following questions regarding the task you just performed.",
        randomise_order: true
    };

    var NASAArray = NASATLX.questions;
    var shuffledArray = jsPsych.randomization.shuffle(NASAArray);
    NASATLX.questions = shuffledArray;
    timeline.push(NASATLX);

    var survey2 = {
        type: "survey-html-form",
        url: "lastQs/index.html",
        button_label: "Continue"
    };
    timeline.push(survey2);

    //

    var contact = {
        type: "survey-html-form",
        url: "contact/index.html",
        button_label: "Continue"
    };
    timeline.push(contact);

    var end = {
        type: "external-html",
        url: "the_end/index.html",
        cont_key: enterKeyPress,
        cont_btn: "continue"
    };

    timeline.push(end);

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
