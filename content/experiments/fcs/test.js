/* don't know where this fits or how to randomise between groups*/
<html>
  <head>
    <title>My experiment</title>
    <script src="jspsych-6.0.5/jspsych.js"></script>
    <script src="jspsych-6.0.5/plugins/jspsych-html-keyboard-response.js"></script>
    <script src="jspsych-6.0.5/plugins/jspsych-image-keyboard-response.js"></script>
    <link href="jspsych-6.0.5/css/jspsych.css" rel="stylesheet" type="text/css"></link>
  </head>
  <body></body>
  <script>

 






  
var wav = ["Inala_24hrs_wav.PNG", "Sheryn_waveform.PNG"]

var grey = ["Inala_24hrs_grey.PNG", "Sheryn greyscale.PNG"]

var fcs = ["Inala_24hrs__ACI-ENT-EVN.png","FCS_Sheryn.PNG"]

var aud = ["blueblock.png", "blueblock.png"]

//timeline

    var timeline = [];

var subject_id = jsPsych.randomization.randomID(5);
var condition_assignment = jsPsych.randomization.sampleWithoutReplacement(['condition_wav', 'condition_gery', 'condition_fcs', 'condition_aud'], 1)[0];

jsPsych.data.addProperties({
  subject: subject_id,
  condition: condition_assignment
});

    var welcome = {
        type: "external-html",
        url: "welcome/index.html",
        cont_btn: "Next"
    };
    timeline.push(welcome);

    var ethics = {
        type: "external-html",
        url: "ethics/index.html",
        cont_btn: "Next"
    };
    timeline.push(ethics);

    var survey1 = { 
        type: "external-html",
        url: "introQs/index.html",
        cont_btn: "Next"

            
timeline.push({
    type: 'fullscreen',
    fullscreen_mode: true
  });
  
  timeline.push({
    type: 'html-keyboard-response',
    stimulus: 'This experiment will be in fullscreen mode unless you are using Safari.'
  });
        
    timeline.push(survey1);

    var tutorial = {
        type:'instructions',
        pages: [
            'In the following tasks you will be presented with a series of different long-duration environmental recordings, or soundscapes. \n They will appear in the space below.',
            'You have three tools you can use to manipulate the soundscape below.\n Click anywhere on audio bar above the soundscape to play the 30sec of audio.\n Try it now. When you are happy that you understand how to use it, click Next.',
            'If you hover your cursor over the soundscape you will see it change to +. You can use this to draw a box anywhere on the soundscape to indicate what you think is interesting using the select tool. \n Try it now. Draw as many boxes as you like. \n They can be any size. They can overlap. You can also click and drag to move them. You can also delete them. \n When you are happy that you understand how to use it, click Next.',
            'Please hover your cursor over any of the boxes in the soundscape, and right click. \n You should see a small drop down list  pop out from the side. Try selecting one of the options. \n When you are happy that you can do so, please click Next.',
            'Try using all of the tools you have just learned to find, box and label one example of a bird call. \n When you have done so, click Next.',
            'You have completed the tutorial. \n  On the next page you will be shown a new soundscape. \n You will need to find one example of each of the sounds listed above it as **quickly** as possible. You will be timed. \n Click Next if you are ready to begin.'.
     ],

        show_clickable_nav: true
        stimulus: 'Inala_24hrs_wav.PNG', 'Inala_24hrs_grey.PNG', 'Inala_24hrs__ACI-ENT-EVN.png', 'blueblock.png',
        cont_btn: 'Next'
    /* not all this stimulus - should choose image depending on group assigned */

    timeline.push(tutorial);

    var task = {
        type: 'instructions',
        pages: [
            'Find, box, & label one example of these 5 things as quickly as possible. They may not all be present in the soundscape. \n
            * Bird call \n
            * Dawn chorus \n
            * Crickets \n
            * Airplane \n
            * Frogs \n
            Click START when you are ready to begin. \n
            Click NEXT to end the timer.'
            <img></img> ,
            'Find, box, & label one example of these 5 things as quickly as possible. They may not all be present in the soundscape. \n
            * Bird call \n
            * Dawn chorus \n
            * Crickets \n
            * Airplane \n
            * Frogs \n
            * Your time has begun \n
            Click NEXT to end the timer.'
            <img></img> .
        ]
        /* not this stimulus - should choose image depending on group assigned */
            stimulus: 'Sheryn_waveform.PNG', 'Sheryn greyscale.PNG', 'FCS_Sheryn.PNG','blueblock.png',
            cont_btn: 'Next'
       
        timeline.push(task);

        var survey2 = { 
            type: 'external-html',
            url: 'lastQs/index.html',
            cont_btn: 'Next'
            
        timeline.push(survey2);
        
        var survey3 = { 
            type: 'external-html',
            url: 'Contact/index.html',
            cont_btn: 'Next'
            
        timeline.push(survey3);
]
    return {
        timeline: timeline,
        jsPsych.startTime
        jsPsych.totalTime
    };
}

  /* start the experiment */
      
jsPsych.init({
    timeline: timelineAssigned,
    show_progress_bar: true,
    on_finish: function() {
      jsPsych.data.displayData();
	  jsPsych.data.localSave('mydata.csv','csv')
    }
  });

</script>
</html>