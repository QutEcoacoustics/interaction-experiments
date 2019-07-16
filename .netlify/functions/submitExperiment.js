const fetch = require('node-fetch');
exports.handler = async function (event, context) {

    try {
        if (event.httpMethod !== "POST") {
            throw "This end point only supports POST requests";
        }

        let queryStrings = event.queryStringParameters;
        let experimentName = queryStrings["experimentName"];
        let experimentType = experimentName.replace(/[^a-z0-9_]/gi, '').toUpperCase();

        // augment body with IP address and user agent
        let body = JSON.parse(event.body);

        // ip address *should* be supported
        // https://community.netlify.com/t/include-request-ip-address-on-event-object/1820
        body.ip = event && event['headers'] && event['headers']['client-ip'] || "<not available>";
        body.userAgent = event && event['headers'] && event['headers']['user-agent'];
        let bodyPayload = JSON.stringify(body);

        // send results to post url
        let url = process.env["SUBMIT_URL_" + experimentType];
        console.log("Uploading experiment results to", url);

        const postSubmit = fetch(
            url,
            {
                method: "post",
                body: bodyPayload,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "application/json"
                }
            });

        // send results via email as well because I am paranoid
        let email = process.env["BACKUP_EMAIL"];
        let auth = process.env["BACKUP_EMAIL_AUTH"];
        let emailBody = JSON.stringify({
            personalizations: [
                {
                    to: [
                        {
                            email: email
                        }
                    ],
                    subject: "[Interaction Experiments][Data Submission] " + experimentName
                }
            ],
            from: {
                email: email
            },
            content: [
                {
                    type: "text/plain",
                    value: `An '${experimentName}' experiment was completed. The results are attached.`
                }
            ],
            attachments: [
                {
                    content: Buffer.from(bodyPayload).toString('base64'),
                    type: "application/json",
                    filename: experimentName + "_result_" + Date.now().toString() + ".json",
                    disposition: "attachment"
                }
            ]

        });

        const emailSubmit = fetch(
            "https://api.sendgrid.com/v3/mail/send",
            {
                method: "post",
                body: emailBody,
                headers: {
                    Authorization: "Bearer " + auth,
                    'Content-Type': 'application/json',
                    Accept: "application/json"
                }
            });

        // await responses
        const [response, emailResponse] = await Promise.all([postSubmit, emailSubmit]);

        if (!response.ok || !emailResponse.ok) {
            // NOT res.status >= 200 && res.status < 300
            if (!emailResponse.ok) {
                console.error(`Email failed ${emailResponse.status}`);
            }

            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Upstream request failed",
                    submit: {
                        code: response.status,
                        text: response.statusText
                    },
                    email: {
                        code: emailResponse.status,
                        text: emailResponse.statusText
                    }
                })
            };
        }
        const data = await response.text();

        return {
            statusCode: response.status,
            body: data
        };
    } catch (err) {
        console.log(err); // output to netlify function log
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
        }
    }



}
