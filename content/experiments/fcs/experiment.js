// test

/* exported experimentInit */
function experimentInit() {
    const enterKeyPress = 13;

    // site visualization combos
    var availableVisualizationStyles = ["fcs", "spectrogram", "waveform", "audioOnly"];
    var sites = [
        {
            name: "Liz Tasmania",
            images: {
                fcs: "./images/FCS_Liz.png",
                spectrogram: "./images/greyscale_Liz.png",
                waveform: "./images/waveform_Liz.png",
                audioOnly: "./images/whitebox1.png"
            },
            axes:
            {
                fcs: { x: { min: "2019-05-29", max: "2019-05-30" }, y: { min: 0, max: 11025 } },
                spectrogram: { x: { min: "2019-05-29", max: "2019-05-30" }, y: { min: 0, max: 11025 } },
                waveform: { x: { min: "2019-05-29", max: "2019-05-30" }, y: { min: -1.0, max: 1.0 } },
                audioOnly: { x: { min: "2019-05-29", max: "2019-05-30" } }
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/SM304256_0%2B1_20151113_000000%2B1100.mp3",
            instructions: "task_Liz/index.html"
        },
        {
            name: "Sheryn",
            images:
            {
                fcs: "./images/FCS_Sheryn.png",
                spectrogram: "./images/greyscale_Sheryn.png",
                waveform: "./images/waveform_Sheryn.png",
                audioOnly: "./images/whitebox1.png"
            },
            axes:
            {
                fcs: { x: { min: "2017-02-08", max: "2017-02-09" }, y: { min: 0, max: 11025 } },
                spectrogram: { x: { min: "2017-02-08", max: "2017-02-09" }, y: { min: 0, max: 11025 } },
                waveform: { x: { min: "2017-02-08", max: "2017-02-09" }, y: { min: -1.0, max: 1.0 } },
                audioOnly: { x: { min: "2017-02-08", max: "2017-02-09" } }
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/Sheryn_concat.mp3",
            instructions: "task_Sheryn/index.html"
        },

        {
            name: "Inala",
            images:
            {
                fcs: "./images/FCS_Inala.png",
                spectrogram: "./images/greyscale_Inala.png",
                waveform: "./images/waveform_Inala.png",
                audioOnly: "./images/whitebox1.png"
            },
            axes:
            {
                fcs: { x: { min: "2018-09-22", max: "2018-09-23" }, y: { min: 0, max: 11025 } },
                spectrogram: { x: { min: "2018-09-22", max: "2018-09-23" }, y: { min: 0, max: 11025 } },
                waveform: { x: { min: "2018-09-22", max: "2018-09-23" }, y: { min: -1.0, max: 1.0 } },
                audioOnly: { x: { min: "2018-09-22", max: "2018-09-23" } }
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/Inala_24hrs.mp3",
            instructions: "task_Inala/index.html"
        },

        {
            name: "TNC_Indo",
            images:
            {
                fcs: "./images/FCS_TNC_Indo.png",
                spectrogram: "./images/greyscale_TNC_Indo.png",
                waveform: "./images/waveform_TNC_Indo.png",
                audioOnly: "./images/whitebox1.png"
            },
            axes: {
                fcs: { x: { min: "2016-08-02", max: "2016-08-03" }, y: { min: 0, max: 11025 } },
                spectrogram: { x: { min: "2016-08-02", max: "2016-08-03" }, y: { min: 0, max: 11025 } },
                waveform: { x: { min: "2016-08-02", max: "2016-08-03" }, y: { min: -1.0, max: 1.0 } },
                audioOnly: { x: { min: "2016-08-02", max: "2016-08-03" } }
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/TNCIndo60_0-2400.mp3",
            instructions: "task_Indo/index.html"
        }

    ];

    var visualizationStyles = jsPsych.randomization.sampleWithoutReplacement(availableVisualizationStyles, 1);
    var tuteSiteName = "Inala";
    var conditions = jsPsych
        // randomize sites and combine with visualization styles to create all conditions
        .randomization.factorial({visualizationStyle: visualizationStyles, site: sites}, 1)
        // ensure the tute site comes first
        .reduce((result, item) => item.site.name === tuteSiteName ? [item, ...result] : [...result, item], []);



    // allow setting a particular visualization style for debugging
    let overrideVisualization = jsPsych.data.getURLVariable("visualizationStyle");
    if (overrideVisualization) {
        console.warn("Visualization style overridden from,to:", visualizationStyles, overrideVisualization);
        visualizationStyles = overrideVisualization;
    }

    //  subject id & likert measures
    var subject_id = jsPsych.randomization.randomID(10);

    /*var scale1 = ["Very Low", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Very High"];
    var scale2 = ["Failure", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Perfect"]; */
    var scale3 = ["Not at all true", "", "", "Somewhat true", "", "", "Very true"];
    var scale4 = ["Strongly disagree", "","","","","", "Strongly agree"];


    var imiItemsRandom = jsPsych.randomization.repeat([
        { id: 1, prompt: "I would describe the task as very enjoyable", labels: scale3 },
        { id: 2, prompt: "Doing the task was fun", labels: scale3 },
        { id: 3, prompt: "I thought the task was very boring.", labels: scale3 },
        { id: 4, prompt: "I found the task very interesting.", labels: scale3 },
        { id: 5, prompt: "I enjoyed doing the task very much.", labels: scale3 },
        { id: 6, prompt: "While I was working on the task, I was thinking about how much I enjoyed it.", labels: scale3 },
        { id: 7, prompt: "I thought the task was very interesting.", labels: scale3 },
    ], 1);

    var IMI_explore = {
        preamble: "Please think about the task you just completed, and indicate how true the following statements are for you:",
        type: "survey-likert",
        questions: imiItemsRandom,
        data: { trialName: "IMI", question_order: (imiItemsRandom.map(x => x.prompt)) },
    };

    var IMI_search = {
        preamble: "Please think about the search task you performed over three different soundscapes, and indicate how true the following statements are for you overall:",
        type: "survey-likert",
        questions: imiItemsRandom,
        data: { trialName: "IMI", question_order: (imiItemsRandom.map(x => x.prompt)) },
    };

    var challengeItemsRandom = jsPsych.randomization.repeat([
        { id: 1, prompt: "I found this to be a complex task", labels: scale4 },
        { id: 2, prompt: "This task was mentally demanding", labels: scale4 },
        { id: 3, prompt: "This task required a lot of thought and problem solving", labels: scale4 },
        { id: 4, prompt: "I found this to be a challenging task", labels: scale4 },
    ], 1);

    var challenge = {
        preamble: "Please think about the three timed tasks you just completed, and indicate how much you agree with the following statements overall:",
        type: "survey-likert",
        questions: challengeItemsRandom,
        data: { trialName: "NASATLX", question_order: (challengeItemsRandom.map(x => x.prompt)) },
    };

    // helper functions

    var getSite = () =>  jsPsych.timelineVariable("site", true);
    var getStyle = () => jsPsych.timelineVariable("visualizationStyle", true);
    var getImage = () => getSite().images[getStyle()];
    var getAudio = () => getSite().audio;
    var getAxes = () => getSite().axes[getStyle()];
    var getExternalHtmlPreamble = () => getSite().instructions;
    var getCondition = () => ({site: getSite().name, visualizationStyle: getStyle()});

    // timeline

    var timeline = [];

    var welcome = {
        type: "external-html",
        url: "welcome/index.html",
        cont_key: enterKeyPress,
        cont_btn: "continue",
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

    //tutorial and experimental tasks
    var tutorialAnnotation = {
        type: "annotate-audio-image",
        externalHtmlPreamble: "Tutorial/index.html",
        image: getImage,
        audio: getAudio,
        axes: getAxes,
        data: () => ({
            condition: getCondition()
        })
    };

    var exploreTask = {
        type: "annotate-audio-image",
        externalHtmlPreamble: "explore_task/index.html",
        image: getImage,
        audio: getAudio,
        axes: getAxes,
        data: () => ({
            condition: getCondition()
        })
    };

    var exploreQs = {
        type: "external-html",
        url: "explore_questions/index.html",
        cont_key: enterKeyPress,
        cont_btn: "continue"
    };

    var tutorialAndExplore = {
        timeline: [
            tutorialAnnotation,
            exploreTask,
            exploreQs,
            IMI_explore
        ],
        // we'll use the first condition for both tutorial and explore tasks
        timeline_variables: conditions.slice(0, 1),
    };
    timeline.push(tutorialAndExplore);


    var searchInstructions = {
        type: "external-html",
        url: "search_instructions/index.html",
        cont_key: enterKeyPress,
        cont_btn: "continue",
        data: {
            submitExperimentData: true
        }
    };
    timeline.push(searchInstructions);

    var searchTask = {
        type: "annotate-audio-image",
        externalHtmlPreamble: getExternalHtmlPreamble,
        image: getImage,
        audio: getAudio,
        axes: getAxes,
        data: () => ({
            // checkpoint and save our experiment data
            // TODO Kellie: this is a lot of data submissions.
            // In total there will be 5 per experiment: searchInstructions + 3 × searchTask + 1 more when experiment finished
            submitExperimentData: true,
            condition: getCondition()
        }),
    };

    // repeat the search task for each of the conditions supplied to timeline_variable
    var searchExperiment = {
        timeline: [
            searchTask
        ],
        // skip the first condition since it was used for the tutorial and explore tasks
        timeline_variables: conditions.slice(1),
        // sample: {
        //     type: "without-replacement",
        //     size: 1
        // }
    };
    timeline.push(searchExperiment);


    var randomSurveys = jsPsych.randomization.repeat([IMI_search, challenge], 1);
    Array.prototype.push.apply(timeline, randomSurveys);

    /* var survey2 = {
        type: "survey-html-form",
        url: "lastQs/index.html",
        button_label: "Continue"
    };
    timeline.push(survey2);
*/
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
        on_start: function() {
            jsPsych.endExperiment();
        }
    };

    timeline.push(end);

    return {
        timeline: timeline,
        show_progress_bar: true,
        auto_update_progress_bar: true,
        exclusions: {
            audio: true,
            min_width: 1366
        },
        // this is used by common.js and not a psychJS setting
        prepareDataForSubmit: function() {
            return {
                "subject": subject_id,
                "allConditions": {
                    visualizationStyles: visualizationStyles,
                    sites: conditions.map(x => x.site.name)
                },
                "trials": jsPsych.data.get().values(),
                "interactionData": jsPsych.data.getInteractionData().values()
            };
        },
        // this is used by common.js and not a psychJS setting
        experimentName: "fcs"
    };
}
