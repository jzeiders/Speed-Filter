function speedFilter() {}
var moment = require('moment');

speedFilter.prototype.calcSpeeds = function(points) {
    var elapsed = [],
        distances = this.calcDists(points);
    for (var i = 0; i < points.length - 1; i++) {
        elapsed.push(this.calcElapsed(points[i].time, points[i + 1].time));
    }
    return distances.map(function(v, i) {
        return v / elapsed[i]; //Speeds are in meters per second;
    });
};
speedFilter.prototype.filter = function(points, lowBound, highBound) {
    points = points.slice();
    var speeds = this.calcSpeeds(points);
    for (var i = 0; i < speeds.length; i++) {
        while (speeds[i] < lowBound || speeds[i] > highBound) {
            if (i >= speeds.length)
                break;
            points.splice(i + 1, 1);
            speeds = this.calcSpeeds(points);
        }
    }
    return points;
};
speedFilter.prototype.calcElapsed = function(time1, time2) {
    time1 = moment(time1);
    time2 = moment(time2);
    return Math.abs(time1.diff(time2, "seconds")); // returns difference in seconds;
};
speedFilter.prototype.calcDists = function(points) {
    var dists = [];
    for (var i = 0; i < points.length - 1; i++) {
        dists.push(this.dist(points[i], points[i + 1]));
    }
    return dists;
};
speedFilter.prototype.dist = function(pt1, pt2) {
    if (pt1.hasOwnProperty('x')) {
        return getDistance(pt1.y, pt1.x, pt2.y, pt2.x);
    }
    if (pt1.hasOwnProperty('lat')) {
        return getDistance(pt1.lat, pt1.lng, pt2.lat, pt2.lng);
    }
    if (pt1.hasOwnProperty('latitude')) {
        return getDistance(pt1.latitude, pt1.longitude, pt2.latitude, pt2.longitude);
    }
};

var getDistance = function(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000; // Distance in Meters
};

var deg2rad = function deg2rad(deg) {
    return deg * (Math.PI / 180);
};
module.exports = exports = new speedFilter();
