/*global experimentInit*/
(function() {
    // fetch polyfill should be included in this bundle
    // these values are templated by JSPsych
    const buildDate = "{{ hugo.BuildDate }}";
    const buildCommit = "{{ hugo.CommitHash }}";
    const submitUrl  = "/.netlify/functions/submitExperiment";

    var prepareDataForSubmit = null;
    var experimentName = null;

    function submitData() {
        var data = Object.assign(
            prepareDataForSubmit(),
            {
                buildCommit: buildCommit,
                buildDate: buildDate,
                experimentName: experimentName
            });

        console.log("Saving data to server", data);

        fetch(
            submitUrl + "?experimentName=" + experimentName,
            {
                method: "post",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => console.log("data submitted, response: ", response))
            .catch(error => console.error(error));
    }

    function endExperiment(userFunction, data) {
        console.log(data.json());

        submitData();

        if (userFunction) {
            return userFunction.call(this, Array.prototype.slice.call(arguments, 1));
        }
    }

    function onTrialFinish(userFunction, data) {
        if (userFunction) {
            return userFunction.call(this, Array.prototype.slice.call(arguments, 1));
        }

        if (data.submitExperimentData === true) {
            submitData();
        }
    }

    let skipToTrial = jsPsych.data.getURLVariable("skip");
    function onTrialStart(userFunction) {
        if (userFunction) {
            return userFunction.call(this, Array.prototype.slice.call(arguments, 1));
        }

        if (skipToTrial) {
            var currentTrial = jsPsych.currentTimelineNodeID();
            if (skipToTrial !== currentTrial) {
                console.warn(`Debug skipping trial ${currentTrial} because trial id is not ${skipToTrial}`);
                jsPsych.finishTrial({ skipped: true });
            }
            else {
                // reset
                skipToTrial = null;
            }
        }
        else {
            console.log("Current trial is", jsPsych.currentTimelineNodeID());
        }
    }

    function startExperiment() {
        // Handler when the DOM is fully loaded
        if (window.hasOwnProperty("experimentInit")) {
            var configuration = experimentInit();

            if (!configuration.hasOwnProperty("prepareDataForSubmit")) {
                throw "Experiment not set up correctly, missing prepareDataForSubmit function";
            }
            prepareDataForSubmit = configuration.prepareDataForSubmit;
            delete configuration.prepareDataForSubmit;

            if (!configuration.hasOwnProperty("experimentName")) {
                throw "Experiment not set up correctly, missing experimentName field";
            }
            experimentName = configuration.experimentName;
            delete configuration.experimentName;

            configuration = Object.assign({}, configuration, {
                display_element: "experimentBody",
                on_finish: endExperiment.bind(null, configuration.on_finish),
                on_trial_start: onTrialStart.bind(null, configuration.on_trial_start),
                on_trial_finish: onTrialFinish.bind(null, configuration.on_trial_finish)
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
