/**
 * Created by Vlad-PC on 19.11.2016.
 */
(function() {

    var timeout = window.setTimeout;
    window.setTimeout = newSetTime();
    function newSetTime() {
        //var tmp = 1;
        return function(delay, callback) {
            var unboundSlice = Array.prototype.slice;
            var slice = Function.prototype.call.bind(unboundSlice);
            if (typeof callback === 'function') {
                timeout(function() {
                    callback.call(this, slice);
                }, delay);
            } else if (typeof callback === 'string') {
                timeout(function() {
                    eval(callback);
                }, delay);
            }
          //  return tmp++;
        };
    }

    var timeout = window.setInterval;
    window.setInterval = newSetInt();
    function newSetInt() {
        //var tmp = 1;
        return function(delay, callback) {
            var unboundSlice = Array.prototype.slice;
            var slice = Function.prototype.call.bind(unboundSlice);
            if (typeof callback === 'function') {
                setTimeout(delay, function loop() {
                    callback.call(this, slice);
                }, setTimeout(delay,loop));
            } else if (typeof callback === 'string') {
                setTimeout(delay, function loop() {
                    eval(callback);
                }, setTimeout(delay),loop);
            }
            //  return tmp++;
        };
    }

    function fncToDelay (param) {
        console.log('Delayed run : ' + param);
    }

    function freeze (delay, fnc) {

        var timeout;
        var tmp = [];

        return function () {

            tmp.push(arguments);

            if(timeout){
                clearTimeout(timeout);
            }

            timeout = setTimeout(delay, function () {
                fnc.apply(this, tmp[0]);
            });
        }
    }

    var frozenFunc = freeze(1000, fncToDelay);

     frozenFunc('1');
     frozenFunc('2');
     frozenFunc('3');
     frozenFunc('4');
     frozenFunc('5');
     frozenFunc('6');
     frozenFunc('7');
     frozenFunc('8');
     frozenFunc('9');


    function createPipe(originalFnc, funcFiltArr) {

        return function (string) {
            var tmp;
            for (var i = 0; i < funcFiltArr.length; i++) {

                tmp = funcFiltArr[i](string);
            }

            originalFnc(string);
        }
    }

    function originalFnc (string) {

        var result = string.charAt(0).toUpperCase() + string.substr(1);
        console.log(result);
    }

    function filterDigits (string) {

        return string.replace(/\d + /g, '');
    }

    function filterSpecial (string) {

        return string.replace(/[!@#$%^&*()+=]/g,'');
    }

    function filterWhiteSpaces (string) {



        return string.replace(/\s + /g, ' ');
    }

    var pipe = createPipe(originalFnc, [filterDigits, filterSpecial, filterWhiteSpaces]);

    pipe('on345l90y    te**x((((t     h$&er@@@e'); // logs 'Only Text Here'
})();