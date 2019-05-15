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
    //images are updated - needs correct audio
    var visualizationStyles = ["fcs", "spectrogram", "waveform", "audioOnly"];
    var sites = [
        {
            name: "Liz Tasmania",
            images: {
                fcs: "./images/FCS_Liz.PNG",
                spectrogram: "./images/greyscale_Liz.PNG",
                waveform: "./images/wavform_Liz.png",
                audioOnly: "blueblock.png"
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/audio-image-audio.wav"
        },
        {
            name: "Sheryn",
            images: {
                fcs: "./images/FCS_Sheryn.PNG",
                spectrogram: "./images/greyscale_Sheryn.PNG",
                waveform: "./images/waveform_Sheryn.PNG",
                audioOnly: "blueblock.png"
            },
            audio: "https://s3-ap-southeast-2.amazonaws.com/interaction-experiments/audio-image-audio.wav"
        },
        {
            name: "Inala",
            images: {
                fcs: "./images/FCS_Inala.png",
                spectrogram: "./images/greyscale_Inala.PNG",
                waveform: "./images/waveform.Inala.PNG",
                audioOnly: "blueblock.png"
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
        button_label_next:true
    };
    timeline.push(welcome);

    var ethics = {
        type: "external-html",
        url: "ethics/index.html",
        cont_btn: "consentNext",
    };
    timeline.push(ethics);

    timeline.push(
        {
            type: 'fullscreen',
            fullscreen_mode: true
          });
          
    timeline.push(
          {
            type: 'html-keyboard-response',
            stimulus: 'This experiment will be in fullscreen mode unless you are using Safari.'
          });

   
    //survey qs pre-test

    var scale1 = ["1. Not at all knowledgeable", "2.", "3.", "4.", "5. Very knowledgeable"];
    var scale2 = ["1. Not at all experienced", "2.", "3.", "4.", "5. Very experienced"];

    var s1q1 = {
        type: "survey-text",
        questions: {prompt: "What is your age?", rows:1, columns:5};

    var s1q2 = {
        type: 'survey-multi-choice',
        questions: {prompt: "what is your gender?", options: "Male", "Female", "Please list"};
   
    vars1q2text = {
        type: "survey-text",
        questions: {prompt: "if you indicated 'not listed', please state:", rows:1, columns:40};
    
    var s1q3 = {
        type: 'survey-multi-choice',
        questions: {prompt: "What is your interest in ecology?", options: "Casual interest", "Professional interest", "No interest"};
  
    var s1q3text =  {
        type: "survey-text",
        questions: {prompt: "If you answered casual or professional interest, can you tell us more about it here?", rows:5, columns:40}; 
  
    var s1q5 = {
        type: 'survey-likert',
        questions: {prompt: "How knowledgeable are you about any kind of soundscape ecology, ecoacoustics, or bioacoustics?", labels: scale1};

    var s1q6 = {
        type: 'survey-likert',
        questions: {prompt: "How experience are you with using environmental recordings?", labels: scale2};
    
    var s1q7 = {
        type: 'survey-likert',
        questions: {prompt: "How experience are you with using any kind of acoustic visualisation? (e.g. waveforms, spectrograms)", labels: scale2};
    
    // a yes response to the folowing Q would pipe this participant to 
    // the grey scale or audio-only condition)
    var s1q8 = {
        type: 'survey-multi-choice',
        questions:[{prompt: "To your knowledge, do you have any kind of colour blindness?", options: "Yes", "No"}],
    };

    var survey1 = {
// how do I collate the above q's on the one page in this order?
    }

    timeline.push(survey1);

//tutorial and experimental task

    var tasks1 = {
        type:'instructions',
        pages: [
            'In the following tasks you will be presented with a series of different long-duration environmental recordings, or soundscapes. \n They will appear in the space below.',
            'You have three tools you can use to manipulate the soundscape below.\n Click anywhere on audio bar above the soundscape to play the 30sec of audio.\n Try it now. When you are happy that you understand how to use it, click Next.',
            'If you hover your cursor over the soundscape you will see it change to +. You can use this to draw a box anywhere on the soundscape to indicate what you think is interesting using the select tool. \n Try it now. Draw as many boxes as you like. \n They can be any size. They can overlap. You can also click and drag to move them. You can also delete them. \n When you are happy that you understand how to use it, click Next.',
            'Please hover your cursor over any of the boxes in the soundscape, and right click. \n You should see a small drop down list  pop out from the side. Try selecting one of the options. \n When you are happy that you can do so, please click Next.',
            'Try using all of the tools you have just learned to find, box and label one example of a bird call. \n When you have done so, click Next.',
            'You have completed the tutorial. \n  On the next page you will be shown a new soundscape. \n You will need to find one example of each of the sounds listed above it as **quickly** as possible. You will be timed. \n Click Next if you are ready to begin.'.
        ],
        show_clickable_nav: true,
    };

    var tasks2 = {
        type: 'instructions',
        pages: [
            'Find, box, & label one example of these 5 things as quickly as possible. They may not all be present in the soundscape. \n
            * Bird call \n
            * Dawn chorus \n
            * Crickets \n
            * Airplane \n
            * Frogs \n
            Click START when you are ready to begin. \n
            Click NEXT to end the timer.',

            'Find, box, & label one example of these 5 things as quickly as possible. They may not all be present in the soundscape. \n
            * Bird call \n
            * Dawn chorus \n
            * Crickets \n
            * Airplane \n
            * Frogs \n
            * Your time has begun \n
            Click NEXT to end the timer.'],
        button_label_next:true
          };
     

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

//K's notes: added in var for tutel as it will make use of the Inala 
//site and mainExperiment, Sheryn's site.
//Q: if tute and mainExperiment both randomise visualizationStyles 
//does this mean they may not show the same type of image? 

    var tute = {
        timeline: [
            debug,
            instructions, //tasks1
            audioImage,
        ],
        timeline_variables: jsPsych.randomization.factorial({
            sites: Inala
            visualizationStyles: visualizationStyles
        }, 1, false),
        sample: {
            type: "without-replacement",
            size: 1
        }  
    };
    timeline.push{tute} 

//Or can the sites be linked to a set of instructions and the visualisationStyle kept constant in one variable?

    var mainExperiment = {
        timeline: [
            debug,
            instructions, //tasks2
            audioImage,
        ],
        timeline_variables: jsPsych.randomization.factorial({
            sites: Sheryn
            visualizationStyles: visualizationStyles
        }, 1, false),
        sample: {
            type: "without-replacement",
            size: 1
        }
    };
    timeline.push(mainExperiment);
    
    //survey qs - post test - also is not splitting the q's across separate var's
    //going to return them without an indentifier?

    var survey2 = {
        type: 'survey-text',
        questions: [{prompt: "Please tell us what you thought of this task:", rows: 5, columns: 40},
                    {prompt: "Please tell us what characteristics of the soundscape drew your attention to it:", rows: 5, columns: 40},
                    {prompt: "Do you have any other thoughts you'd like to share?", rows: 5, columns: 40}],
        button_label_next:true
      };
        
    timeline.push(survey2);
    
// contact details 

    var survey3 = { 
        type: 'survey-multi-choice',
        questions: [{prompt: "Would you like to be informed of the results of our study at a later date?", options: "Yes", "No"},
                    {prompt: "Would you like to take part in future research conducted by QUT's EcoAcoustics Group?", options: "Yes", "No"
                    {prompt: "Would you like to take part in a prize draw to win a AU$100 Amazon voucher? If you win, you may choose to nominate that we donate AU$100 to the environmental conservation charity of your choice.", options: "Yes", "No"}
          
    };
    timeline.push(survey3);

// need to have contact details collected only if 'yes' is checked at least once in survey3
   
var contact = {
        type: 'survey-text'
        questions: {prompt: " Please supply your email address:", rows: 1, columns: 40}
    }
        button_label_next:true
      };
        
      timeline.push(contact)

    var end = {
      type:'instructions',
      pages: [
        'Thank you for taking part in our experiment.'
      ]
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
