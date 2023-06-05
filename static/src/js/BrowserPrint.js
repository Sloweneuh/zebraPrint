odoo.define('zebraPrint.browserprint', function (require) {
    var BrowserPrint = function () {
        function g(a, d) {
        var c = new XMLHttpRequest();
        if ("withCredentials" in c) {
            c.open(a, d, !0);
        } else if (typeof XDomainRequest !== "undefined") {
            c = new XDomainRequest();
            c.open(a, d);
        } else {
            c = null;
        }
        return c;
        }
    
        function h(a, d, c, b) {
        if (a !== undefined) {
            if (c === undefined) {
            c = a.sendFinishedCallback;
            }
            if (b === undefined) {
            b = a.sendErrorCallback;
            }
        }
    
        d.onreadystatechange = function () {
            if (d.readyState === XMLHttpRequest.DONE && d.status === 200) {
            c(d.responseText);
            } else if (d.readyState === XMLHttpRequest.DONE) {
            if (b) {
                b(d.responseText);
            } else {
                console.log("error occurred with no errorCallback set.");
            }
            }
        };
    
        return d;
        }
    
        var e = {};
        var k = {};
        var f = "http://127.0.0.1:9100/";
    
        if (navigator.userAgent.indexOf("Trident/7.0") >= 0 && location.protocol === "https:") {
        f = "https://localhost:9101/";
        }
    
        e.Device = function (a) {
        var d = this;
        this.name = a.name;
        this.deviceType = a.deviceType;
        this.connection = a.connection;
        this.uid = a.uid;
        this.version = 2;
        this.provider = a.provider;
        this.manufacturer = a.manufacturer;
        this.sendErrorCallback = function (c) {};
        this.sendFinishedCallback = function (c) {};
    
        this.send = function (c, a, l) {
            var b = g("POST", f + "write");
            if (b) {
            h(d, b, a, l);
            b.send(JSON.stringify({
                device: {
                name: this.name,
                uid: this.uid,
                connection: this.connection,
                deviceType: this.deviceType,
                version: this.version,
                provider: this.provider,
                manufacturer: this.manufacturer
                },
                data: c
            }));
            }
        };
    
        this.sendUrl = function (c, a, l) {
            var b = g("POST", f + "write");
            if (b) {
            h(d, b, a, l);
            b.send(JSON.stringify({
                device: {
                name: this.name,
                uid: this.uid,
                connection: this.connection,
                deviceType: this.deviceType,
                version: this.version,
                provider: this.provider,
                manufacturer: this.manufacturer
                },
                url: c
            }));
            }
        };
    
        this.readErrorCallback = function (c) {};
        this.readFinishedCallback = function (c) {};
    
        this.read = function (c, a) {
            var b = g("POST", f + "read");
            if (b) {
            h(d, b, c, a);
            b.send(JSON.stringify({
                device: {
                name: this.name,
                uid: this.uid,
                connection: this.connection,
                deviceType: this.deviceType,
                version: this.version,
                provider: this.provider,
                manufacturer: this.manufacturer
                }
            }));
            }
        };
    
        this.sendThenRead = function (a, b, d) {
            this.send(a, function (a) {
            return function () {
                a.read(b, d);
            };
            }(this), d);
        };
        };
    
        e.ApplicationConfiguration = function () {
        this.application = {
            version: "1.2.0.3",
            build_number: 3,
            api_level: 2,
            platform: ""
        };
        };
    
        e.getLocalDevices = function (a, d, c) {
        var b = g("GET", f + "available");
        if (b) {
            finishedFunction = function (b) {
            response = b;
            response = JSON.parse(response);
            for (var d in response) {
                if (response.hasOwnProperty(d) && response[d].constructor === Array) {
                var arr = response[d];
                for (var b = 0; b < arr.length; ++b) {
                    arr[b] = new e.Device(arr[b]);
                }
                }
            }
            if (c === undefined) {
                a(response);
            } else {
                if (!response.hasOwnProperty(c)) {
                response[c] = [];
                }
                a(response[c]);
            }
            };
            h(undefined, b, finishedFunction, d);
            b.send();
        }
        };
    
        e.getDefaultDevice = function (a, d, c) {
        var b = "default";
        if (a !== undefined && a !== null) {
            b = b + "?type=" + a;
        }
        if (a = g("GET", f + b)) {
            finishedFunction = function (a) {
            response = a;
            if (response === "") {
                d(null);
            } else {
                response = JSON.parse(response);
                a = new e.Device(response);
                d(a);
            }
            };
            a = h(undefined, a, finishedFunction, c);
            a.send();
        }
        };
    
        e.getApplicationConfiguration = function (a, d) {
        var c = g("GET", f + "config");
        if (c) {
            finishedFunction = function (b) {
            response = b;
            if (response === "") {
                a(null);
            } else {
                response = JSON.parse(response);
                a(response);
            }
            };
            h(undefined, c, finishedFunction, d);
            c.send();
        }
        };
    
        e.readOnInterval = function (a, d, c) {
        if (c === undefined || c === 0) {
            c = 1;
        }
        readFunc = function () {
            a.read(function (b) {
            d(b);
            k[a] = setTimeout(readFunc, c);
            }, function (b) {
            k[a] = setTimeout(readFunc, c);
            });
        };
        k[a] = setTimeout(readFunc, c);
        };
    
        e.stopReadOnInterval = function (a) {
        if (k[a]) {
            clearTimeout(k[a]);
        }
        };
    
        e.bindFieldToReadData = function (a, d, c, b) {
        e.readOnInterval(a, function (a) {
            if (a !== "") {
            d.value = a;
            if (b !== undefined && b !== null) {
                b();
            }
            }
        }, c);
        };
    
        return e;
    }();
        return BrowserPrint;
});