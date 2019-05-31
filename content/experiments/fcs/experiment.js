// test

/* exported experimentInit */
function experimentInit() {
    const enterKeyPress = 13;

    // site visualization combos
    // TODO: need to add correct resources... but for now proves the point
    //images are updated - needs correct audio
    var availableVisualizationStyles = ["fcs", "spectrogram", "waveform", "audioOnly"];
    var sites = [
        {
            name: "Liz Tasmania",
            images: {
                fcs: "./images/FCS_Liz.png",
                spectrogram: "./images/greyscale_Liz.png",
                waveform: "./images/waveform_Liz.png",
                audioOnly: "./images/blueblock.png"
            },
            axes:
            {
                fcs: { x: { min: "2019-05-29", max: "2019-05-30" }, y: { min: 0, max: 11025 } },
                spectrogram: { x: { min: "2019-05-29", max: "2019-05-30" }, y: { min: 0, max: 11025 } },
                waveform: { x: { min: "2019-05-29", max: "2019-05-30" }, y: { min: -1.0, max: 1.0 } },
                audioOnly: { x: { min: "2019-05-29", max: "2019-05-30" } }
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/SM304256_0%2B1_20151113_000000%2B1100.mp3"
        },
        {
            name: "Sheryn",
            images:
            {
                fcs: "./images/FCS_Sheryn.png",
                spectrogram: "./images/greyscale_Sheryn.png",
                waveform: "./images/waveform_Sheryn.png",
                audioOnly: "./images/blueblock.png"
            },
            axes:
            {
                fcs: { x: { min: "2017-02-08", max: "2017-02-09" }, y: { min: 0, max: 11025 } },
                spectrogram: { x: { min: "2017-02-08", max: "2017-02-09" }, y: { min: 0, max: 11025 } },
                waveform: { x: { min: "2017-02-08", max: "2017-02-09" }, y: { min: -1.0, max: 1.0 } },
                audioOnly: { x: { min: "2017-02-08", max: "2017-02-09" } }
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/Sheryn_concat.mp3"
        },

        /*{
            name: "Inala",
            images: {
                fcs: "./images/FCS_Inala.png",
                spectrogram: "./images/greyscale_Inala.png",
                waveform: "./images/waveform_Inala.png",
                audioOnly: "./images/blueblock.png"
            },
            axes:
            {
                 fcs: { x: { min: "2018-09-22", max: "2018-09-23" }, y: { min: 0, max: 11025 } },
                 spectrogram: { x: { min: "2018-09-22", max: "2018-09-23" }, y: { min: 0, max: 11025 } },
                 waveform: { x: { min: "2018-09-22", max: "2018-09-23" }, y: { min: -1.0, max: 1.0 } },
                 audioOnly: { x: { min: "2018-09-22", max: "2018-09-23" } }
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/Inala_24hrs.mp3"
        }
         name: "TNC_Indo",
            images:
            {
                fcs: "./images/<intentionally broken>.png",
                spectrogram: "./images/<intentionally broken>.png",
                waveform: "./images/<intentionally broken>.png",
                audioOnly: "./images/blueblock.png"
            },
            axes: {
                 fcs: { x: { min: "2016-08-02", max: "2016-08-03" }, y: { min: 0, max: 11025 } },
                 spectrogram: { x: { min: "2016-08-02", max: "2016-08-03" }, y: { min: 0, max: 11025 } },
                 waveform: { x: { min: "2016-08-02", max: "2016-08-03" }, y: { min: -1.0, max: 1.0 } },
                 audioOnly: { x: { min: "2016-08-02", max: "2016-08-03" } }
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/TNCIndo60_0-2400.mp3"
        }
        */
    ];

    var visualizationStyles = jsPsych.randomization.sampleWithoutReplacement(availableVisualizationStyles, 1);
    var [tuteSite, studySite] = jsPsych.randomization.sampleWithoutReplacement(sites, 2);


    // allow skipping through while debugging
    let overrideVisualization = jsPsych.data.getURLVariable("visualizationStyle");
    if (overrideVisualization) {
        console.warn("Visualization style overridden from,to:", visualizationStyles, overrideVisualization);
        visualizationStyles = overrideVisualization;
    }

    let overrideSite = jsPsych.data.getURLVariable("site");
    if (overrideSite) {
        console.warn("Site and tute site style overridden from,to:", [tuteSite, studySite], overrideSite);
        tuteSite = overrideSite;
        studySite = overrideSite;
    }

    //  scales for likert questions
    var scale1 = ["Very Low", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Very High"];
    var scale2 = ["Perfect", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Failure"];
    var scale3 = ["Not at all true", "", "", "Somewhat true", "", "", "Very true"];

    var subject_id = jsPsych.randomization.randomID(10);

    jsPsych.data.addProperties({
        subject: subject_id,
        condition: {
            visualizationStyle: visualizationStyles[0],
            tuteSite: tuteSite.name,
            studySite: studySite.name
        }
    });

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
    var tutorialAnnotation = {
        type: "annotate-audio-image",
        externalHtmlPreamble: "Tutorial/index.html",
        image: function() {
            var site = jsPsych.timelineVariable("tuteSite")();
            var visualization = jsPsych.timelineVariable("visualizationStyle")();
            return site.images[visualization];
        },
        audio: function() {
            var site = jsPsych.timelineVariable("tuteSite")();
            return site.audio;
        },
        axes: function() {
            var site = jsPsych.timelineVariable("tuteSite")();
            var visualization = jsPsych.timelineVariable("visualizationStyle")();
            return site.axes[visualization];
        },
        // checkpoint and save our experiment data
        data: {
            submitExperimentData: true
        }
    };


    var exploreQs = {
        type: "annotate-audio-image",
        externalHtmlPreamble: "explore_questions/index.html",
        image: function() {
            var site = jsPsych.timelineVariable("tuteSite")();
            var visualization = jsPsych.timelineVariable("visualizationStyle")();
            return site.images[visualization];
        },
        audio: function() {
            var site = jsPsych.timelineVariable("tuteSite")();
            return site.audio;
        },
        axes: function() {
            var site = jsPsych.timelineVariable("tuteSite")();
            var visualization = jsPsych.timelineVariable("visualizationStyle")();
            return site.axes[visualization];
        }
    };


    var task1prompt = {
        type: "external-html",
        url: "Task1prompt/index.html",
        cont_key: enterKeyPress,
        cont_btn: "continue"
    };


    var experimentBridge = {
        type: "annotate-audio-image",
        externalHtmlPreamble: "bridge/index.html",
        image: function() {
            var site = jsPsych.timelineVariable("tuteSite")();
            var visualization = jsPsych.timelineVariable("visualizationStyle")();
            return site.images[visualization];
        },
        audio: function() {
            var site = jsPsych.timelineVariable("tuteSite")();
            return site.audio;
        },
        axes: function() {
            var site = jsPsych.timelineVariable("tuteSite")();
            var visualization = jsPsych.timelineVariable("visualizationStyle")();
            return site.axes[visualization];
        }
    };

    var experimentAnnotation = {
        type: "annotate-audio-image",
        externalHtmlPreamble: "Task/index.html",
        image: function() {
            var site = jsPsych.timelineVariable("studySite")();
            var visualization = jsPsych.timelineVariable("visualizationStyle")();
            return site.images[visualization];
        },
        audio: function() {
            var site = jsPsych.timelineVariable("studySite")();
            return site.audio;
        },
        axes: function() {
            var site = jsPsych.timelineVariable("studySite")();
            var visualization = jsPsych.timelineVariable("visualizationStyle")();
            return site.axes[visualization];
        },
        // checkpoint and save our experiment data
        data: {
            submitExperimentData: true
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
            tutorialAnnotation,
            exploreQs,
            task1prompt,
            experimentBridge,
            taskInstructions,
            experimentAnnotation
        ],
        timeline_variables: [
            {
                tuteSite: tuteSite,
                studySite: studySite,
                visualizationStyle: visualizationStyles[0],
            }
        ],
        // sample: {
        //     type: "without-replacement",
        //     size: 1
        // }
    };
    timeline.push(mainExperiment);



    var imiItemsRandom = jsPsych.randomization.repeat([
        { id: 1, prompt: "I would describe the tasks as very enjoyable", labels: scale3 },
        { id: 2, prompt: "Doing the tasks was fun", labels: scale3 },
        { id: 3, prompt: "I thought the tasks were very boring.", labels: scale3 },
        { id: 4, prompt: "I found the tasks very interesting.", labels: scale3 },
        { id: 5, prompt: "I enjoyed doing the tasks very much.", labels: scale3 },
        { id: 6, prompt: "While I was working on the tasks, I was thinking about how much I enjoyed it.", labels: scale3 },
        { id: 7, prompt: "I thought the tasks were very interesting.", labels: scale3 },
    ], 1);

    var IMI = {
        preamble: "Please think about the two timed tasks you just completed. For each of the following statements, indicate how true it is for you overall, using the following scale:",
        type: "survey-likert",
        questions: imiItemsRandom,
        data: { trialName: "IMI", question_order: (imiItemsRandom.map(x => x.prompt)) }, // appends a JSON representation of the question order to the data
    };

    var nasatlxItemsRandom = jsPsych.randomization.repeat([
        { id: 1, prompt: "How mentally demanding were the tasks?", labels: scale1 },
        { id: 2, prompt: "How physically demanding were the tasks?", labels: scale1 },
        { id: 3, prompt: "How hurried or rushed was the pace of the tasks?", labels: scale1 },
        { id: 4, prompt: "How sucessful were you in accomplishing what you were asked to do?", labels: scale2 },
        { id: 5, prompt: "How hard did you have to work to accomplish your level of performance?", labels: scale1 },
        { id: 6, prompt: "How insecure, discouraged, irritated, stressed, and annoyed were you?", labels: scale1 },
    ], 1);

    var NASATLX = {
        preamble: "Please think about the two timed tasks you just completed and answer the following questions:",
        type: "survey-likert",
        questions: nasatlxItemsRandom,
        data: { trialName: "NASATLX", question_order: (nasatlxItemsRandom.map(x => x.prompt)) },
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
        button_label: "Continue",
        // checkpoint and save our experiment data
        data: {
            submitExperimentData: true
        }
    };
    timeline.push(contact);

    var end = {
        type: "external-html",
        url: "TheEnd/index.html"
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
        // this is used by common.js and not a psychJS setting
        prepareDataForSubmit: function() {
            return {
                "subject": subject_id,
                "trials": jsPsych.data.get().values(),
                "interactionData": jsPsych.data.getInteractionData().values()
            };
        },
        // this is used by common.js and not a psychJS setting
        experimentName: "fcs"
    };
}
