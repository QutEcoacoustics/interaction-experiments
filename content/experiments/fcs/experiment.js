// test
export function experimentInit() {
    var timeline = [];


    timeline.push({
        type: "html-keyboard-response",
        stimulus: "Welcome to the experiment. Press any key to begin"
    })

    jsPsych.init({
        timeline: [hello_trial],
        display_element: 'experimentBody'
    });
}