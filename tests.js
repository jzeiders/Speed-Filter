var chai = require("chai");
var expect = chai.expect;
var speedFilter = require('./speedfilter.js');
var LOWER = 1.5, // Meters / Second
HIGHER = 14,
    points = [{
        lng: -88.19593,
        lat: 40.1108353,
        time: '2016-07-11T17:48:42.489Z'
    }, {
        lng: -88.1944071,
        lat: 40.1079313,
        time: '2016-07-11T17:52:39.716Z'
    }, {
        lng: -88.1953208,
        lat: 40.1077055,
        time: '2016-07-11T17:52:57.270Z'
    }, {
        lng: -88.1955493,
        lat: 40.1062688,
        time: '2016-07-11T17:53:33.622Z'
    }, {
        lng: -88.1949401,
        lat: 40.1056192,
        time: '2016-07-11T17:54:50.591Z'
    }, {
        lng: -88.1932268,
        lat: 40.1060327,
        time: '2016-07-11T17:55:59.240Z'
    }, {
        lng: -88.1917419,
        lat: 40.1051694,
        time: '2016-07-11T17:56:12.507Z'
    }, {
        lng: -88.1921988,
        lat: 40.1058967,
        time: '2016-07-11T17:57:11.741Z'
    }, {
        lng: -88.1896857,
        lat: 40.1052974,
        time: '2016-07-11T17:57:29.459Z'
    }, {
        lng: -88.1895334,
        lat: 40.105215,
        time: '2016-07-11T17:59:52.109Z'
    }, {
        lng: -88.1867917,
        lat: 40.1062125,
        time: '2016-07-11T18:00:09.763Z'
    }];

describe("Calc Speeds", function() {
    speeds = speedFilter.calcSpeeds(points);
    it("speeds should be greater than 0", function() {
        for (var i = 0; i < speeds.length; i++) {
            expect(speeds[i]).to.be.above(0);
        }
    });

});
describe("Calc elapsed time", function() {
    var time1 = "2016-07-12 17:16:30.123+00";
    var time2 = "2016-07-12 17:16:39.241+00";
    var elapsed = speedFilter.calcElapsed(time1, time2);
    it("should calc time accurately in seconds", function() {
        expect(Math.abs(elapsed - 9)).to.be.below(1);
    });
    it("should be greater than 0", function() {
        expect(elapsed).to.be.above(0);
    });
});

describe("Calc Dists", function() {
    var dists;
    beforeEach(function() {
        dists = speedFilter.calcDists(points);
    });
    it("should return distances", function() {
        for (var i = 0; i < dists.length; i++) {
            expect(dists[i]).to.be.above(0);
        }
    });
    it("should have a length one less", function() {
        expect(dists.length - points.length).to.be.equal(-1);
    });
});

describe("Dist", function() {
    var pt1 = {
            x: 43.12123,
            y: 34.23
        },
        pt2 = {
            x: -15.343,
            y: -34.99
        };
    var distance = speedFilter.dist(pt1, pt2);
    it("should calculate distance", function() {
        expect(Math.abs(distance - (9568 * 1000))).to.be.most(300 * 1000);
    });
    it("should be greater than 0", function() {
        expect(speedFilter.dist(points[0], points[1])).to.be.above(0);
    });
});
describe("Filter Speeds", function() {
    var filtered = speedFilter.filter(points, LOWER, HIGHER);
    speeds = speedFilter.calcSpeeds(filtered);
    it("should remove speeds below lower bound", function() {
        for (var i = 0; i < speeds.length; i++) {
            expect(speeds[i]).to.be.above(LOWER);
        }
    });
    it("should remove speeds above higher bound", function() {
        for (var i = 0; i < speeds.length; i++) {
            expect(speeds[i]).to.be.below(HIGHER);
        }
    });
});
