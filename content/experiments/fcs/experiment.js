// test

/* exported experimentInit */
function experimentInit() {
    const enterKeyPress = 13;

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

    var visualizationStyle = jsPsych.randomization.sampleWithoutReplacement(visualizationStyles, 1);
    var [tuteSite, studySite] = jsPsych.randomization.sampleWithoutReplacement(sites, 2);


    // allow skipping through while debugging
    let overrideVisualization = jsPsych.data.getURLVariable("visualizationStyle");
    if (overrideVisualization) {
        console.warn("Visualization style overridden from,to:", visualizationStyle, overrideVisualization);
        visualizationStyle = overrideVisualization;
    }

    let overrideSite = jsPsych.data.getURLVariable("site");
    if (overrideSite) {
        console.warn("Site and tute site style overridden from,to:", [tuteSite, studySite], overrideSite);
        tuteSite = overrideSite;
        studySite = overrideSite;
    }

    let skipToTrial = jsPsych.data.getURLVariable("skip");
    const defaultOnTrial = () => console.log("Current trial is", jsPsych.currentTimelineNodeID());
    var skipFunction = defaultOnTrial;
    if (skipToTrial) {
        console.warn("skipping to trial", skipToTrial);
        skipFunction = function() {
            var currentTrial = jsPsych.currentTimelineNodeID();
            if (skipToTrial !== currentTrial) {
                console.warn(`Debug skipping trial ${currentTrial} because trial id is not ${skipToTrial}`);
                jsPsych.finishTrial({ skipped: true });
            }
            else {
                // reset

                jsPsych.initSettings().on_trial_start = defaultOnTrial;
            }
        };
    }



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


    var experimentbridge = {
        type: "annotate-audio-image",
        externalHtmlPreamble: "bridge/index.html",
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





    var taskInstructions = {
        type: "external-html",
        url: "Task_instructions/index.html",
        cont_key: enterKeyPress,
        cont_btn: "continue"
    };


    var mainExperiment = {
        timeline: [
            debug,
            tutorialAnnotation,
            experimentbridge,
            taskInstructions,
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



    var subject_id = jsPsych.randomization.randomID(5);

    jsPsych.data.addProperties({
        subject: subject_id,
        condition: visualizationStyle
    });




    /*
        var IMI = {
            type: "survey-likert",
            questions:
                [
                    { id: 1, prompt: "I would describe the task as very enjoyable", labels: scale3 },
                    { id: 2, prompt: "Doing the task was fun", labels: scale3 },
                    { id: 3, prompt: "I thought the task was very boring.", labels: scale3 },
                    { id: 4, prompt: "I found the task very interesting.", labels: scale3 },
                    { id: 5, prompt: "I enjoyed doing the task very much.", labels: scale3 },
                    { id: 6, prompt: "While I was working on the task, I was thinking about how much I enjoyed it.", labels: scale3 },
                    { id: 7, prompt: "I thought the task was very interesting.", labels: scale3 },
                ],
            preamble: "For each of the following statements, please indicate how true it is for you, using the following scale:",
            data: { IMIquestion_order: JSON.stringify(IMIquestion_order.id) }
        };


        var IMIArray = IMI.questions;
        var shuffledIMI = jsPsych.randomization.shuffle(IMIArray);
        IMI.questions = shuffledIMI;
    */

    var IMI_items = [
        { id: 1, prompt: "I would describe the task as very enjoyable", labels: scale3 },
        { id: 2, prompt: "Doing the task was fun", labels: scale3 },
        { id: 3, prompt: "I thought the task was very boring.", labels: scale3 },
        { id: 4, prompt: "I found the task very interesting.", labels: scale3 },
        { id: 5, prompt: "I enjoyed doing the task very much.", labels: scale3 },
        { id: 6, prompt: "While I was working on the task, I was thinking about how much I enjoyed it.", labels: scale3 },
        { id: 7, prompt: "I thought the task was very interesting.", labels: scale3 },
    ];

    var IMI_items_random = jsPsych.randomization.repeat(IMI_items, 1);

    var IMI = {
        preamble: "For each of the following statements, please indicate how true it is for you, using the following scale:",
        type: "survey-likert",
        questions: IMI_items_random,
        data: { question_order: (IMI_items_random.map(x => x.prompt)) }, // appends a JSON representation of the question order to the data
    };


    var NASATLX_items = [
        { id: 1, prompt: "How mentally demanding was the task?", labels: scale1 },
        { id: 2, prompt: "How physically demanding was the task?", labels: scale1 },
        { id: 3, prompt: "How hurried or rushed was the pace of the task?", labels: scale1 },
        { id: 4, prompt: "How sucessful were you in accomplishing what you were asked to do?", labels: scale2 },
        { id: 5, prompt: "How hard did you have to work to accomplish your level of performance?", labels: scale1 },
        { id: 6, prompt: "How insecure, discouraged, irritated, stressed, and annoyed were you?", labels: scale1 },
    ];

    var NASATLX_items_random = jsPsych.randomization.repeat(NASATLX_items, 1);

    var NASATLX = {
        type: "survey-likert",
        questions: NASATLX_items_random,
        data: { question_order: (NASATLX_items_random.map(x => x.prompt)) },
    };


    var randomSurveys = jsPsych.randomization.repeat([IMI, NASATLX], 1);
    Array.prototype.push.apply(timeline, randomSurveys);

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
        url: "TheEnd/index.html",
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
        },
        on_trial_start: skipFunction
    };
}
