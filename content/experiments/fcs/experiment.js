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

    var instructions = {
        type: "instructions",
        pages: [
            "Welcome to the experiment. Click next to begin.",
            "This is the second page of instructions.",
            "This is the final page."
        ],
        show_clickable_nav: true
    };
    timeline.push(instructions);



    return {
        timeline: timeline,
    };
}
  