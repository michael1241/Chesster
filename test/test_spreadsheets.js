var assert = require('chai').assert;
var moment = require("moment");
var spreadsheets = require('../spreadsheets');

var ISO_TUESDAY = 2;

describe('scheduling', function() {
    //--------------------------------------------------------------------------
    describe('#get_round_extrema()', function () {
        it(".isoWeekday() of the bounds should always return 2", function() {
            var bounds = spreadsheets.get_round_extrema();
            assert.equal(ISO_TUESDAY, bounds[0].isoWeekday());
            assert.equal(ISO_TUESDAY, bounds[1].isoWeekday());
        });
        it("The bounds containing 2016-04-15 are 2016-04-12T00:00:00 and 2016-04-19T:00:00:00 ", function() {
            var bounds = spreadsheets.get_round_extrema({
                reference_date: moment.utc("2016-04-15")
            });
            start = bounds[0];
            end = bounds[1];
            assert.equal(start.format(), "2016-04-12T00:00:00+00:00")
            assert.equal(end.format(), "2016-04-19T00:00:00+00:00")
        });
        it("The bounds containing 2016-04-15 but offset by an hour are 2016-04-11T23:00:00 and 2016-04-18T:23:00:00 ", function() {
            var bounds = spreadsheets.get_round_extrema({
                reference_date: moment.utc("2016-04-15"),
                offset_hours: 1
            });
            start = bounds[0];
            end = bounds[1];
            assert.equal(start.format(), "2016-04-11T23:00:00+00:00")
            assert.equal(end.format(), "2016-04-18T23:00:00+00:00")
        });
    });
    //--------------------------------------------------------------------------
    describe('#parse_scheduling()', function () {
        it("Test team-scheduling messages", function() {
            var options = {
                reference_date: moment.utc("2016-04-15")
            };
            // TODO: put a bunch of the team scheduling message in here.
        });
        it("Test lonewolf-scheduling messages", function() {
            var options = {
                reference_date: moment.utc("2016-04-15"),
                offset_hours: 1
            };
            function test_parse_scheduling(string, expected)  {
                var results = spreadsheets.parse_scheduling(string, options);
                assert.equal(results.date.format(), expected.date);
                assert.equal(results.white, expected.white);
                assert.equal(results.black, expected.black);
            }
            test_parse_scheduling(
                "@autotelic v @explodingllama 4/16 @ 0900 GMT", {
                    white: "autotelic",
                    black: "explodingllama",
                    date: "2016-04-16T09:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@ronaldulyssesswanson – @esolcneveton rescheduled to Sunday, April 17th at 14:00 GMT.",
                {
                    white: "ronaldulyssesswanson",
                    black: "esolcneveton",
                    date: "2016-04-17T14:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@adrianchessnow:  v @mydogeatslemons: 4/15 2300 GMT",
                {
                    white: "adrianchessnow",
                    black: "mydogeatslemons",
                    date: "2016-04-15T23:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@juansnow v @jimcube27 4/17 @ 1030 GMT",
                {
                    white: "juansnow",
                    black: "jimcube27",
                    date: "2016-04-17T10:30:00+00:00"
                }
            );
            test_parse_scheduling(
                "@mrrobot v @ashkanjah 4/16 @ 1400 GMT",
                {
                    white: "mrrobot",
                    black: "ashkanjah",
                    date: "2016-04-16T14:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@ronaldulyssesswanson – @esolcneveton on Saturday, April 16th at 14:00 GMT.",
                {
                    white: "ronaldulyssesswanson",
                    black: "esolcneveton",
                    date: "2016-04-16T14:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@rreyv vs @krzem 4/17 (sunday) 15:00 GMT",
                {
                    white: "rreyv",
                    black: "krzem",
                    date: "2016-04-17T15:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@atrophied vs @jaivl 4/14 20:00",
                {
                    white: "atrophied",
                    black: "jaivl",
                    date: "2016-04-14T20:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "reschedule @modakshantanu vs @hakonj April 14th 7:00 GMT",
                {
                    white: "modakshantanu",
                    black: "hakonj",
                    date: "2016-04-14T07:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@quirked vs @vishysoisse 4/14 21:00 GMT",
                {
                    white: "quirked",
                    black: "vishysoisse",
                    date: "2016-04-14T21:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@theino: vs @cactus 4/14 2:30 gmt",
                {
                    white: "theino",
                    black: "cactus",
                    date: "2016-04-14T02:30:00+00:00"
                }
            );
            test_parse_scheduling(
                "@seb32 vs @ Petruchio 4/15 23:00 GMT.",
                {
                    white: "seb32",
                    black: "Petruchio",
                    date: "2016-04-15T23:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@soldadofiel vs @durchnachtundwind Wednesday 4/13 23.09 GMT",
                {
                    white: "soldadofiel",
                    black: "durchnachtundwind",
                    date: "2016-04-13T23:09:00+00:00"
                }
            );
            test_parse_scheduling(
                "@greyhawk vs @immortality  thursday 4/14  2100 GMT",
                {
                    white: "greyhawk",
                    black: "immortality",
                    date: "2016-04-14T21:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@soldadofiel vs @durchnachtundwind Wednesday 4/13 23.09 GMT",
                {
                    white: "soldadofiel",
                    black: "durchnachtundwind",
                    date: "2016-04-13T23:09:00+00:00"
                }
            );
            test_parse_scheduling(
                "@nacional100 vs @tnan123 Friday 4/15 @ 14:00 GMT",
                {
                    white: "nacional100",
                    black: "tnan123",
                    date: "2016-04-15T14:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "hillrp vs @endrawes0  0100 GMT 17/4/16",
                {
                    white: "hillrp",
                    black: "endrawes0",
                    date: "2016-04-17T01:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@saschlars vs @preserve April 16th at 12:00 GMT",
                {
                    white: "saschlars",
                    black: "preserve",
                    date: "2016-04-16T12:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "reschedule: @modakshantanu  vs @hakonj April 14th @ 15:00 GMT",
                {
                    white: "modakshantanu",
                    black: "hakonj",
                    date: "2016-04-14T15:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@ihaterbf vs @hyzer 4/16 22:00 GMT",
                {
                    white: "ihaterbf",
                    black: "hyzer",
                    date: "2016-04-16T22:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@djcrisce vs @zantawb 4/15 00:00 GMT",
                {
                    white: "djcrisce",
                    black: "zantawb",
                    date: "2016-04-15T00:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@jptriton vs @cyanfish Thurs April 14 @ 18:00 GMT",
                {
                    white: "jptriton",
                    black: "cyanfish",
                    date: "2016-04-14T18:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@narud vs @lakinwecker 4/16 17:00 GMT",
                {
                    white: "narud",
                    black: "lakinwecker",
                    date: "2016-04-16T17:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@steveharwell (greentiger) v @harrison2 Apr 15 at 1500 GMT",
                {
                    white: "greentiger",
                    black: "harrison2",
                    date: "2016-04-15T15:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@jyr vs @droodjerky  15/04 at 17:00 GMT",
                {
                    white: "jyr",
                    black: "droodjerky",
                    date: "2016-04-15T17:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@chill5555 vs @doganof 15/04 at 17:00 GMT",
                {
                    white: "chill5555",
                    black: "doganof",
                    date: "2016-04-15T17:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@oldtom v @bramminator  04/17 @ 16:15 GMT",
                {
                    white: "oldtom",
                    black: "bramminator",
                    date: "2016-04-17T16:15:00+00:00"
                }
            );
            test_parse_scheduling(
                "@ctorh - @practicedave 18/4@18:00GMT",
                {
                    white: "ctorh",
                    black: "practicedave",
                    date: "2016-04-18T18:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@boviced v @hoxhound April 14, 16:00 GMT",
                {
                    white: "boviced",
                    black: "hoxhound",
                    date: "2016-04-14T16:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@pasternak v @riemannn, April 14, 20:00 GMT",
                {
                    white: "pasternak",
                    black: "riemannn",
                    date: "2016-04-14T20:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@angborxley v @theknug April 17th 13:30 GMT",
                {
                    white: "angborxley",
                    black: "theknug",
                    date: "2016-04-17T13:30:00+00:00"
                }
            );
            test_parse_scheduling(
                "@imakethenews v. @daveyjones01  April 15, 22:00 GMT, 18:00 EDT",
                {
                    white: "imakethenews",
                    black: "daveyjones01",
                    date: "2016-04-15T22:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@imakethenews v. @daveyjones01  April 15, 22:00 GMT, 18:00 EDT",
                {
                    white: "imakethenews",
                    black: "daveyjones01",
                    date: "2016-04-15T22:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "@modakshantanu v @hakonj April 13th 07:00 GMT",
                {
                    white: "modakshantanu",
                    black: "hakonj",
                    date: "2016-04-13T07:00:00+00:00"
                }
            );
            test_parse_scheduling(
                "osskjc vs Stoy Fri. 15th 8:00 GMT.",
                {
                    white: "osskjc",
                    black: "Stoy",
                    date: "2016-04-15T08:00:00+00:00"
                }
            );
        });
    });
});


