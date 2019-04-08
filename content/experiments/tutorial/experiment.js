// test
/* exported experimentInit */
function experimentInit() {
    var timeline = [];


    timeline.push({
        type: "html-keyboard-response",
        stimulus: "Welcome to the experiment. Press any key to begin"
    });

    var instructions = {
        type: "html-keyboard-response",
        stimulus: "<p>In this experiment, a circle will appear in the center " +
            "of the screen.</p><p>If the circle is <strong>blue</strong>, " +
            "press the letter F on the keyboard as fast as you can.</p>" +
            "<p>If the circle is <strong>orange</strong>, press the letter J " +
            "as fast as you can.</p>" +
            "<div style='width: 700px;'>"+
            "<div style='float: left;'><img src='blue.png'></img>" +
            "<p class='small'><strong>Press the F key</strong></p></div>" +
            "<div class='float: right;'><img src='orange.png'></img>" +
            "<p class='small'><strong>Press the J key</strong></p></div>" +
            "</div>"+
            "<p>Press any key to begin.</p>"
    };
    timeline.push(instructions);

    var test_stimuli = [
        { stimulus: "blue.png", data: {test_part: "test", correct_response: "f"}},
        { stimulus: "orange.png", data: {test_part: "test", correct_response: "j"}}
    ];

    var fixation = {
        type: "html-keyboard-response",
        stimulus: "<div style=\"font-size:60px;\">+</div>",
        choices: jsPsych.NO_KEYS,
        trial_duration: function() {
            return jsPsych.randomization.sampleWithoutReplacement([250, 500], 1)[0];
        }, 
        data: {test_part: "fixation"}
    }; 

    var test = {
        type: "image-keyboard-response",
        stimulus: jsPsych.timelineVariable("stimulus"),
        choices: ["f", "j"],
        data: jsPsych.timelineVariable("data"),
        on_finish: function(data) {
            data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
        }
    };

    var test_procedure = {
        timeline: [fixation, test],
        timeline_variables: test_stimuli,
        randomize_order: true,
        repetitions: 2
    };
    timeline.push(test_procedure);

    var debrief_block = {
        type: "html-keyboard-response",
        stimulus: function() {
    
            var trials = jsPsych.data.get().filter({test_part: "test"});
            var correct_trials = trials.filter({correct: true});
            var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
            var rt = Math.round(correct_trials.select("rt").mean());
    
            return "<p>You responded correctly on "+accuracy+"% of the trials.</p>"+
              "<p>Your average response time was "+rt+"ms.</p>"+
              "<p>Press any key to complete the experiment. Thank you!</p>";
    
        }
    };
    
    timeline.push(debrief_block);


    return {
        timeline: timeline,
    };

}
  