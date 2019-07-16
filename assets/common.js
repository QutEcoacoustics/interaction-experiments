/*global experimentInit*/
/*global $*/
(function() {
    // fetch polyfill should be included in this bundle
    // these values are templated by JSPsych
    const buildDate = "{{ now.Format `2006-01-02T15:04:05-07:00` }}";
    const buildCommit = "{{ getenv `COMMIT_REF` }}";
    const submitUrl  = "/.netlify/functions/submitExperiment";

    var prepareDataForSubmit = null;
    var experimentName = null;
    var experimentStartDate = null;
    var experimentStartUtcOffset = null;

    function warnIfLeaving(e) {
        if (window.LiveReload && window.LiveReload.isReloading)  {
            return;
        }

        // Cancel the event
        e.preventDefault();

        // Chrome requires returnValue to be set even though the message is not
        // passed onto the user
        e.returnValue = "Navigating away will stop the experiment";
    }

    var getTimeStamp = Date.now;

    function alert(target, level, message) {
        const alert = `<div class="alert alert-${level} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>`;

        // remove old messages
        var old = $(".alert");
        if (old.length > 0) {
            old.one("closed.bs.alert", function() {
                target.firstChild.innerHTML += alert;
            });
            old.alert("close");
        }
        else {
            // add new one
            target.firstChild.innerHTML += alert;
        }
    }

    function submitData() {
        var data = Object.assign(
            prepareDataForSubmit(),
            {
                buildCommit: buildCommit,
                buildDate: buildDate,
                experimentName: experimentName,
                experimentStartTimeStamp: experimentStartDate,
                experimentStartUtcOffset: experimentStartUtcOffset,
                submitTimeStamp: getTimeStamp(),
                submitUtcOffset: (new Date()).getTimezoneOffset()
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

    function endExperiment(userFunction/*, data*/) {
        experimentEndDate = getTimeStamp();
        submitData();

        window.removeEventListener("beforeunload", warnIfLeaving);

        if (userFunction) {
            return userFunction.call(this, Array.prototype.slice.call(arguments, 1));
        }
    }

    function onInteractionDataUpdate(userFunction, data) {
        data.timeStamp = getTimeStamp();
        if (userFunction) {
            return userFunction.call(this, Array.prototype.slice.call(arguments, 1));
        }
    }

    function onTrialFinish(userFunction, data) {
        data.finishTimeStamp = getTimeStamp();
        if (userFunction) {
            return userFunction.call(this, Array.prototype.slice.call(arguments, 1));
        }

        if (data.submitExperimentData === true) {
            submitData();
        }
    }

    function onTrialStart(userFunction, trial) {
        // if data was a function, it has been evaluated already
        trial.data = trial.data || {};
        trial.data.startTimeStamp = getTimeStamp();
        if (userFunction) {
            return userFunction.call(this, Array.prototype.slice.call(arguments, 1));
        }
    }

    function startExperiment() {
        // Handler when the DOM is fully loaded
        if (window.hasOwnProperty("experimentInit")) {
            var configuration = experimentInit(alert, getTimeStamp);

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
                on_trial_finish: onTrialFinish.bind(null, configuration.on_trial_finish),
                on_interaction_data_update: onInteractionDataUpdate.bind(null, configuration.on_interaction_data_update)
            });

            jsPsych.init(configuration);
            experimentStartDate = getTimeStamp();
            experimentStartUtcOffset = (new Date()).getTimezoneOffset();

            // stop accidental navigation
            if (window.LiveReload) {
                var original = window.LiveReload.performReload;
                window.LiveReload.performReload = function() {
                    window.LiveReload.isReloading = true;
                    original.apply(window.LiveReload, Array.from(arguments));
                };
            }
            window.addEventListener("beforeunload", warnIfLeaving);
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
