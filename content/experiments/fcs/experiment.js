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
    //participants need unique IDs assoc'd with their data (same ID across any collector if not all from jspsych or linkable)



    var visualizationStyles = ["fcs", "spectrogram", "waveform", "audioOnly"];
    var sites = [
        {
            name: "Liz Tasmania",
            images: {
                fcs: "./images/FCS_Liz.PNG",
                spectrogram: "./images/greyscale_Liz.png",
                waveform: "./images/waveform_Liz.png",
                audioOnly: "./images/blueblock.png"
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/audio-image-audio.wav"
        },
        {
            name: "Sheryn",
            images: {
                fcs: "./images/FCS_Sheryn.PNG",
                spectrogram: "./images/greyscale_Sheryn.png",
                waveform: "./images/waveform_Sheryn.PNG",
                audioOnly: "./images/blueblock.png"
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/audio-image-audio.wav"
        },
        {
            name: "Inala",
            images: {
                fcs: "./images/FCS_Inala.png",
                spectrogram: "./images/greyscale_Inala.png",
                waveform: "./images/waveform.Inala.PNG",
                audioOnly: "./images/blueblock.png"
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
        cont_btn: "continue"
    };
    timeline.push(ethics);

    //survey qs pre-test - how to get s1q1-s1q7 on the one page:
    //https://github.com/jspsych/jsPsych/blob/40d50e89a20bd0b0677be4d64999fac9b429690a/plugins/jspsych-survey-html-form.js

    var scale1 = ["Not at all knowledgeable", "", "", "", "", "", "Very knowledgeable"];
    var scale2 = ["Not at all experienced", "", "", "", "", "", "Very experienced"];
    var scale3 = ["Not at all true", "", "", "Somewhat true", "", "", "Very true"];

    var s1q1 = {
        type: "survey-text",
        questions: { prompt: "What is your age?", rows: 1, columns: 5 }
    };

    var s1q2 = {
        type: "survey-multi-choice",
        questions: {
            prompt: "what is your gender?",
            options: ["Male", "Female", "Please list"]
        }
    };

    var s1q2text = {
        type: "survey-text",
        questions: {
            prompt: "if you indicated 'not listed', please state:",
            rows: 1,
            columns: 40
        }
    };

    var s1q3 = {
        type: "survey-multi-choice",
        questions: {
            prompt: "What is your interest in ecology?",
            options: ["Casual interest", "Professional interest", "No interest"]
        }
    };

    var s1q3text = {
        type: "survey-text",
        questions: {
            prompt:
                "If you answered casual or professional interest, can you tell us more about it here?",
            rows: 5,
            columns: 40
        }
    };

    var s1q4 = {
        type: "survey-likert",
        questions: {
            prompt:
                "How knowledgeable are you about any kind of soundscape ecology, ecoacoustics, or bioacoustics?",
            labels: scale1
        }
    };

    var s1q5 = {
        type: "survey-likert",
        questions: {
            prompt: "How experience are you with using environmental recordings?",
            labels: scale2
        }
    };

    var s1q6 = {
        type: "survey-likert",
        questions: {
            prompt:
                "How experience are you with using any kind of acoustic visualisation? (e.g. waveforms, spectrograms)",
            labels: scale2
        }
    };

    //trying to get all the items on the same page - currently not working

    var survey1 = {
        type: "survey-html-form",
        questions: [s1q1, s1q2, s1q2text, s1q3, s1q3text, s1q4, s1q5, s1q6]
    };

    // timeline.push(survey1);



    //tutorial and experimental task

    var tutorialInstructions = {
        type: "instructions",
        pages: [
            "In the following tasks you will be presented with a series of different long-duration environmental recordings, or soundscapes. \n They will appear in the space below.",
            "You have three tools you can use to manipulate the soundscape below.\n Click anywhere on audio bar above the soundscape to play the 30sec of audio.\n Try it now. When you are happy that you understand how to use it, click Next.",
            "If you hover your cursor over the soundscape you will see it change to +. You can use this to draw a box anywhere on the soundscape to indicate what you think is interesting using the select tool. \n Try it now. Draw as many boxes as you like. \n They can be any size. They can overlap. You can also click and drag to move them. You can also delete them. \n When you are happy that you understand how to use it, click Continue.",
            "Please hover your cursor over any of the boxes in the soundscape, and right click. \n You should see a small drop down list  pop out from the side. Try selecting one of the options. \n When you are happy that you can do so, please click Continue.",
            "Try using all of the tools you have just learned to find, box and label one example of a bird call. \n When you have done so, click Continue.",
            "You have completed the tutorial. \n  On the next page you will be shown a new soundscape. \n You will need to find one example of each of the sounds listed above it as **quickly** as possible. You will be timed. \n Click Continue if you are ready to begin."
        ],
        cont_btn: "continue"
    };

    var mainExperimentPrompt = {
        type: "instructions",
        pages: [
            "Find, box, & label one example of these 5 things as quickly as possible.  \n",
            "* Bird call \n",
            "* Dawn chorus \n",
            "* Crickets \n",
            "* Airplane \n",
            "* Frogs \n",
            "Click START when you are ready to begin. \n",
            "Click STOP when you have completed the task.",

            "Find, box, & label one example of these 5 things as quickly as possible.  \n",
            "* Bird call \n",
            "* Dawn chorus \n",
            "* Crickets \n",
            "* Airplane \n",
            "* Frogs \n",
            "* Your time has begun \n",
            "Click STOP when you have completed the task."
        ]
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

    var mainExperiment = {
        timeline: [
            debug,
            tutorialAnnotation,
            experimentAnnotation
        ],
        timeline_variables: [
            {
                tuteSite: tuteSite,
                sites: studySite,
                visualizationStyles: visualizationStyle
            }
        ],
        // sample: {
        //     type: "without-replacement",
        //     size: 1
        // }
    };
    timeline.push(mainExperiment);

    //adding a subjectID tied to condition

    var subject_id = jsPsych.randomization.randomID(5);

    jsPsych.data.addProperties({
        subject: subject_id,
        condition: visualizationStyle
    });

    //survey qs - post test - also is not splitting the q's across separate var's
    //going to return them without an indentifier?
    // need to randomise survey2 and survey3 questions each on their own screen


    var survey2 = {
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
        preamble: "For each of the following statements, please indicate how true it is for you, using the following scale:"
    };

    timeline.push(survey2);

    // trying to randomise the survey2 items

    //var IMI = ["I would describe the task as very enjoyable", "Doing the task was fun", "I thought the task was very boring.", "I found the task very interesting.", "I enjoyed doing the task very much.", "While I was working on the task, I was thinking about how much I enjoyed it.", "I thought the task was very interesting."];
    //var randomIMI = jsPsych.randomization.repeat(IMI, 1);

    //.. but then don't know how to integrate with the survey-likert format


    var survey3 = {
        type: "survey-text",
        questions: [
            {
                prompt: "Please tell us what you thought of this task:",
                rows: 5,
                columns: 40
            },
            {
                prompt: "Please tell us what characteristics of the soundscape drew your attention to it:",
                rows: 5,
                columns: 40
            },
            {
                prompt: "Do you have any other thoughts you'd like to share?",
                rows: 5,
                columns: 40
            }]
    };

    timeline.push(survey3);

    var colourblind = {
        type: "survey-multi-choice",
        questions: [
            {
                prompt: "To your knowledge, do you have any kind of colour blindness??",
                options: ["Yes", "No"],
            },
            {
                prompt: "If you answered 'yes', can you provide details?",
                rows: 5,
                columns: 40
            }
        ]

        //button_label_next: true
    };

    //timeline.push(colourblind);

    // contact details

    var survey4 = {
        type: "survey-multi-choice",
        questions: [
            {
                prompt: "Would you like to be informed of the results of our study at a later date?",
                options: ["Yes", "No"]
            },
            {
                prompt: "Would you like to take part in future research conducted by QUT's EcoAcoustics Group?",
                options: ["Yes", "No"]
            },
            {
                prompt: "Would you like to take part in a prize draw to win a AU$100 Amazon voucher? \n If you win, you may choose to nominate that we donate AU$100 to the environmental conservation charity of your choice.",
                options: ["Yes", "No"]
            },
        ],
    };
    timeline.push(survey4);

    var contact = {
        type: "survey-text",
        questions: [
            {
                prompt: " If you checked 'yes', please supply your email address in the space below:",
                rows: 1,
                columns: 40
            }
        ]
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
