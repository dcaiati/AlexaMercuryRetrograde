'use strict';
var Alexa = require("alexa-sdk");

const mDates = [
        {dateIn:"20180322", dateOut:"20180415",start:"Aries"},
        {dateIn:"20180726", dateOut:"20180818",start:"Leo"},
        {dateIn:"20181116", dateOut:"20181206",start:"Sagittarius"},
        {dateIn:"20190305", dateOut:"20190328",start:"Pisces"},
        {dateIn:"20190707", dateOut:"20190731",start:"Leo"},
        {dateIn:"20191031", dateOut:"20191120",start:"Scorpio"},
        {dateIn:"20200218", dateOut:"20200309",start:"Pisces"},
        {dateIn:"20200617", dateOut:"20200712",start:"Cancer"},
        {dateIn:"20201013", dateOut:"20201103",start:"Scorpio"},
];


// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build


exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('MercuryRetrogradeIntent');
    },
    'MercuryRetrogradeIntent': function () {

        // get today's date
        var date = new Date();

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        //var today = year+month+day;
        var today = 20200101;
        var found = false;
        var entry = 0;

        for (var i=0; i<mDates.length; i++) {
            entry = i;
            if (today >= mDates[i].dateOut) {
                // look for next one
            } else {
                if (today >= mDates[i].dateIn) {
                // found it
                    found = true;
                    break;
                } else {
                    // this is next one
                    break;
                }
            }
        }

        var mOutput;

        if (found) {
            // play 
            mOutput = 'Mercury is in Retrograde. It went retrograde in the sign of ' +
                       mDates[entry].start + '. It will leave on ' + 
                       '<say-as interpret-as="date">' +
                       mDates[entry].dateOut +
                        '</say-as>';

                        
        } else {
            mOutput = 'Mercury is not in retrograde. It will enter retrograde on ' +
                      '<say-as interpret-as="date">' +
                      mDates[entry].dateIn + 
                      '</say-as>' + 
                      ' in the sign of ' +
                      mDates[entry].start; 
        }
        
        console.log(mOutput);

        var speechOutput = {
            type: "SSML",
            ssml: mOutput
        };


        this.response.speak(mOutput);
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, hello world' or 'alexa, ask hello world my" +
            " name is awesome Aaron'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, hello world'" +
            " or 'alexa, ask hello world my name is awesome Aaron'");
    }
};
