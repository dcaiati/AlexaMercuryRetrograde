'use strict';

var Alexa = require("alexa-sdk");
var dateFormat = require('dateformat');

/*
todo
    - add good responses to questions
*/

const NOT_IN_EXPLANATION = "In astrological terms, Mercury is the planet of communication and mechanical stuff. " + 
    "When Mercury goes retrograde, which means it appears to move backwards in the sky, things tend to get all wacky. " +
    "Machines break and people miscommunicate with each other. " + 
    "Mecury Retrograde occurs about 3 times a year and lasts for almost a month each period. " +
    "It's important to remember to approach Mercury's tricks with a light heart, and laugh, and double-check everything you agree to. " +
    "It's good advice regardless of where Mercury is"; 

const IN_ARIES = "Mercury retrograde in aries manifests itself in 2 ways, impulsivity and explosiveness. " +
                 "It is particulary important to take an extra step to think things through before acting. " +
                 "When everyone around you is going crazy and ranting, try to pause for a beat, " + 
                 "remember to laugh, and let as much as you can go before making a calculated action.";

const IN_LEO = "Mercury retrograde in leo can be dramatic. Leo is the star of the show, firery and fixed. " + 
               "During this time, let others play their parts, " + 
               "and you try to keep your cool and enjoy the performance. " + 
               "Leo is fixed, so if you've lost your cool, try to take a step back and wait it out, " +
               "as it is hard to change your course in the moment. " + 
               "Try to grant others the same space.";

const IN_SAG = "Mercury retrograde is sagittarius can be an adventure. " + 
               "Be prepared for some bizarre and mind expanding times. " + 
               "These days will be filled with learnings and explorations. " + 
               "Unfortunately, not everything that happens will be useful. Ride it out. Take notes. " +
               "And, wait for it to be over. Re-evalutate when Mercury goes direct.";

const IN_PISCES = "Mercury retrograde in pisces is a trip. Be prepared to get lost in day dreams " +
                  "only to realize you've committed yourself to something you didn't know about. " + 
                  "Also, Pisces is empathic, and with Mercury as the planet of communication, " +
                  "you may find yourself feeling psychic. Although, during the retrograde, "
                  "there's a good probability you got something wrong, so tread lightly"; 

const IN_SCORPIO = "Mercury retrograde in scorpio can drive you to drink. " + 
                   "Powerful Scorpio can be suspicious, righteous and demanding of the truth. " + 
                   "With mischevous Mercury making everything fuzzy, make sure you got the details right, " +
                   "before launching an assault on an ususpecting friend. "; 

const IN_CANCER = "Mercury retrograde in cancer is a wonderful time to put your foot in your mouth. " +
                  "Cancers can be emotional and easily hurt, so try extra hard to be kind. " +
                  "Cancer's nature is to take care of others, and that includes yourself. " +
                  "Use the time to look within and find ways to nurture yourself without judgement."; 

const mDates = [
        {dateIn:"20180322", dateOut:"20180415",sign:"Aries",explain:IN_ARIES},
        {dateIn:"20180726", dateOut:"20180818",sign:"Leo",explain:IN_LEO},
        {dateIn:"20181116", dateOut:"20181206",sign:"Sagittarius",explain:IN_SAG},
        {dateIn:"20190305", dateOut:"20190328",sign:"Pisces",explain:IN_PISCES},
        {dateIn:"20190707", dateOut:"20190731",sign:"Leo",explain:IN_LEO},
        {dateIn:"20191031", dateOut:"20191120",sign:"Scorpio",explain:IN_SCORPIO},
        {dateIn:"20200218", dateOut:"20200309",sign:"Pisces",explain:IN_PISCES},
        {dateIn:"20200617", dateOut:"20200712",sign:"Cancer",explain:IN_CANCER},
        {dateIn:"20201013", dateOut:"20201103",sign:"Scorpio",explain:IN_PISCES}
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

        // get date to find retrograde state 
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        var today = year+month+day;
        // TESTS
        //today = 20180501; // out
        //today = 20181101; // out
        //today = 20190101; // out
        //today = 20190601; // out
        //today = 20190901; // out
        //today = 20200101; // out
        //today = 20200501; // out
        //today = 20200901; // out

        //today = 20180801; // in
        //today = 20181201; // in
        //today = 20190315; // in
        //today = 20190715; // in
        //today = 20191101; // in
        //today = 20200301; // in
        //today = 20200701; // in
        //today = 20201101; // in
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
        var cOutput;

        if (found) {

            this.attributes['explain'] = mDates[entry].explain;
          console.log(mDates[entry].dateOut);
          console.log(mDates[entry].dateOut.substring(0,4)); 
          console.log(mDates[entry].dateOut.substring(4,6)); 
          console.log(mDates[entry].dateOut.substring(6)); 

            // make pretty date
            var dateOut =  mDates[entry].dateOut.substring(0,4) + "-" +
                           mDates[entry].dateOut.substring(4,6) + "-" +
                           mDates[entry].dateOut.substring(6);

            mOutput = 'Mercury is in Retrograde. It went retrograde in the sign of ' +
                       mDates[entry].sign + 
                       '. It will leave on ' + 
                       dateFormat(new Date(dateOut),"fullDate");
          
            cOutput = mOutput;
                        
        } else {

            // make pretty date
            var dateIn =  mDates[entry].dateIn.substring(0,4) + "-" +
                          mDates[entry].dateIn.substring(4,6) + "-" +
                          mDates[entry].dateIn.substring(6);
            mOutput = 'Mercury is not in retrograde. It will enter retrograde on ' +
                      dateFormat(new Date(dateIn),"fullDate") +
                      ' in the sign of ' +
                      mDates[entry].sign; 

            cOutput = mOutput;
        }

        mOutput = mOutput + ". Would you like to hear more?";

        this.emit(':askWithCard', mOutput, "Yes or No", "Mercury Retrograde", cOutput, null);
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
