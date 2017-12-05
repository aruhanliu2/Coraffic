var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../libs/core/enums.d.ts"/>
var pxsim;
(function (pxsim) {
    var loops;
    (function (loops) {
        /**
         * Repeats the code forever in the background. On each iteration, allows other code to run.
         * @param body the code to repeat
         */
        //% help=functions/forever weight=55 blockGap=8
        //% blockId=device_forever block="forever" 
        function forever(body) {
            pxsim.thread.forever(body);
        }
        loops.forever = forever;
        /**
         * Pause for the specified time in milliseconds
         * @param ms how long to pause for, eg: 100, 200, 500, 1000, 2000
         */
        //% help=functions/pause weight=54
        //% block="pause (ms) %pause" blockId=device_pause
        function pauseAsync(ms) {
            return Promise.delay(ms);
        }
        loops.pauseAsync = pauseAsync;
    })(loops = pxsim.loops || (pxsim.loops = {}));
})(pxsim || (pxsim = {}));
function logMsg(m) { console.log(m); }
// namespace pxsim.console {
//     /**
//      * Print out message
//      */
//     //% 
//     export function log(msg:string) {
//         logMsg("CONSOLE: " + msg)
//         // why doesn't that work?
//         //board().writeSerial(msg + "\n")
//     }
// }
var pxsim;
(function (pxsim) {
    var events;
    (function (events) {
        /**
         * @param loc
         * @param body
         */
        //% block="On a car meets intersection %loc" blockId=on_car_inter
        function onCarInter(loc, body) {
            pxsim.board().bus.listen("loc", loc, body);
        }
        events.onCarInter = onCarInter;
        /**
         * Detect car at inter
         */
        //%
        function detectCarInter() {
            for (var i = 0; i < pxsim.board().intersections_arr.length; i++) {
                var loc = pxsim.board().checkInterLoc(i);
                pxsim.board().bus.queue("loc", loc);
            }
        }
        events.detectCarInter = detectCarInter;
    })(events = pxsim.events || (pxsim.events = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var intersections;
    (function (intersections) {
        /**
         * @param dir
         * @param loc
         */
        //% block="Allow %dir|at intersection %loc" blockId=set_dir_at_inter weight=20
        function setDirAtInter(dir, loc) {
            pxsim.board().setDirAtInter(dir, loc);
        }
        intersections.setDirAtInter = setDirAtInter;
        /**
         * @param dir
         * @param loc
         */
        //% block="Stop %dir|at intersection %loc" blockId=stop_dir_at_inter weight=10
        function stopDirAtInter(dir, loc) {
            return pxsim.board().StopDirAtInter(dir, loc);
        }
        intersections.stopDirAtInter = stopDirAtInter;
    })(intersections = pxsim.intersections || (pxsim.intersections = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var status;
    (function (status) {
        /**
         * @param loc
         * @param dir
        */
        //% block="Cars waiting for %dir|at intersection %loc" blockId=get_cars_waiting weight=50
        function getCarsWait(dir, loc) {
            return pxsim.board().getCarsWait(dir, loc);
        }
        status.getCarsWait = getCarsWait;
        /**
         * @param loc
         */
        //% block="Direction at intersection %loc" blockId=get_dir weight=40
        function getDirection(loc) {
            return pxsim.board().getDirection(loc);
        }
        status.getDirection = getDirection;
        /**
         * @param loc
         */
        //% block="Duration at intersection %loc" blockId=get_duration weight=30
        function getDuration(loc) {
            return pxsim.board().getDuration(loc);
        }
        status.getDuration = getDuration;
        /**
         * @param loc
         */
        //% block="%loc" blockId=param_loc weight=20
        function locParam(loc) {
            if (loc == 0) {
                return 0;
            }
            else {
                return 1;
            }
        }
        status.locParam = locParam;
        /**
         * Random Intersection Index
         */
        //% block="Random Index" blockId=param_random_index weight=15
        function randIndex() {
            return (Math.floor(Math.random() * (7 - 0 + 1)) + 0);
        }
        status.randIndex = randIndex;
    })(status = pxsim.status || (pxsim.status = {}));
})(pxsim || (pxsim = {}));
/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
var pxsim;
(function (pxsim) {
    /**
    * This function gets called each time the program restarts
    */
    pxsim.initCurrentRuntime = function () {
        pxsim.runtime.board = new Board();
    };
    /**
    * Gets the current 'board', eg. program state.
    */
    function board() {
        return pxsim.runtime.board;
    }
    pxsim.board = board;
    /**
    * Represents the entire state of the executing program.
    * Do not store state anywhere else!
    */
    var Board = (function (_super) {
        __extends(Board, _super);
        function Board() {
            _super.call(this);
            this.canvas_width = 370;
            this.canvas_height = 670;
            this.intersection_waits_NS = new Array(8);
            this.intersection_waits_EW = new Array(8);
            this.svgDiv = document.getElementById("svgcanvas");
            this.canvas = document.getElementsByTagName("canvas")[0];
            this.scriptSim = document.getElementById("js3");
            this.ratio = document.getElementById("ratio");
            this.slow = document.getElementById("slow");
            this.fast = document.getElementById("fast");
            this.ctx = this.canvas.getContext("2d");
            this.car_no = 15, this.canvas_width = 370, this.canvas_height = 670;
            this.roads = [], this.cars = [], this.intersections_arr = [];
            this.tMap = new jsLib.tMap(this);
            this.intersection_waits_NS[0] = new Array(null, 2);
            this.intersection_waits_NS[1] = new Array(null, 3);
            this.intersection_waits_NS[2] = new Array(0, 4);
            this.intersection_waits_NS[3] = new Array(1, 5);
            this.intersection_waits_NS[4] = new Array(2, 6);
            this.intersection_waits_NS[5] = new Array(3, 7);
            this.intersection_waits_NS[6] = new Array(4, null);
            this.intersection_waits_NS[7] = new Array(5, null);
            this.intersection_waits_EW[0] = new Array(null, 1);
            this.intersection_waits_EW[1] = new Array(0, null);
            this.intersection_waits_EW[2] = new Array(null, 3);
            this.intersection_waits_EW[3] = new Array(2, null);
            this.intersection_waits_EW[4] = new Array(4, 5);
            this.intersection_waits_EW[5] = new Array(4, null);
            this.intersection_waits_EW[6] = new Array(null, 7);
            this.intersection_waits_EW[7] = new Array(6, null);
        }
        Board.prototype.initAsync = function (msg) {
            document.body.innerHTML = ''; // clear children
            this.svgDiv.appendChild(this.canvas);
            document.body.appendChild(this.svgDiv);
            document.body.appendChild(this.scriptSim);
            this.tMap.init();
            this.tMap.animloop();
            return Promise.resolve();
        };
        Board.prototype.setDirAtInter = function (dir, loc) {
            //North-South
            if (dir == 0) {
                this.intersections_arr[loc].NS = true;
                this.intersections_arr[loc].EW = false;
                this.intersections_arr[loc].startTime = new Date().getTime();
            }
            else if (dir == 1) {
                this.intersections_arr[loc].EW = true;
                this.intersections_arr[loc].NS = false;
                this.intersections_arr[loc].startTime = new Date().getTime();
            }
        };
        Board.prototype.getCarsWait = function (dir, loc) {
            if (dir == 0) {
                var fitered_cars = [];
                for (var i = 0; i < this.cars.length; i++) {
                    if (this.cars[i].d == "n" || this.cars[i].d == "s") {
                        if (Math.abs(this.intersections_arr[loc].x - this.cars[i].x) < 40) {
                            if (this.intersection_waits_NS[loc][0] == null) {
                                if (this.cars[i].y <= this.intersections_arr[this.intersection_waits_NS[loc][1]].y) {
                                    fitered_cars.push(this.cars[i]);
                                }
                            }
                            else if (this.intersection_waits_NS[loc][1] == null) {
                                if (this.cars[i].y >= this.intersections_arr[this.intersection_waits_NS[loc][0]].y) {
                                    fitered_cars.push(this.cars[i]);
                                }
                            }
                            else {
                                if (this.cars[i].y >= this.intersections_arr[this.intersection_waits_NS[loc][0]].y && this.cars[i].y <= this.intersections_arr[this.intersection_waits_NS[loc][1]].y) {
                                    fitered_cars.push(this.cars[i]);
                                }
                            }
                        }
                    }
                }
                return fitered_cars.length;
            }
            else if (dir == 1) {
                var fitered_cars = [];
                for (var i = 0; i < this.cars.length; i++) {
                    if (this.cars[i].d == "e" || this.cars[i].d == "w") {
                        if (Math.abs(this.intersections_arr[loc].y - this.cars[i].y) < 40) {
                            if (this.intersection_waits_EW[loc][0] == null) {
                                if (this.cars[i].x <= this.intersections_arr[this.intersection_waits_EW[loc][1]].x) {
                                    fitered_cars.push(this.cars[i]);
                                }
                            }
                            else if (this.intersection_waits_EW[loc][1] == null) {
                                if (this.cars[i].x >= this.intersections_arr[this.intersection_waits_EW[loc][0]].x) {
                                    fitered_cars.push(this.cars[i]);
                                }
                            }
                            else {
                                if (this.cars[i].x >= this.intersections_arr[this.intersection_waits_EW[loc][0]].x && this.cars[i].x <= this.intersections_arr[this.intersection_waits_EW[loc][1]].x) {
                                    fitered_cars.push(this.cars[i]);
                                }
                            }
                        }
                    }
                }
                return fitered_cars.length;
            }
            else if (dir == 2) {
                return this.intersections_arr[loc].countAWCars;
            }
            else {
                return 0;
            }
        };
        Board.prototype.StopDirAtInter = function (dir, loc) {
            //North-South
            if (dir == 0) {
                this.intersections_arr[loc].NS = false;
                this.intersections_arr[loc].startTime = new Date().getTime();
            }
            else if (dir == 1) {
                this.intersections_arr[loc].EW = false;
                this.intersections_arr[loc].startTime = new Date().getTime();
            }
            else if (dir == 2) {
                this.intersections_arr[loc].NS = false;
                this.intersections_arr[loc].EW = false;
                this.intersections_arr[loc].startTime = new Date().getTime();
            }
        };
        Board.prototype.getDirection = function (loc) {
            if (this.intersections_arr[loc].NS == true) {
                return 0;
            }
            else if (this.intersections_arr[loc].EW == true) {
                return 1;
            }
            else {
                return null;
            }
        };
        Board.prototype.getDuration = function (loc) {
            var endTime = new Date().getTime();
            var diff = (endTime - this.intersections_arr[loc].startTime) / 1000;
            return Math.round(diff);
        };
        Board.prototype.checkInterLoc = function (loc) {
            if (this.getCarsWait(0, loc) > 0 || this.getCarsWait(1, loc) > 0) {
                return loc;
            }
            else {
                return null;
            }
        };
        return Board;
    }(pxsim.CoreBoard));
    pxsim.Board = Board;
})(pxsim || (pxsim = {}));
var jsLib;
(function (jsLib) {
    var requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    var tMap = (function () {
        function tMap(b) {
            var _this = this;
            this.b = b;
            this.car_no = b.car_no;
            this.canvas = b.canvas;
            this.ctx = b.ctx;
            this.w = b.canvas_width;
            this.h = b.canvas_height;
            this.roads = b.roads;
            this.cars = b.cars;
            this.intersections_arr = b.intersections_arr;
            this.ratio = b.ratio;
            this.slow = b.slow;
            this.fast = b.fast;
            this.slow.addEventListener("click", function (e) { return _this.toSlow(); });
            this.fast.addEventListener("click", function (e) { return _this.toFast(); });
            this.globalSpeed = 3;
        }
        //initiate the parameters
        tMap.prototype.init = function () {
            //road1
            var road = new drawroad(this);
            road.x = ((this.w / 2) - 120), road.y = 0, road.width = 40, road.height = this.h;
            this.roads.push(road);
            //road2
            var road = new drawroad(this);
            road.x = ((this.w / 2) + 80), road.y = 0, road.width = 40, road.height = this.h;
            this.roads.push(road);
            //road3
            var road = new drawroad(this);
            road.x = 0, road.y = ((this.h / 4) - 80), road.width = this.w, road.height = 40;
            this.roads.push(road);
            //road4
            var road = new drawroad(this);
            road.x = 0, road.y = ((this.h / 3)), road.width = this.w, road.height = 40;
            this.roads.push(road);
            //road5
            var road = new drawroad(this);
            road.x = 65, road.y = 400, road.width = this.w, road.height = 40;
            this.roads.push(road);
            //road6
            var road = new drawroad(this);
            road.x = 0, road.y = (this.h / 1.4) + 100, road.width = this.w, road.height = 40;
            this.roads.push(road);
            //generating cars at beginning
            for (var i = 0; i < this.car_no; i++) {
                var car = new drawcar(this);
                car.s = 3;
                var pos_rand = Math.random();
                if (pos_rand < 0.1) {
                    car.x = this.w + 25;
                    car.y = this.roads[2].y + 3;
                    car.d = "w";
                }
                else if (pos_rand > 0.1 && pos_rand < 0.2) {
                    car.x = this.roads[1].x + 37;
                    car.y = this.h + 15;
                    car.d = "n";
                }
                else if (pos_rand > 0.2 && pos_rand < 0.3) {
                    car.x = this.roads[0].x + 37;
                    car.y = this.h + 15;
                    car.d = "n";
                }
                else if (pos_rand > 0.3 && pos_rand < 0.4) {
                    car.x = this.roads[1].x + 15;
                    car.y = -15;
                    car.d = "s";
                }
                else if (pos_rand > 0.4 && pos_rand < 0.5) {
                    car.x = this.roads[0].x + 15;
                    car.y = -15;
                    car.d = "s";
                }
                else if (pos_rand > 0.5 && pos_rand < 0.6) {
                    car.x = this.w + 25;
                    car.y = this.roads[3].y + 3;
                    car.d = "w";
                }
                else if (pos_rand > 0.6 && pos_rand < 0.7) {
                    car.x = this.w + 25;
                    car.y = this.roads[4].y + 3;
                    car.d = "w";
                }
                else if (pos_rand > 0.7 && pos_rand < 0.8) {
                    car.x = this.w + 25;
                    car.y = this.roads[5].y + 3;
                    car.d = "w";
                }
                else if (pos_rand > 0.8 && pos_rand < 0.9) {
                    car.x = -15;
                    car.y = this.roads[3].y + 23;
                    car.d = "e";
                }
                else if (pos_rand > 0.9 && pos_rand < 1) {
                    car.x = -15;
                    car.y = this.roads[2].y + 23;
                    car.d = "e";
                }
                else {
                    car.x = -15;
                    car.y = this.roads[5].y + 23;
                    car.d = "e";
                }
                var color_rand = Math.random();
                var color = "";
                if (color_rand < 0.2) {
                    var color = "#fff";
                }
                else if (color_rand > 0.2 && color_rand < 0.4) {
                    var color = "#E22322";
                }
                else if (color_rand > 0.4 && color_rand < 0.6) {
                    var color = "#F9D111";
                }
                else if (color_rand > 0.6 && color_rand < 0.8) {
                    var color = "#367C94";
                }
                else if (color_rand > 0.8 && color_rand < 1) {
                    var color = "#222";
                }
                car.color = color;
                this.cars.push(car);
            }
            this.intersections();
        };
        tMap.prototype.getRatio = function () {
            var stoppedCars = 0;
            var movingCars = 0;
            for (var i = 0; i < this.cars.length; i++) {
                if (this.cars[i].s == 0) {
                    stoppedCars++;
                }
                else {
                    movingCars++;
                }
            }
            ;
            this.ratio.textContent = String(parseFloat(String((1 - stoppedCars / this.cars.length) * 100)).toFixed(0) + "%");
        };
        //draw the map
        tMap.prototype.drawscene = function () {
            this.ctx.fillStyle = "#4DBB4C";
            this.ctx.fillRect(0, 0, this.w, this.h);
            for (var i = 0; i < this.roads.length; i++) {
                this.roads[i].drawRoad(i);
            }
            for (var i = 0; i < this.intersections_arr.length; i++) {
                this.intersections_arr[i].drawInter(i);
            }
            this.drive_cars();
            this.getRatio();
        };
        tMap.prototype.distance_check = function (c1, c2, axis) {
            if (axis == "x") {
                var dist = c2.x - c1.x;
                var disty = c2.y - c1.y;
                if (dist > 0 && dist <= (c1.l + 15)) {
                    if (c2.w > 15 && c1.w > 15 && Math.abs(c1.y - c2.y) >= 0 && Math.abs(c1.y - c2.y) <= 1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else if (axis == "-x") {
                var dist = c1.x - c2.x;
                var disty = c1.y - c2.y;
                if (dist > 0 && dist <= (c1.l + 15)) {
                    if (c2.w > 15 && c1.w > 15 && Math.abs(c1.y - c2.y) >= 0 && Math.abs(c1.y - c2.y) <= 1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else if (axis == "-y") {
                var dist = c1.x - c2.x;
                var disty = c1.y - c2.y;
                if (disty > 0 && disty <= (c1.l + 15)) {
                    if (c2.w < 25 && c1.w < 25 && Math.abs(c1.x - c2.x) >= 0 && Math.abs(c1.x - c2.x) <= 1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else if (axis == "y") {
                var dist = c2.x - c1.x;
                var disty = c2.y - c1.y;
                if (disty > 0 && disty <= (c1.l + 15)) {
                    if (c2.w < 25 && c1.w < 25 && Math.abs(c1.x - c2.x) >= 0 && Math.abs(c1.x - c2.x) <= 1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        tMap.prototype.toSlow = function () {
            for (var l = 0; l < this.cars.length; l++) {
                this.cars[l].s = 2;
            }
            this.globalSpeed = 2;
        };
        tMap.prototype.toFast = function () {
            for (var l = 0; l < this.cars.length; l++) {
                this.cars[l].s = 5;
            }
            this.globalSpeed = 5;
        };
        tMap.prototype.check_inter = function (c, inter, axis) {
            if (axis == "x") {
                if ((inter.x - c.x) > (c.l + 8) && (inter.x - c.x) <= (c.l + 25)) {
                    if (c.y - 40 <= inter.y && c.y + 42 >= inter.y) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else if (axis == "-x") {
                if ((c.x - inter.x) > (c.l + 8) && (c.x - inter.x) <= (c.l + inter.width + 5)) {
                    if (c.y - 40 <= inter.y && c.y + 42 >= inter.y) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else if (axis == "-y") {
                if ((c.y - inter.y) > (c.l + 8) && (c.y - inter.y) <= (c.l + inter.height + 5)) {
                    if (c.x - 40 <= inter.x && c.x + 42 >= inter.x) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else if (axis == "y") {
                if ((inter.y - c.y) > (c.l + 8) && (inter.y - c.y) <= (c.l + 27)) {
                    if (c.x - 40 <= inter.x && c.x + 42 >= inter.x) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        tMap.prototype.gen_dir = function (c, inter) {
            if (c.dd == false) {
                var rand_dir = Math.random();
                c.dd = true;
                if (c.d == "e") {
                    if (inter.EW == true) {
                        if (rand_dir > 0.5) {
                            c.d = "e";
                        }
                        else {
                            c.x = inter.x + 13;
                            c.d = "s";
                        }
                    }
                }
                else if (c.d == "w") {
                    if (inter.EW == true) {
                        if (rand_dir > 0.5) {
                            c.d = "w";
                        }
                        else {
                            c.x = inter.x + 39;
                            c.d = "n";
                        }
                    }
                }
                else if (c.d == "n") {
                    if (inter.NS == true) {
                        if (rand_dir > 0.5) {
                            c.d = "n";
                        }
                        else {
                            c.y = inter.y + 26;
                            c.d = "e";
                        }
                    }
                }
                else if (c.d == "s") {
                    if (inter.NS == true) {
                        if (rand_dir > 0.5) {
                            c.d = "s";
                        }
                        else {
                            if (inter.roadleft) {
                                c.y = inter.y;
                                c.x = inter.x - 15;
                                c.d = "w";
                            }
                        }
                    }
                }
            }
        };
        tMap.prototype.drive_cars = function () {
            for (var i = 0; i < this.cars.length; i++) {
                var c = this.cars[i];
                c.s = this.globalSpeed;
                if (c.d == "e") {
                    for (var l = 0; l < this.cars.length; l++) {
                        var c2 = this.cars[l];
                        var dc = this.distance_check(c, c2, "x");
                        if (dc == true) {
                            c.s = 0;
                            for (var k = 0; k < this.intersections_arr.length; k++) {
                                var inter = this.intersections_arr[k];
                                if (inter.y + inter.height > c.y && inter.y < c.y) {
                                    c.s = 0;
                                }
                            }
                        }
                        else {
                            var counter = 0;
                            for (var k = 0; k < this.intersections_arr.length; k++) {
                                var inter = this.intersections_arr[k];
                                if (this.check_inter(c, inter, "x")) {
                                    counter++;
                                    if (inter.left == "rgba(255,0,0,0.4)") {
                                        //red
                                        c.s = 0;
                                    }
                                    else {
                                        //green
                                        c.s = this.globalSpeed;
                                        //figure dir
                                        this.gen_dir(c, inter);
                                    }
                                }
                            }
                            if (counter == 0) {
                                //car past intersection reset random generator
                                c.dd = false;
                            }
                        }
                    }
                    if (c.x + 26 >= this.canvas.width) {
                        //reposition car
                        var pos_rand = Math.random();
                        if (pos_rand < 0.1) {
                            c.x = this.w + 25;
                            c.y = this.roads[2].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.1 && pos_rand < 0.2) {
                            c.x = this.roads[1].x + 37;
                            c.y = this.h + 15;
                            c.d = "n";
                            return;
                        }
                        else if (pos_rand > 0.2 && pos_rand < 0.3) {
                            c.x = this.roads[0].x + 37;
                            c.y = this.h + 15;
                            c.d = "n";
                            return;
                        }
                        else if (pos_rand > 0.3 && pos_rand < 0.4) {
                            c.x = this.roads[1].x + 15;
                            c.y = -15;
                            c.d = "s";
                            return;
                        }
                        else if (pos_rand > 0.4 && pos_rand < 0.5) {
                            c.x = this.roads[0].x + 15;
                            c.y = -15;
                            c.d = "s";
                            return;
                        }
                        else if (pos_rand > 0.5 && pos_rand < 0.6) {
                            c.x = this.w + 25;
                            c.y = this.roads[3].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.6 && pos_rand < 0.7) {
                            c.x = this.w + 25;
                            c.y = this.roads[4].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.7 && pos_rand < 0.8) {
                            c.x = this.w + 25;
                            c.y = this.roads[5].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.8 && pos_rand < 0.9) {
                            c.x = -15;
                            c.y = this.roads[3].y + 23;
                            c.d = "e";
                        }
                        else if (pos_rand > 0.9 && pos_rand < 1) {
                            c.x = -15;
                            c.y = this.roads[2].y + 23;
                            c.d = "e";
                        }
                        else {
                            c.x = -15;
                            c.y = this.roads[5].y + 23;
                            c.d = "e";
                        }
                    }
                    c.x += c.s;
                }
                else if (c.d == "n") {
                    for (var l = 0; l < this.cars.length; l++) {
                        var c2 = this.cars[l];
                        var dc = this.distance_check(c, c2, "-y");
                        if (dc == true) {
                            c.s = 0;
                            for (var k = 0; k < this.intersections_arr.length; k++) {
                                var inter = this.intersections_arr[k];
                                if (inter.x + inter.width > c.x && inter.x < c.x) {
                                    c.s = 0;
                                }
                            }
                        }
                        else {
                            var counter = 0;
                            for (var k = 0; k < this.intersections_arr.length; k++) {
                                var inter = this.intersections_arr[k];
                                if (this.check_inter(c, inter, "-y")) {
                                    counter++;
                                    if (inter.bottom == "rgba(255,0,0,0.4)") {
                                        //red
                                        c.s = 0;
                                    }
                                    else {
                                        //green
                                        c.s = this.globalSpeed;
                                        //figure dir
                                        this.gen_dir(c, inter);
                                    }
                                }
                            }
                            if (counter == 0) {
                                //car past intersection reset random generator
                                c.dd = false;
                            }
                        }
                    }
                    if (c.y + 26 <= 0) {
                        var pos_rand = Math.random();
                        //reposition car
                        if (pos_rand < 0.1) {
                            c.x = this.w + 25;
                            c.y = this.roads[2].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.1 && pos_rand < 0.2) {
                            c.x = this.roads[1].x + 37;
                            c.y = this.h + 15;
                            c.d = "n";
                        }
                        else if (pos_rand > 0.2 && pos_rand < 0.3) {
                            c.x = this.roads[0].x + 37;
                            c.y = this.h + 15;
                            c.d = "n";
                        }
                        else if (pos_rand > 0.3 && pos_rand < 0.4) {
                            c.x = this.roads[1].x + 15;
                            c.y = -15;
                            c.d = "s";
                            return;
                        }
                        else if (pos_rand > 0.4 && pos_rand < 0.5) {
                            c.x = this.roads[0].x + 15;
                            c.y = -15;
                            c.d = "s";
                            return;
                        }
                        else if (pos_rand > 0.5 && pos_rand < 0.6) {
                            c.x = this.w + 25;
                            c.y = this.roads[3].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.6 && pos_rand < 0.7) {
                            c.x = this.w + 25;
                            c.y = this.roads[4].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.7 && pos_rand < 0.8) {
                            c.x = this.w + 25;
                            c.y = this.roads[5].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.8 && pos_rand < 0.9) {
                            c.x = -15;
                            c.y = this.roads[3].y + 23;
                            c.d = "e";
                            return;
                        }
                        else if (pos_rand > 0.9 && pos_rand < 1) {
                            c.x = -15;
                            c.y = this.roads[2].y + 23;
                            c.d = "e";
                            return;
                        }
                        else {
                            c.x = -15;
                            c.y = this.roads[5].y + 23;
                            c.d = "e";
                            return;
                        }
                    }
                    c.y -= c.s;
                }
                else if (c.d == "s") {
                    for (var l = 0; l < this.cars.length; l++) {
                        var c2 = this.cars[l];
                        var dc = this.distance_check(c, c2, "y");
                        if (dc == true) {
                            c.s = 0;
                            for (var k = 0; k < this.intersections_arr.length; k++) {
                                var inter = this.intersections_arr[k];
                                if (inter.x + inter.width > c.x && inter.x < c.x) {
                                    //this is road
                                    c.s = 0;
                                }
                            }
                        }
                        else {
                            var counter = 0;
                            for (var k = 0; k < this.intersections_arr.length; k++) {
                                var inter = this.intersections_arr[k];
                                if (this.check_inter(c, inter, "y")) {
                                    counter++;
                                    if (inter.top == "rgba(255,0,0,0.4)") {
                                        //red
                                        c.s = 0;
                                    }
                                    else {
                                        //green
                                        c.s = this.globalSpeed;
                                        //figure dir
                                        this.gen_dir(c, inter);
                                    }
                                }
                            }
                            if (counter == 0) {
                                //car past intersection reset random generator
                                c.dd = false;
                            }
                        }
                    }
                    if (c.y - 26 >= this.h) {
                        //reposition car
                        var pos_rand = Math.random();
                        if (pos_rand < 0.1) {
                            c.x = this.w + 25;
                            c.y = this.roads[2].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.1 && pos_rand < 0.2) {
                            c.x = this.roads[1].x + 37;
                            c.y = this.h + 15;
                            c.d = "n";
                            return;
                        }
                        else if (pos_rand > 0.2 && pos_rand < 0.3) {
                            c.x = this.roads[0].x + 37;
                            c.y = this.h + 15;
                            c.d = "n";
                            return;
                        }
                        else if (pos_rand > 0.3 && pos_rand < 0.4) {
                            c.x = this.roads[1].x + 15;
                            c.y = -15;
                            c.d = "s";
                        }
                        else if (pos_rand > 0.4 && pos_rand < 0.5) {
                            c.x = this.roads[0].x + 15;
                            c.y = -15;
                            c.d = "s";
                        }
                        else if (pos_rand > 0.5 && pos_rand < 0.6) {
                            c.x = this.w + 25;
                            c.y = this.roads[3].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.6 && pos_rand < 0.7) {
                            c.x = this.w + 25;
                            c.y = this.roads[4].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.7 && pos_rand < 0.8) {
                            c.x = this.w + 25;
                            c.y = this.roads[5].y + 3;
                            c.d = "w";
                            return;
                        }
                        else if (pos_rand > 0.8 && pos_rand < 0.9) {
                            c.x = -15;
                            c.y = this.roads[3].y + 23;
                            c.d = "e";
                            return;
                        }
                        else if (pos_rand > 0.9 && pos_rand < 1) {
                            c.x = -15;
                            c.y = this.roads[2].y + 23;
                            c.d = "e";
                            return;
                        }
                        else {
                            c.x = -15;
                            c.y = this.roads[5].y + 23;
                            c.d = "e";
                            return;
                        }
                    }
                    c.y += c.s;
                }
                else if (c.d == "w") {
                    //for loops to check for meeting collision and intersection
                    for (var l = 0; l < this.cars.length; l++) {
                        var c2 = this.cars[l];
                        //check collision between cars when facing west
                        var dc = this.distance_check(c, c2, "-x");
                        //dc==true means collision exits
                        if (dc == true) {
                            c.s = 0;
                            for (var k = 0; k < this.intersections_arr.length; k++) {
                                var inter = this.intersections_arr[k];
                                //if the car meets the inter
                                if (inter.y + inter.height > c.y && inter.y < c.y) {
                                    c.s = 0;
                                }
                            }
                        }
                        else {
                            var counter = 0;
                            //for loop to check if the car meets the inter
                            for (var k = 0; k < this.intersections_arr.length; k++) {
                                var inter = this.intersections_arr[k];
                                //true means meets
                                if (this.check_inter(c, inter, "-x")) {
                                    counter++;
                                    //red, stop
                                    if (inter.right == "rgba(255,0,0,0.4)") {
                                        //red
                                        c.s = 0;
                                        this.intersections_arr[k].countEWCars++;
                                    }
                                    else {
                                        //green
                                        c.s = this.globalSpeed;
                                        //figure dir
                                        this.gen_dir(c, inter);
                                    }
                                }
                            }
                            //if its not at intern
                            if (counter == 0) {
                                //car past intersection reset random generator
                                c.dd = false;
                            }
                        }
                    }
                    if (c.x + 26 <= 0) {
                        //reposition car
                        var rand = Math.random();
                        if (pos_rand < 0.1) {
                            c.x = this.w + 25;
                            c.y = this.roads[2].y + 3;
                            c.d = "w";
                        }
                        else if (pos_rand > 0.1 && pos_rand < 0.2) {
                            c.x = this.roads[1].x + 37;
                            c.y = this.h + 15;
                            c.d = "n";
                            return;
                        }
                        else if (pos_rand > 0.2 && pos_rand < 0.3) {
                            c.x = this.roads[0].x + 37;
                            c.y = this.h + 15;
                            c.d = "n";
                            return;
                        }
                        else if (pos_rand > 0.3 && pos_rand < 0.4) {
                            c.x = this.roads[1].x + 15;
                            c.y = -15;
                            c.d = "s";
                            return;
                        }
                        else if (pos_rand > 0.4 && pos_rand < 0.5) {
                            c.x = this.roads[0].x + 15;
                            c.y = -15;
                            c.d = "s";
                            return;
                        }
                        else if (pos_rand > 0.5 && pos_rand < 0.6) {
                            c.x = this.w + 25;
                            c.y = this.roads[3].y + 3;
                            c.d = "w";
                        }
                        else if (pos_rand > 0.6 && pos_rand < 0.7) {
                            c.x = this.w + 25;
                            c.y = this.roads[4].y + 3;
                            c.d = "w";
                        }
                        else if (pos_rand > 0.7 && pos_rand < 0.8) {
                            c.x = this.w + 25;
                            c.y = this.roads[5].y + 3;
                            c.d = "w";
                        }
                        else if (pos_rand > 0.8 && pos_rand < 0.9) {
                            c.x = -15;
                            c.y = this.roads[3].y + 23;
                            c.d = "e";
                            return;
                        }
                        else if (pos_rand > 0.9 && pos_rand < 1) {
                            c.x = -15;
                            c.y = this.roads[2].y + 23;
                            c.d = "e";
                            return;
                        }
                        else {
                            c.x = -15;
                            c.y = this.roads[5].y + 23;
                            c.d = "e";
                            return;
                        }
                    }
                    else if (c.x - 40 <= this.roads[4].x && (c.y == this.roads[4].y + 3 || c.y == this.roads[4].y)) {
                        var rand = Math.random();
                        if (rand >= 0.5) {
                            c.x = this.roads[4].x + 40;
                            c.y = this.roads[4].y + 23;
                            c.d = "e";
                            c.x += c.s;
                            return;
                        }
                        else {
                            c.x = this.roads[0].x + 37;
                            c.d = "n";
                            return;
                        }
                    }
                    c.x -= c.s;
                }
                c.drawCar();
            }
        };
        tMap.prototype.intersections = function () {
            for (var i = 0; i < this.roads.length; i++) {
                var r1 = this.roads[i];
                for (var j = 0; j < this.roads.length; j++) {
                    var r2 = this.roads[j];
                    if (r1.width > r1.height) {
                        if (r2.width < r2.height) {
                            if ((r1.x + r1.width) > r2.x && r1.x <= r2.x) {
                                if ((r2.y + r2.height) >= r1.y && r2.y <= r1.y) {
                                    var roadtop = true;
                                    var roadbottom = true;
                                    var roadleft = true;
                                    var roadright = true;
                                    if (r1.y == r2.y) {
                                        //no intersection top
                                        var roadtop = false;
                                    }
                                    if (r1.x == r2.x) {
                                        //no intersection left
                                        var roadleft = false;
                                    }
                                    if ((r1.x + r1.width) == (r2.x + r2.width)) {
                                        //no intersection right
                                        var roadright = false;
                                    }
                                    if ((r1.y + r1.height) == (r2.y + r2.height)) {
                                        //no intersection top
                                        var roadbottom = false;
                                    }
                                    if (r1.y == 400 && r2.x == 65) {
                                        var roadleft = false;
                                    }
                                    var inter = new drawIntersection(this);
                                    inter.x = r2.x, inter.y = r1.y, inter.width = r2.width, inter.height = r1.height, inter.roadtop = roadtop, inter.roadleft = roadleft, inter.roadright = roadright, inter.roadbottom = roadbottom;
                                    inter.startTime = new Date().getTime();
                                    this.intersections_arr.push(inter);
                                }
                            }
                        }
                    }
                }
            }
        };
        tMap.prototype.animloop = function () {
            var _this = this;
            this.drawscene();
            requestAnimFrame(function () { return _this.animloop(); });
        };
        return tMap;
    }());
    jsLib.tMap = tMap;
    var drawroad = (function () {
        function drawroad(map) {
            this.x = this.x;
            this.y = this.y;
            this.mapRef = map;
            this.width = this.width;
            this.height = this.height;
            this.color = "#605A4C";
            this.ctx = map.ctx;
        }
        drawroad.prototype.drawRoad = function (i) {
            this.x = this.mapRef.roads[i].x;
            this.y = this.mapRef.roads[i].y;
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
            this.ctx.fillStyle = "#A68B44";
            if (this.width < this.height && this.width > 40) {
                this.ctx.fillRect(this.x + ((this.width / 2) - 1), this.y, 2, this.height);
                this.ctx.beginPath();
                this.ctx.setLineDash([2, 5]);
                this.ctx.moveTo(this.x + ((this.width / 4) - 1), this.y);
                this.ctx.lineTo(this.x + ((this.width / 4) - 1), (this.y + this.height));
                this.ctx.closePath();
                this.ctx.strokeStyle = "#A09383";
                this.ctx.lineWidth = 1;
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.setLineDash([2, 5]);
                this.ctx.moveTo(this.x + ((this.width / (4 / 3)) - 1), this.y);
                this.ctx.lineTo(this.x + ((this.width / (4 / 3)) - 1), (this.y + this.height));
                this.ctx.closePath();
                this.ctx.strokeStyle = "#A09383";
                this.ctx.lineWidth = 1;
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x - 10, this.y, 10, this.height);
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x + this.width, this.y, 10, this.height);
            }
            else if (this.width > this.height && this.height > 40) {
                this.ctx.fillRect(this.x, this.y + ((this.height / 2) - 1), this.width, 2);
                this.ctx.beginPath();
                this.ctx.setLineDash([2, 5]);
                this.ctx.moveTo(this.x, this.y + ((this.height / 4) - 1));
                this.ctx.lineTo((this.x + this.width), this.y + ((this.height / 4) - 1));
                this.ctx.closePath();
                this.ctx.strokeStyle = "#A09383";
                this.ctx.lineWidth = 1;
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.setLineDash([2, 5]);
                this.ctx.moveTo(this.x, this.y + ((this.height / (4 / 3)) - 1));
                this.ctx.lineTo((this.x + this.width), this.y + ((this.height / (4 / 3)) - 1));
                this.ctx.closePath();
                this.ctx.strokeStyle = "#A09383";
                this.ctx.lineWidth = 1;
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x, this.y - 10, this.width, 10);
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x, this.y + this.height, this.width, 10);
            }
            else if (this.width > this.height && this.height < 41) {
                this.ctx.fillRect(this.x, this.y + ((this.height / 2) - 1), this.width, 2);
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x, this.y - 10, this.width, 10);
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x, this.y + this.height, this.width, 10);
            }
            else if (this.width < this.height && this.width < 41) {
                this.ctx.fillRect(this.x + ((this.width / 2) - 1), this.y, 2, this.height);
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x - 10, this.y, 10, this.height);
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x + this.width, this.y, 10, this.height);
            }
        };
        return drawroad;
    }());
    jsLib.drawroad = drawroad;
    var drawcar = (function () {
        function drawcar(map) {
            this.x = map.w + 25;
            this.y = map.roads[2].y + 3;
            this.s = 1;
            this.l = 25;
            this.d = "w";
            this.dd = false;
            this.color = "#F5D600";
            this.ctx = map.ctx;
        }
        drawcar.prototype.drawCar = function () {
            this.ctx.fillStyle = this.color;
            if (this.d == "w") {
                this.w = 25;
                this.ctx.fillRect(this.x, this.y, this.l, 12);
                this.ctx.fillStyle = "#99B3CE";
                this.ctx.fillRect(this.x + 5, this.y, 5, 12);
                this.ctx.fillRect(this.x + 18, this.y, 2, 12);
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(this.x + 6, this.y - 2, 2, 2);
                this.ctx.fillRect(this.x + 6, this.y + 12, 2, 2);
            }
            else if (this.d == "e") {
                this.w = 25;
                this.ctx.fillRect(this.x, this.y, this.l, 12);
                this.ctx.fillStyle = "#99B3CE";
                this.ctx.fillRect(this.x + 15, this.y, 5, 12);
                this.ctx.fillRect(this.x + 4, this.y, 2, 12);
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(this.x + 14, this.y - 2, 2, 2);
                this.ctx.fillRect(this.x + 14, this.y + 12, 2, 2);
            }
            else if (this.d == "s") {
                this.w = 12;
                this.ctx.rotate(Math.PI / 2);
                this.ctx.fillRect(this.y, -this.x, this.l, 12);
                this.ctx.fillStyle = "#99B3CE";
                this.ctx.fillRect(this.y + 15, -this.x, 5, 12);
                this.ctx.fillRect(this.y + 4, -this.x, 2, 12);
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(this.y + 14, -this.x - 2, 2, 2);
                this.ctx.fillRect(this.y + 14, -this.x + 12, 2, 2);
                this.ctx.rotate(-Math.PI / 2);
            }
            else {
                this.w = 12;
                this.ctx.rotate(Math.PI / 2);
                this.ctx.fillRect(this.y, -this.x, this.l, 12);
                this.ctx.fillStyle = "#99B3CE";
                this.ctx.fillRect(this.y + 5, -this.x, 5, 12);
                this.ctx.fillRect(this.y + 18, -this.x, 2, 12);
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(this.y + 6, -this.x - 2, 2, 2);
                this.ctx.fillRect(this.y + 6, -this.x + 12, 2, 2);
                this.ctx.rotate(-Math.PI / 2);
            }
        };
        return drawcar;
    }());
    jsLib.drawcar = drawcar;
    var drawIntersection = (function () {
        function drawIntersection(map) {
            this.x = this.x;
            this.y = this.y;
            this.width = this.width;
            this.height = this.height;
            this.roadtop = true;
            this.roadleft = true;
            this.roadbottom = true;
            this.roadright = true;
            this.ctx = map.ctx;
            this.NS = this.NS;
            this.EW = this.EW;
            this.AW = this.AW;
            this.startTime = this.startTime;
        }
        drawIntersection.prototype.leftZebra = function () {
            if (this.roadleft == true) {
                this.ctx.fillStyle = "#605A4C";
                this.ctx.fillRect(this.x - 20, this.y, 20, this.height);
                this.ctx.beginPath();
                this.ctx.setLineDash([1, 5]);
                this.ctx.moveTo(this.x - 12, this.y);
                this.ctx.lineTo(this.x - 12, (this.y + this.height));
                this.ctx.closePath();
                this.ctx.strokeStyle = "#A09383";
                this.ctx.lineWidth = 10;
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x - 22, (this.height / 2) + this.y - 1, 2, (this.height / 2) + 1);
                if (this.height > 40) {
                    this.ctx.fillStyle = "#A09383";
                    this.ctx.fillRect(this.x - 52, (this.height / (4 / 3)) + this.y - 2, 30, 2);
                }
            }
        };
        drawIntersection.prototype.rightZebra = function () {
            if (this.roadright == true) {
                this.ctx.fillStyle = "#605A4C";
                this.ctx.fillRect(this.x + this.width, this.y, 22, this.height);
                this.ctx.beginPath();
                this.ctx.setLineDash([1, 5]);
                this.ctx.moveTo(this.x + this.width + 12, this.y);
                this.ctx.lineTo(this.x + this.width + 12, (this.y + this.height));
                this.ctx.closePath();
                this.ctx.strokeStyle = "#A09383";
                this.ctx.lineWidth = 10;
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x + this.width + 22, this.y, 2, (this.height / 2) + 1);
                if (this.height > 40) {
                    this.ctx.fillStyle = "#A09383";
                    this.ctx.fillRect(this.x + this.width + 22, (this.height / 4) + this.y - 2, 30, 2);
                }
            }
        };
        drawIntersection.prototype.topZebra = function () {
            if (this.roadtop == true) {
                this.ctx.fillStyle = "#605A4C";
                this.ctx.fillRect(this.x, this.y - 20, this.width, 20);
                this.ctx.beginPath();
                this.ctx.setLineDash([1, 5]);
                this.ctx.moveTo(this.x, this.y - 12);
                this.ctx.lineTo((this.x + this.width), this.y - 12);
                this.ctx.closePath();
                this.ctx.strokeStyle = "#A09383";
                this.ctx.lineWidth = 10;
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x, this.y - 21, (this.width / 2) + 1, 2);
                if (this.width > 40) {
                    this.ctx.fillStyle = "#A09383";
                    this.ctx.fillRect(this.x + (this.width / 4) - 2, this.y - 50, 2, 30);
                }
            }
        };
        drawIntersection.prototype.botZebra = function () {
            if (this.roadbottom == true) {
                this.ctx.fillStyle = "#605A4C";
                this.ctx.fillRect(this.x, this.y + this.height, this.width, 20);
                this.ctx.beginPath();
                this.ctx.setLineDash([1, 5]);
                this.ctx.moveTo(this.x, this.y + this.height + 12);
                this.ctx.lineTo((this.x + this.width), this.y + this.height + 12);
                this.ctx.closePath();
                this.ctx.strokeStyle = "#A09383";
                this.ctx.lineWidth = 10;
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.fillStyle = "#A09383";
                this.ctx.fillRect(this.x + this.width - (this.width / 2) - 1, this.y + this.height + 20, (this.width / 2) + 1, 2);
                if (this.width > 40) {
                    this.ctx.fillStyle = "#A09383";
                    this.ctx.fillRect(this.x + (this.width / (4 / 3)) - 2, this.y + this.height + 20, 2, 30);
                }
            }
        };
        drawIntersection.prototype.leftTrafficL = function () {
            this.ctx.save();
            if (this.left == "rgba(0,255,0,0.4)") {
                //green
                var shadow_color = 'rgba(0,255,0,1)';
            }
            else {
                var shadow_color = 'rgba(255,0,0,1)';
            }
            this.ctx.fillStyle = shadow_color;
            this.ctx.shadowColor = shadow_color;
            this.ctx.shadowOffsetX = -2;
            this.ctx.shadowBlur = 2;
            /**
              * Right Traffic Light at Left side
              */
            this.ctx.fillRect(this.x - 3, this.y + this.height - 12, 6, 6);
            this.ctx.fill();
            this.ctx.restore();
            this.ctx.shadowOffsetX = undefined;
            this.ctx.shadowBlur = undefined;
            this.ctx.fillStyle = "#ddd";
            this.ctx.fillRect(this.x - 3, this.y + this.height - (this.height / 2) + 3, 1, (this.height / 2));
        };
        drawIntersection.prototype.rightTrafficL = function () {
            this.ctx.save();
            if (this.right == "rgba(0,255,0,0.4)") {
                //green
                var shadow_color = 'rgba(0,255,0,1)';
            }
            else {
                var shadow_color = 'rgba(255,0,0,1)';
            }
            this.ctx.fillStyle = shadow_color;
            this.ctx.shadowColor = shadow_color;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowBlur = 2;
            /**
              * Left Traffic Light at Right side
              */
            this.ctx.fillRect(this.x + this.width + 2, this.y + 12, 6, 6);
            this.ctx.fill();
            this.ctx.restore();
            this.ctx.shadowOffsetX = undefined;
            this.ctx.shadowBlur = undefined;
            if (this.height > 40) {
                this.ctx.save();
                if (this.right == "rgba(0,255,0,0.4)") {
                    //green
                    var shadow_color = 'rgba(0,255,0,1)';
                }
                else {
                    var shadow_color = 'rgba(255,0,0,1)';
                }
                this.ctx.fillStyle = shadow_color;
                this.ctx.shadowColor = shadow_color;
                this.ctx.shadowOffsetX = 2;
                this.ctx.shadowBlur = 2;
                /**
                  * Right Traffic Light at Right side
                  */
                //this.ctx.fillRect(this.x+this.width+2,this.y+30,6,6);
                this.ctx.fill();
                this.ctx.restore();
                this.ctx.shadowOffsetX = undefined;
                this.ctx.shadowBlur = undefined;
            }
            this.ctx.fillStyle = "#ddd";
            this.ctx.fillRect(this.x + this.width + 2, this.y - 3, 1, (this.height / 2));
        };
        drawIntersection.prototype.topTrafficL = function () {
            this.ctx.save();
            if (this.top == "rgba(0,255,0,0.4)") {
                //green
                var shadow_color = 'rgba(0,255,0,1)';
            }
            else {
                var shadow_color = 'rgba(255,0,0,1)';
            }
            this.ctx.fillStyle = shadow_color;
            this.ctx.shadowColor = shadow_color;
            this.ctx.shadowOffsetY = -2;
            this.ctx.shadowBlur = 2;
            /**
              * Right Traffic Light at Top side
              */
            this.ctx.fillRect(this.x + 4, this.y - 2, 6, 6);
            this.ctx.fill();
            this.ctx.restore();
            this.ctx.shadowOffsetX = undefined;
            this.ctx.shadowBlur = undefined;
            this.ctx.fillStyle = "#ddd";
            this.ctx.fillRect(this.x - 3, this.y - 2, (this.width / 2), 1);
        };
        drawIntersection.prototype.botTrafficL = function () {
            this.ctx.save();
            if (this.bottom == "rgba(0,255,0,0.4)") {
                //green
                var shadow_color = 'rgba(0,255,0,1)';
            }
            else {
                var shadow_color = 'rgba(255,0,0,1)';
            }
            this.ctx.fillStyle = shadow_color;
            this.ctx.shadowColor = shadow_color;
            this.ctx.shadowOffsetY = 2;
            this.ctx.shadowBlur = 2;
            /**
              * Traffic Light on the right at Bottom side
              */
            this.ctx.fillRect(this.x + this.width - 10, this.y + this.height + 2, 6, 6);
            this.ctx.fill();
            this.ctx.restore();
            this.ctx.shadowOffsetX = undefined;
            this.ctx.shadowBlur = undefined;
            if (this.width > 40) {
                this.ctx.save();
                if (this.bottom == "rgba(0,255,0,0.4)") {
                    //green
                    var shadow_color = 'rgba(0,255,0,1)';
                }
                else {
                    var shadow_color = 'rgba(255,0,0,1)';
                }
                this.ctx.fillStyle = shadow_color;
                this.ctx.shadowColor = shadow_color;
                this.ctx.shadowOffsetY = 2;
                this.ctx.shadowBlur = 2;
                /**
                 * Traffic Light on the left at Bottom side
                 */
                this.ctx.fillRect(this.x + this.width - 32, this.y + this.height + 2, 6, 6);
                this.ctx.fill();
                this.ctx.restore();
                this.ctx.shadowOffsetX = undefined;
                this.ctx.shadowBlur = undefined;
            }
            this.ctx.fillStyle = "#ddd";
            this.ctx.fillRect(this.x + (this.width / 2) + 3, this.y + this.height + 2, (this.width / 2), 1);
        };
        drawIntersection.prototype.drawInter = function (index) {
            this.ctx.fillStyle = "#605A4C";
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
            //North-South, red - Left+Right, green - Top+Bot
            if (this.NS == true) {
                this.right = "rgba(255,0,0,0.4)";
                this.left = "rgba(255,0,0,0.4)";
                this.top = "rgba(0,255,0,0.4)";
                this.bottom = "rgba(0,255,0,0.4)";
            }
            else if (this.EW == true) {
                this.top = "rgba(255,0,0,0.4)";
                this.bottom = "rgba(255,0,0,0.4)";
                this.right = "rgba(0,255,0,0.4)";
                this.left = "rgba(0,255,0,0.4)";
            }
            else if (this.AW == true) {
                this.top = "rgba(0,255,0,0.4)";
                this.bottom = "rgba(0,255,0,0.4)";
                this.right = "rgba(0,255,0,0.4)";
                this.left = "rgba(0,255,0,0.4)";
            }
            else {
                this.right = "rgba(255,0,0,0.4)";
                this.left = "rgba(255,0,0,0.4)";
                this.top = "rgba(255,0,0,0.4)";
                this.bottom = "rgba(255,0,0,0.4)";
            }
            //1. traffic lights (left)
            if (this.roadleft == true) {
                //zebra-crossing (left)
                this.leftZebra();
                this.leftTrafficL();
            }
            //2. traffic lights (right)
            if (this.roadright == true) {
                //zebra-crossing (right)
                this.rightZebra();
                this.rightTrafficL();
            }
            //3. traffic lights (top)
            if (this.roadtop == true) {
                //zebra-crossing (top)
                this.topZebra();
                this.topTrafficL();
            }
            //4. traffic lights (bottom)
            if (this.roadbottom == true) {
                //zebra-crossing (bottom)
                this.botZebra();
                this.botTrafficL();
            }
            var interName = index;
            this.ctx.fillStyle = "white";
            this.ctx.font = "15px serif";
            this.ctx.fillText(interName, this.x + this.width * 2 / 3, this.y + this.height / 3);
            if (this.top == "rgba(0,255,0,0.4)") {
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = '#000000';
                var interMidX = this.x + this.width / 2;
                var interMidY = this.y + this.height / 2;
                this.ctx.setLineDash([]);
                this.ctx.beginPath();
                this.ctx.moveTo(interMidX, interMidY);
                this.ctx.lineTo(interMidX, interMidY - this.height / 4);
                this.ctx.lineTo(interMidX - this.height / 12, interMidY - this.height / 6);
                this.ctx.moveTo(interMidX, interMidY - this.height / 4);
                this.ctx.lineTo(interMidX + this.height / 12, interMidY - this.height / 6);
                this.ctx.moveTo(interMidX, interMidX);
                this.ctx.closePath();
                this.ctx.stroke();
            }
            if (this.bottom == "rgba(0,255,0,0.4)") {
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = '#000000';
                var interMidX = this.x + this.width / 2;
                var interMidY = this.y + this.height / 2;
                this.ctx.setLineDash([]);
                this.ctx.beginPath();
                this.ctx.moveTo(interMidX, interMidY);
                this.ctx.lineTo(interMidX, interMidY + this.height / 4);
                this.ctx.lineTo(interMidX - this.height / 12, interMidY + this.height / 6);
                this.ctx.moveTo(interMidX, interMidY + this.height / 4);
                this.ctx.lineTo(interMidX + this.height / 12, interMidY + this.height / 6);
                this.ctx.moveTo(interMidX, interMidX);
                this.ctx.closePath();
                this.ctx.stroke();
            }
            if (this.left == "rgba(0,255,0,0.4)") {
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = '#000000';
                var interMidX = this.x + this.width / 2;
                var interMidY = this.y + this.height / 2;
                this.ctx.setLineDash([]);
                this.ctx.beginPath();
                this.ctx.moveTo(interMidX, interMidY);
                this.ctx.lineTo(interMidX - this.height / 4, interMidY);
                this.ctx.lineTo(interMidX - this.height / 4 + this.height / 12, interMidY - this.height / 12);
                this.ctx.moveTo(interMidX - this.height / 4, interMidY);
                this.ctx.lineTo(interMidX - this.height / 4 + this.height / 12, interMidY + this.height / 12);
                this.ctx.closePath();
                this.ctx.stroke();
            }
            if (this.right == "rgba(0,255,0,0.4)") {
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = '#000000';
                var interMidX = this.x + this.width / 2;
                var interMidY = this.y + this.height / 2;
                this.ctx.setLineDash([]);
                this.ctx.beginPath();
                this.ctx.moveTo(interMidX, interMidY);
                this.ctx.lineTo(interMidX + this.height / 4, interMidY);
                this.ctx.lineTo(interMidX + this.height / 4 - this.height / 12, interMidY - this.height / 12);
                this.ctx.moveTo(interMidX + this.height / 4, interMidY);
                this.ctx.lineTo(interMidX + this.height / 4 - this.height / 12, interMidY + this.height / 12);
                this.ctx.closePath();
                this.ctx.stroke();
            }
        };
        return drawIntersection;
    }());
    jsLib.drawIntersection = drawIntersection;
})(jsLib || (jsLib = {}));
