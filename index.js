/*! Siger's Script - 2020-02-17
* https://siger.win
*/

var SIGER = {

    focusTextToEnd: function(element){
        let v = element.value;
        element.focus();
        element.value = '';
        element.value = v;
    },

    editInLine: function(element, callback){
        if (!element.querySelector('input')){
            let t = element.textContent;
            let $input = document.createElement('input');
            $input.setAttribute('style', 'padding:2px 6px;margin:0px;width:90%');
            $input.setAttribute('class', 'editInLine');
            $input.setAttribute('value', t);
            element.innerHTML = '';
            element.appendChild($input);
            SIGER.focusTextToEnd($input);
            $input.addEventListener('keyup', function(event){
                let keycode = event.keyCode || event.which;

                let v = this.value;
                if (keycode === 13) {
                    if (callback && t !== v){
                        t = v;element.textContent = v;
                        callback(element, v);
                    } else {
                        element.textContent = v;
                    }
                }
            });
            $input.addEventListener('blur', function(event){
                let v = this.value;
                element.textContent = v;
                if (callback && t !== v)
                    callback(element, v);
            });
        }
    },

    /*
    * SIGER.array_flip(): Troca a chave por valor de um Object ou Array
    *
    *  Exemplo:
    *    let obj = {author:'misteregis',mark:'Siger'};
    *    let obj_flip = array_flip(obj);
    *
    * Resultado:
    *    obj_flip = {"misteregis x": "author", siger: "mark"}
    *
    */
    array_flip: function($array){
        return flipped = Object.keys($array)
            .filter($array.hasOwnProperty.bind($array))
            .reduce(function(obj, key) {
                obj[$array[key].toLowerCase()] = key;
                return obj;
            }, {});
    },

    /*
    * SIGER.in_array(): Verifica se uma chave existe num array
    *
    *  Exemplo:
    *    let arr = ['account disabled','welcome','dialog-login','dialog-view','close'];
    *    let exists1 = in_array('welcome', arr);
    *    let exists2 = in_array('welCOME', arr);
    *
    * Resultado:
    *    exists1 = true
    *    exists2 = false
    *
    */
    in_array: function($needle, $haystack){return $haystack.indexOf($needle) > -1},

    /*
    * SIGER.remove(): Remove um elemento de um Object ou Array pela chave
    *
    *  Exemplo:
    *    let obj = {author:'misteregis',mark:'Siger'};
    *    let arr = ['misteregis', 'Siger'];
    *    obj = remove(obj, 'mark');
    *    arr = remove(arr, 'Siger');
    *
    * Resultado:
    *    obj = {author:"misteregis"}
    *    arr = ["misteregis"]
    *
    */
    remove: function(obj, key){
        if (Array.isArray(obj))
            obj.splice(key, 1);
        else if (obj != null && typeof obj == 'object')
            delete obj[key];
        return obj;
    },

    /*
    * SIGER.toDay(): Obtém a date de hoje por extenso
    *
    *  Exemplo:
    *    toDay()
    *
    * Resultado:
    *    Niterói, 12 de janeiro de 2020
    *
    */
    toDay: function(){
        let today = new Date(),
            dd = today.getDate(),
            month = today.toLocaleString('pt-BR', { month: 'long' }),
            yyyy = today.getFullYear();

        return 'Niterói, {0} de {1} de {2}'.format(dd, month, yyyy);
    },

    /*
    * SIGER.dateObj(): Objeto contendo o dia, mês, ano, hora, minuto e segundos atual
    *
    *  Exemplo:
    *    let d_obj = dateObj();
    *    let ano = d_obj.year;
    *    let dia = d_obj['month'];
    *    let minuto = dateObj('minute');
    *
    * Resultado:
    *    d_obj = {year: 2020, month: {number: "01", name: "janeiro"}, day: 12, hour: 12, minute: 24,second: 26}
    *    ano = 2020
    *    dia = 12
    *    minuto = 24
    *
    */
    dateObj: function(key, key2, rKey){
        let d = new Date();

        if (key && !isNaN(key)) {
            if (key.toString().length === 10 || key.toString().length === 13) {
                if (key.toString().length === 10)
                    key = new Date(key * 1000);
                else
                    key = new Date(key);
            }
        }

        if (key instanceof Date) {
            d = key;
            if (key2) {
                key = key2;
                key2 = null;
            }
        }

        if (key === 'timestamp')
            return Math.floor(d.getTime()/1000);

        if (key === 'today')
            d.setHours(0,0,0,0);

        if (key === 'yesterday')
            d.setDate(d.getDate() - 1);

        if (key === 'sevenday')
            d.setDate(d.getDate() - 7);

        let year = d.getFullYear(),
            month = d.getMonth()+1,
            day = d.getDate(),
            hour = d.getHours().zeroPad(2),
            minute = d.getMinutes().zeroPad(2),
            second = d.getSeconds().zeroPad(2),
            weekday = d.getDay();

        

        let longmonth = d.toLocaleString('pt-BR', { month: 'long' });
        let longweekday = d.toLocaleString('pt-BR', { weekday: 'long' });

        if (month<10)
            month='0'+month;

        let obj = {timestamp: Math.floor(d.getTime()/1000), year: year, day: day, hour: hour, minute: minute, second: second};
        obj.fulldate = year+month+day+hour+minute+second;
        obj.weekday = {number: weekday, name: longweekday};
        obj.month = {number: month, name: longmonth};
        obj.date = d;

        if (typeof key == 'string' && key2)
            return this.dateObj(d, key2, key);

        if (obj.hasOwnProperty(rKey))
            return obj[rKey];

        if (obj.hasOwnProperty(key))
            return obj[key];

        if (key === 'obj' || rKey === 'obj')
            return obj;

        return d;
    },

    /*
    * SIGER.formatDate(): Formata data e hora apartir do timestamp
    */
    formatDate: function($timestamp, $extend, $toLower, $short){
        let defaults = {timestamp:null,extend:false,toLower:false,short:false};
        let s = {};

        if (typeof $timestamp === 'object')
            s = Object.assign(defaults, $timestamp);
        else
            s = Object.assign(defaults, {
                timestamp: $timestamp,
                toLower: $toLower,
                extend: $extend,
                short: $short
            });

        if (!s.timestamp) return;

        let $dd = SIGER.dateObj(s.timestamp, 'obj');
            $t = $dd.hour+':'+$dd.minute,
            $w = $dd.weekday.name.split('-')[0],
            $m = $dd.month.name,
            $y = $dd.year,
            $d = $dd.day,
            $r = '';

        let $month = ($y === SIGER.dateObj() && $m === SIGER.dateObj().month.name) ? '' : ' de ' + $m,
            $year = $y === SIGER.dateObj().year ? '' : ' de ' + $y,
            sdate = new Date(),
            ydate = new Date();

        let $sevendayTimestamp = SIGER.dateObj('sevenday', 'timestamp'),
            $yesterdayTimestamp = SIGER.dateObj('yesterday', 'timestamp'),
            $today = SIGER.dateObj('obj', 'today'), $now = SIGER.dateObj('obj'),
            $todayTimestamp = $today.timestamp;

        if (s.timestamp > $sevendayTimestamp) {
            $r = $w + ', dia ' + $d + $month + $year + ' às ' + $t;
        } else {
            $r = 'Dia ' + $d + $month + $year + ' às ' + $t;
        }

        let seconds = Math.round(($now.date - $dd.date) / 1000),
            minutes = Math.round(seconds / 60);

        if (seconds < 5)
            return 'agora'
        else if (seconds < 60)
            return '{0} segundos atrás'.format(seconds)
        else if (seconds < 90)
            return 'cerca de um minuto atrás'
        else if (minutes < 60)
            return '{0} minutos atrás'.format(minutes)
        else if (minutes < 61)
            return 'Uma hora atrás'.format(minutes)

        if (!s.extend && s.timestamp >= $todayTimestamp)
            $r = 'Hoje às ' + $t;
        else if (!s.extend && s.timestamp >= $yesterdayTimestamp)
            $r = 'Ontem às ' + $t;

        if (s.short) {
            $r = $d.zeroPad(2) + '/' + $dd.month.number + '/' + $y + ' ' + $t;
            
            if (s.timestamp >= $todayTimestamp)
                $r = 'Hoje às ' + $t;
            else if (s.timestamp >= $yesterdayTimestamp)
                $r = 'Ontem às ' + $t;
        }

        return s.toLower ? $r.toLowerCase() : $r.capitalize();
    },

    /*
    * SIGER.loadJSON(): Carrega objeto JSON via URL
    *
    *  Exemplo:
    *    file.json = {author:'misteregis',mark:'Siger'};
    *    loadJSON('file.json', function(json){console.log(json)});
    *
    * Resultado:
    *    console: {author:'misteregis',mark:'Siger'}
    *
    */
    loadJSON: function(path, success, error){
        let r = Math.floor(Math.random() * 99999) + 1;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (success)
                        success(JSON.parse(xhr.responseText));
                } else {
                    if (error)
                        error(xhr.statusText);
                }
            }
        };

        xhr.open("GET", path + '?r=' + r, true);
        xhr.send();
    },

    /*
    * SIGER.is_numeric(): Verifica se um valor é numéricou ou não, retornando true/false
    *
    *  Exemplo:
    *    is_numeric(123456)
    *    is_numeric("123456")
    *    is_numeric("A123456")
    *
    * Resultado:
    *    123456: true
    *    "123456": true
    *    "A123456": false
    *
    */
    is_numeric: function(n) {return !isNaN(parseFloat(n)) && isFinite(n)},

    /*
    * SIGER.JSON.clone(): Clonar objeto (JSON)
    *
    *  Exemplo:
    *    let obj = {author:'misteregis',mark:'Siger'}; [contém as chaves (author e mark) e os valores (misteregis e Siger)]
    *    let novo_obj = {}; [objeto vazio];
    *
    *    novo_obj = JSON.clone(obj);
    *
    * Resultado:
    *    novo_obj = {author:'misteregis',mark:'Siger'}; [contém as chaves (author e mark) e os valores (misteregis e Siger)]
    *
    */
    JSON: {
        clone: function(obj){
            return JSON.parse(JSON.stringify(obj));
        }
    },

    /*
    * SIGER.merge(): Junta dois ou mais array ou json object em um
    *
    *  Exemplo:
    *    let objA = {author:'misteregis',mark:'Siger'};
    *    let objB = {year:'2020',by:'Siger'};
    *    let objC = {windows:10,x:'x64'};
    *
    *    objAB = SIGER.merge(objA, objB);
    *    objABC = SIGER.merge(objA, objB, objC);
    *
    * Resultado:
    *    objAB = {author: "misteregis", mark: "Siger", year: "2020", by: "Siger"};
    *    objABC = {author: "misteregis", mark: "Siger", year: "2020", by: "Siger", windows: 10, x: "x64"};
    *
    */
    /*mixin: function(obj, merge) {
        for (var key in merge) {
            obj[key] = merge[key];
        }
        return obj;
    }*/
    merge: function() {
        let obj = arguments[0] || null;
        if (arguments.length > 1)
            for(var i = 1; i < arguments.length; i++)
                for (var key in arguments[i])
                    obj[key] = arguments[i][key];
        return obj;
    },

    /*
    * String.format(): Formatar texto
    *
    *  Exemplo:
    *    'Meu nome é {0}, eu moro em {1}, trabalho na {2}.'.format('Reginaldo', 'Niterói', 'SMF');
    *
    * Resultado:
    *    'Meu nome é Reginaldo, eu moro em Niterói, trabalho na SMF.'
    *
    */
    _format: function(str, args){
        return str.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
            ;
        });
    },

    /*
    * String.capitalize(): Primeira letra maiúscula
    *
    *  Exemplo:
    *    'misteregis'.capitalize();
    *    'SIGER'.capitalize();
    *
    * Resultado:
    *    'Misteregis'
    *    'Siger'
    *
    */
    _capitalize: function(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    shortcut: {
        all: {},//All the shortcuts are stored in this array
        add: function(shortcut_combination, callback, opt) {
            //Provide a set of default options
            var default_options = {
                'type':'keydown',
                'propagate':false,
                'disable_in_input':false,
                'target':document,
                'keycode':false
            }
        
            opt = Object.assign(default_options, opt);
        
            var ele = opt.target;
            if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
        
            shortcut_combination = shortcut_combination.replace('-','+').toLowerCase().split(/[\s]+/);
        
            if (shortcut_combination.length > 1) {
                for(var i = 0; k = shortcut_combination[i], i < shortcut_combination.length; i++)
                    this.add(k, callback, opt);
                return;
            } else {
                shortcut_combination = shortcut_combination[0];
            }
        
            //The function to be called at keypress
            var func = function(e) {
                e = e || window.event;
            
                if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
                    var element;
                    if(e.target) element=e.target;
                    else if(e.srcElement) element=e.srcElement;
                    if(element.nodeType==3) element=element.parentNode;
            
                    if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
                }
            
                //Find Which key is pressed
                if (e.keyCode) code = e.keyCode;
                else if (e.which) code = e.which;
                if (typeof code === 'undefined') return;
                var character = String.fromCharCode(code).toLowerCase();
            
                if(code == 188) character=","; //If the user presses , when the type is onkeydown
                if(code == 190) character="."; //If the user presses , when the type is onkeydown
            
                var keys = shortcut_combination.split("+");
                //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
                var kp = 0;
            
                //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
                var shift_nums = {
                    "`":"~", "1":"!", "2":"@",
                    "3":"#", "4":"$", "5":"%",
                    "6":"^", "7":"&", "8":"*",
                    "9":"(", "0":")", "-":"_",
                    "=":"+", ";":":", "'":"\"",
                    ",":"<", ".":">", "/":"?", "\\":"|"
                }
                //Special Keys - and their codes
                var special_keys = {
                    'esc':27, 'escape':27, 'tab':9,
                    'space':32, 'return':13, 'enter':13, 'backspace':8,
                
                    'scrolllock':145, 'scroll_lock':145, 'scroll':145,
                    'capslock':20, 'caps_lock':20, 'caps':20,
                    'numlock':144, 'num_lock':144, 'num':144,
                
                    'pause':19, 'break':19,
                
                    'insert':45, 'home':36,
                    'delete':46, 'end':35,
                
                    'pageup':33, 'page_up':33, 'pu':33,
                
                    'pagedown':34, 'page_down':34, 'pd':34,
                
                    'left':37, 'up':38, 'right':39, 'down':40,
                
                    'f1':112, 'f2':113, 'f3':114,
                    'f4':115, 'f5':116, 'f6':117,
                    'f7':118, 'f8':119, 'f9':120,
                    'f10':121, 'f11':122, 'f12':123,
                
                    'minus':109,'sminus':189,
                    'plus':107,'splus':187
                }
            
                var modifiers = { 
                    shift: { wanted:false, pressed:false},
                    ctrl : { wanted:false, pressed:false},
                    alt  : { wanted:false, pressed:false},
                    meta : { wanted:false, pressed:false}    //Meta is Mac specific
                };
            
                if(e.ctrlKey)    modifiers.ctrl.pressed = true;
                if(e.shiftKey)    modifiers.shift.pressed = true;
                if(e.altKey)    modifiers.alt.pressed = true;
                if(e.metaKey)   modifiers.meta.pressed = true;
            
                for(var i=0; k=keys[i],i<keys.length; i++) {
                    //Modifiers
                    if(k == 'ctrl' || k == 'control') {
                        kp++;
                        modifiers.ctrl.wanted = true;
                    } else if(k == 'shift') {
                        kp++;
                        modifiers.shift.wanted = true;
                    } else if(k == 'alt') {
                        kp++;
                        modifiers.alt.wanted = true;
                    } else if(k == 'meta') {
                        kp++;
                        modifiers.meta.wanted = true;
                    } else if(k.length > 1) { //If it is a special key
                        if(special_keys[k] == code || special_keys['s'+k] == code) kp++;
                    } else if(opt['keycode']) {
                        if(opt['keycode'] == code) kp++;
                    } else { //The special keys did not match
                        if(character == k) kp++;
                        else {
                            if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
                                character = shift_nums[character]; 
                                if(character == k) kp++;
                            }
                        }
                    }
                }
            
                if(kp == keys.length && 
                            modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
                            modifiers.shift.pressed == modifiers.shift.wanted &&
                            modifiers.alt.pressed == modifiers.alt.wanted &&
                            modifiers.meta.pressed == modifiers.meta.wanted) {
                    callback(e);
                            
                    if(!opt['propagate']) { //Stop the event
                        //e.cancelBubble is supported by IE - this will kill the bubbling process.
                        e.cancelBubble = true;
                        e.returnValue = false;
                    
                        //e.stopPropagation works in Firefox.
                        if (e.stopPropagation) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        return false;
                    }
                }
            }
            this.all[shortcut_combination] = {
                'callback':func, 
                'target':ele, 
                'event': opt['type']
            };
            //Attach the function with the event
            if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
            else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
            else ele['on'+opt['type']] = func;
        },
    
        //Remove the shortcut - just specify the shortcut and I will remove the binding
        remove: function(shortcut_combination) {
            shortcut_combination = shortcut_combination.replace('-','+').toLowerCase().split(/[\s]+/);
            if (shortcut_combination.length > 1) {
                for(var i = 0; k = shortcut_combination[i], i < shortcut_combination.length; i++)
                    this.remove(k);
                return;
            } else {
                shortcut_combination = shortcut_combination[0];
            }
            var binding = this.all[shortcut_combination];
            delete(this.all[shortcut_combination])
            if(!binding) return;
            var type = binding['event'];
            var ele = binding['target'];
            var callback = binding['callback'];
        
            if(ele.detachEvent) ele.detachEvent('on'+type, callback);
            else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
            else ele['on'+type] = false;
        },
    
        //Remove all shortcut - without specify the shortcut and I will remove the bindings
        removeAll: function(shortcut_combination) {for(k in this.all)this.remove(k)}
    }
}

if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target) {
            'use strict';
            if (target === undefined || target === null)
                throw new TypeError('Cannot convert first argument to object');
            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null)
                    continue;
                nextSource = Object(nextSource);
                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                            to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length > targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length)
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

if (!String.prototype.capitalize) {
    String.prototype.capitalize = function() {
        return SIGER._capitalize(this.toLowerCase());
    };
}

if (!String.prototype.format) {
    String.prototype.format = function() {
        let args = arguments;
        return SIGER._format(this, args);
    }
}

if (!Number.prototype.zeroPad) {
    Number.prototype.zeroPad = function(length, add) {
        return this.toString().padStart(length||4, add||"0");
    }
}

if (!String.prototype.zeroPad) {
    String.prototype.zeroPad = function(length, add) {
        return this.padStart(length||4, add||"0");
    }
}

module.exports = SIGER;
