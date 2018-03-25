'use strict';

var Alexa = require("alexa-sdk");

/*
todo
    1. add card
    2. add question 'do you want more information'
    3. add good responses to questions
    4. get responses from S3 
    5. make responses audio files
*/

const NOT_IN_EXPLANATION = "In astrological terms, Mercury is the planet of communication and mechanical stuff. " + 
    "When Mercury goes retrograde, which means it appears to move backwards in the sky, things tend to get all wacky. " +
    "Machines break and people miscommunicate with each other. " + 
    "Mecury Retrograde occurs about 3 times a year and lasts for almost a month each period. " +
    "It's important to remember to approach Mercury's tricks with a light heart, and laugh, and double-check everything you agree to. " +
    "It's good advice regardless of where Mercury is"; 

const IN_ARIES = "aries";
const IN_LEO = "leo"; 
const IN_SAG = "sag"; 
const IN_PISCES = "pisces"; 
const IN_SCORPIO = "scorpio"; 
const IN_CANCER = "cancer"; 


const mDates = [
        {dateIn:"20180322", dateOut:"20180415",start:"Aries",explain:IN_ARIES},
        {dateIn:"20180726", dateOut:"20180818",start:"Leo",explain:IN_LEO},
        {dateIn:"20181116", dateOut:"20181206",start:"Sagittarius",explain:IN_SAG},
        {dateIn:"20190305", dateOut:"20190328",start:"Pisces",explain:IN_PISCES},
        {dateIn:"20190707", dateOut:"20190731",start:"Leo",explain:IN_LEO},
        {dateIn:"20191031", dateOut:"20191120",start:"Scorpio",explain:IN_SCORPIO},
        {dateIn:"20200218", dateOut:"20200309",start:"Pisces",explain:IN_PISCES},
        {dateIn:"20200617", dateOut:"20200712",start:"Cancer",explain:IN_CANCER},
        {dateIn:"20201013", dateOut:"20201103",start:"Scorpio",explain:IN_PISCES}
];



exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.attributes['explain'] = NOT_IN_EXPLANATION;
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

        var today = year+month+day;
        //var today = 20200101; // test

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

            this.attributes['explain'] = mDates[entry].explain;

                        
        } else {
            mOutput = 'Mercury is not in retrograde. It will enter retrograde on ' +
                      '<say-as interpret-as="date">' +
                      mDates[entry].dateIn + 
                      '</say-as>' + 
                      ' in the sign of ' +
                      mDates[entry].start; 
        }

        mOutput = mOutput + ". Would you like to hear more?";

        //this.response.speak(mOutput);

        //this.emit(':tell', mOutput);
        this.emit(':ask', mOutput, "Yes or No");
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
    'AMAZON.YesIntent' : function() {
        this.response.speak(this.attributes['explain']);
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent' : function() {
        this.response.speak('Go with lightness and peace');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, hello world'" +
            " or 'alexa, ask hello world my name is awesome Aaron'");
    }
};
