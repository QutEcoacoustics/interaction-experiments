/*global experimentInit*/
(function() {

    function endExperiment(data) {
        console.log(data.json());

        jsPsych.data.displayData();
    }

    function startExperiment() {
        // Handler when the DOM is fully loaded
        if (window.hasOwnProperty("experimentInit")) {
            var configuration = experimentInit();

            configuration = Object.assign({}, configuration, {
                display_element: "experimentBody",
                on_finish: endExperiment
            });

            jsPsych.init(configuration);
        }
        else {
            console.warn("experiment.js not found (probably because you are not on an experiment page) and was not invoked");
        }
    }

    if (
        document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll)
    ) {
        startExperiment();
    } else {
        document.addEventListener("DOMContentLoaded", startExperiment);
    }
})();
