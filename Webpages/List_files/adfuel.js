/*!
 AdFuel v1.2.4
 - Enhancement: Div-to-Slot Mapping
 - Enhancement: Configurable Refresh Correlator
 - Fix: JSON URL Rewriting
!*/

// Include Polyfills
(function IncludePolyfills() {
    ! function(t) {
        "use strict";

        function n() { return a && a.call(c) || (new Date).getTime() }
        var o = [],
            e = {},
            r = {},
            i = function() {},
            u = "-----";
        u += u, u += u, u += u, u += u;
        var f = "\n\n\n\n\n\n",
            c = window.performance,
            a = c && (c.now || c.mozNow || c.msNow || c.oNow || c.webkitNow);
        t.log && "function" == typeof t.log || (t.log = i), t.profile && "function" == typeof t.profile || (t.profile = i), t.profileEnd && "function" == typeof t.profileEnd || (t.profileEnd = i), t.timeStamp && "function" == typeof t.timeStamp || (t.timeStamp = i), t.trace && "function" == typeof t.trace || (t.trace = i), t.debug && "function" == typeof t.debug || (t.debug = t.log), t.info && "function" == typeof t.info || (t.info = t.log), t.warn && "function" == typeof t.warn || (t.warn = t.log), t.error && "function" == typeof t.error || (t.error = t.log), t.dir && "function" == typeof t.dir || (t.dir = t.log), t.dirxml && "function" == typeof t.dirxml || (t.dirxml = t.dir);
        var l = !1;
        (l || !t.group) && (t.group = function(n) { o.push(n), t.log(u + "\nBEGIN GROUP: " + n) }), (l || !t.groupCollapsed) && (t.groupCollapsed = t.group), (l || !t.groupEnd) && (t.groupEnd = function() { t.log("END GROUP: " + o.pop() + "\n" + u) }), (l || !t.time) && (t.time = function(t) { e[t] = n() }), (l || !t.timeEnd) && (t.timeEnd = function(o) { t.log(o + ": " + (n() - e[o]).toFixed(3) + "ms"), delete e[o] }), (l || !t.assert) && (t.assert = function(n, o) { n || t.error("Assertion failed: " + o) }), (l || !t.count) && (t.count = function(n) { r[n] || (r[n] = 0), r[n]++, t.log(n + ": " + r[n]) }), (l || !t.clear) && (t.clear = function() { t.log(f) })
    }(window.console = window.console || {}),
    function() {
        function t(t, n) { n = n || { bubbles: !1, cancelable: !1, detail: void 0 }; var o = document.createEvent("CustomEvent"); return o.initCustomEvent(t, n.bubbles, n.cancelable, n.detail), o }
        return "function" == typeof window.CustomEvent ? !1 : (t.prototype = window.Event.prototype, void(window.CustomEvent = t))
    }(), !window.addEventListener && function(t, n, o, e, r, i, u) {
        t[e] = n[e] = o[e] = function(t, n) {
            var o = this;
            u.unshift([o, t, n, function(t) { t.currentTarget = o, t.preventDefault = function() { t.returnValue = !1 }, t.stopPropagation = function() { t.cancelBubble = !0 }, t.target = t.srcElement || o, n.call(o, t) }]), this.attachEvent("on" + t, u[0][3])
        }, t[r] = n[r] = o[r] = function(t, n) {
            for (var o, e = 0; o = u[e]; ++e)
                if (o[0] == this && o[1] == t && o[2] == n) return this.detachEvent("on" + t, u.splice(e, 1)[0][3])
        }, t[i] = n[i] = o[i] = function(t) { return this.fireEvent("on" + t.type, t) }
    }(window.prototype, document.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []), Array.prototype.indexOf || (Array.prototype.indexOf = function(t, n) {
        var o;
        if (null === this) throw new TypeError('"this" is null or not defined');
        var e = Object(this),
            r = e.length >>> 0;
        if (0 === r) return -1;
        var i = +n || 0;
        if (Math.abs(i) === 1 / 0 && (i = 0), i >= r) return -1;
        for (o = Math.max(i >= 0 ? i : r - Math.abs(i), 0); r > o;) {
            if (o in e && e[o] === t) return o;
            o++
        }
        return -1
    }), Array.isArray || (Array.isArray = function(t) { return "[object Array]" === Object.prototype.toString.call(t) });
})();

// Include GPT Library
(function IncludeGPT() {
    "use strict";
    var a = document,
        b = a.createElement("script"),
        c = a.getElementsByTagName("script")[0],
        d = "https:" === document.location.protocol;
    b.type = "text/javascript", b.src = (d ? "https:" : "http:") + "//www.googletagservices.com/tag/js/gpt.js", c.parentNode.insertBefore(b, c);
})();

// Include Async Library
(function IncludeAsync() {
    //async
    //https://github.com/caolan/async
    ! function() {
        function n() {}

        function t(n) { return n }

        function e(n) { return !!n }

        function r(n) { return !n }

        function u(n) {
            return function() {
                if (null === n) throw new Error("Callback was already called.");
                n.apply(this, arguments), n = null
            }
        }

        function i(n) { return function() { null !== n && (n.apply(this, arguments), n = null) } }

        function o(n) { return M(n) || "number" == typeof n.length && n.length >= 0 && n.length % 1 === 0 }

        function c(n, t) { for (var e = -1, r = n.length; ++e < r;) t(n[e], e, n) }

        function a(n, t) { for (var e = -1, r = n.length, u = Array(r); ++e < r;) u[e] = t(n[e], e, n); return u }

        function f(n) { return a(Array(n), function(n, t) { return t }) }

        function l(n, t, e) { return c(n, function(n, r, u) { e = t(e, n, r, u) }), e }

        function s(n, t) { c(W(n), function(e) { t(n[e], e) }) }

        function p(n, t) {
            for (var e = 0; e < n.length; e++)
                if (n[e] === t) return e;
            return -1
        }

        function h(n) { var t, e, r = -1; return o(n) ? (t = n.length, function() { return r++, t > r ? r : null }) : (e = W(n), t = e.length, function() { return r++, t > r ? e[r] : null }) }

        function m(n, t) {
            return t = null == t ? n.length - 1 : +t,
                function() {
                    for (var e = Math.max(arguments.length - t, 0), r = Array(e), u = 0; e > u; u++) r[u] = arguments[u + t];
                    switch (t) {
                        case 0:
                            return n.call(this, r);
                        case 1:
                            return n.call(this, arguments[0], r)
                    }
                }
        }

        function y(n) { return function(t, e, r) { return n(t, r) } }

        function v(t) {
            return function(e, r, o) {
                o = i(o || n), e = e || [];
                var c = h(e);
                if (0 >= t) return o(null);
                var a = !1,
                    f = 0,
                    l = !1;
                ! function s() {
                    if (a && 0 >= f) return o(null);
                    for (; t > f && !l;) {
                        var n = c();
                        if (null === n) return a = !0, void(0 >= f && o(null));
                        f += 1, r(e[n], n, u(function(n) { f -= 1, n ? (o(n), l = !0) : s() }))
                    }
                }()
            }
        }

        function d(n) { return function(t, e, r) { return n(C.eachOf, t, e, r) } }

        function g(n) { return function(t, e, r, u) { return n(v(e), t, r, u) } }

        function k(n) { return function(t, e, r) { return n(C.eachOfSeries, t, e, r) } }

        function b(t, e, r, u) {
            u = i(u || n), e = e || [];
            var c = o(e) ? [] : {};
            t(e, function(n, t, e) { r(n, function(n, r) { c[t] = r, e(n) }) }, function(n) { u(n, c) })
        }

        function w(n, t, e, r) {
            var u = [];
            n(t, function(n, t, r) { e(n, function(e) { e && u.push({ index: t, value: n }), r() }) }, function() { r(a(u.sort(function(n, t) { return n.index - t.index }), function(n) { return n.value })) })
        }

        function O(n, t, e, r) { w(n, t, function(n, t) { e(n, function(n) { t(!n) }) }, r) }

        function S(n, t, e) {
            return function(r, u, i, o) {
                function c() { o && o(e(!1, void 0)) }

                function a(n, r, u) { return o ? void i(n, function(r) { o && t(r) && (o(e(!0, n)), o = i = !1), u() }) : u() }
                arguments.length > 3 ? n(r, u, a, c) : (o = i, i = u, n(r, a, c))
            }
        }

        function E(n, t) { return t }

        function L(t, e, r) {
            r = r || n;
            var u = o(e) ? [] : {};
            t(e, function(n, t, e) { n(m(function(n, r) { r.length <= 1 && (r = r[0]), u[t] = r, e(n) })) }, function(n) { r(n, u) })
        }

        function I(n, t, e, r) {
            var u = [];
            n(t, function(n, t, r) { e(n, function(n, t) { u = u.concat(t || []), r(n) }) }, function(n) { r(n, u) })
        }

        function x(t, e, r) {
            function i(t, e, r, u) {
                if (null != u && "function" != typeof u) throw new Error("task callback must be a function");
                return t.started = !0, M(e) || (e = [e]), 0 === e.length && t.idle() ? C.setImmediate(function() { t.drain() }) : (c(e, function(e) {
                    var i = { data: e, callback: u || n };
                    r ? t.tasks.unshift(i) : t.tasks.push(i), t.tasks.length === t.concurrency && t.saturated()
                }), void C.setImmediate(t.process))
            }

            function o(n, t) {
                return function() {
                    f -= 1;
                    var e = !1,
                        r = arguments;
                    c(t, function(n) { c(l, function(t, r) { t !== n || e || (l.splice(r, 1), e = !0) }), n.callback.apply(n, r) }), n.tasks.length + f === 0 && n.drain(), n.process()
                }
            }
            if (null == e) e = 1;
            else if (0 === e) throw new Error("Concurrency must not be zero");
            var f = 0,
                l = [],
                s = {
                    tasks: [],
                    concurrency: e,
                    payload: r,
                    saturated: n,
                    empty: n,
                    drain: n,
                    started: !1,
                    paused: !1,
                    push: function(n, t) { i(s, n, !1, t) },
                    kill: function() { s.drain = n, s.tasks = [] },
                    unshift: function(n, t) { i(s, n, !0, t) },
                    process: function() {
                        if (!s.paused && f < s.concurrency && s.tasks.length)
                            for (; f < s.concurrency && s.tasks.length;) {
                                var n = s.payload ? s.tasks.splice(0, s.payload) : s.tasks.splice(0, s.tasks.length),
                                    e = a(n, function(n) { return n.data });
                                0 === s.tasks.length && s.empty(), f += 1, l.push(n[0]);
                                var r = u(o(s, n));
                                t(e, r)
                            }
                    },
                    length: function() { return s.tasks.length },
                    running: function() { return f },
                    workersList: function() { return l },
                    idle: function() { return s.tasks.length + f === 0 },
                    pause: function() { s.paused = !0 },
                    resume: function() { if (s.paused !== !1) { s.paused = !1; for (var n = Math.min(s.concurrency, s.tasks.length), t = 1; n >= t; t++) C.setImmediate(s.process) } }
                };
            return s
        }

        function j(n) { return m(function(t, e) { t.apply(null, e.concat([m(function(t, e) { "object" == typeof console && (t ? console.error && console.error(t) : console[n] && c(e, function(t) { console[n](t) })) })])) }) }

        function A(n) { return function(t, e, r) { n(f(t), e, r) } }

        function T(n) {
            return m(function(t, e) {
                var r = m(function(e) {
                    var r = this,
                        u = e.pop();
                    return n(t, function(n, t, u) { n.apply(r, e.concat([u])) }, u)
                });
                return e.length ? r.apply(this, e) : r
            })
        }

        function z(n) {
            return m(function(t) {
                var e = t.pop();
                t.push(function() {
                    var n = arguments;
                    r ? C.setImmediate(function() { e.apply(null, n) }) : e.apply(null, n)
                });
                var r = !0;
                n.apply(this, t), r = !1
            })
        }
        var q, C = {},
            P = "object" == typeof self && self.self === self && self || "object" == typeof global && global.global === global && global || this;
        null != P && (q = P.async), C.noConflict = function() { return P.async = q, C };
        var H = Object.prototype.toString,
            M = Array.isArray || function(n) { return "[object Array]" === H.call(n) },
            U = function(n) { var t = typeof n; return "function" === t || "object" === t && !!n },
            W = Object.keys || function(n) { var t = []; for (var e in n) n.hasOwnProperty(e) && t.push(e); return t },
            B = "function" == typeof setImmediate && setImmediate,
            D = B ? function(n) { B(n) } : function(n) { setTimeout(n, 0) };
        "object" == typeof process && "function" == typeof process.nextTick ? C.nextTick = process.nextTick : C.nextTick = D, C.setImmediate = B ? D : C.nextTick, C.forEach = C.each = function(n, t, e) { return C.eachOf(n, y(t), e) }, C.forEachSeries = C.eachSeries = function(n, t, e) { return C.eachOfSeries(n, y(t), e) }, C.forEachLimit = C.eachLimit = function(n, t, e, r) { return v(t)(n, y(e), r) }, C.forEachOf = C.eachOf = function(t, e, r) {
            function o(n) { f--, n ? r(n) : null === c && 0 >= f && r(null) }
            r = i(r || n), t = t || [];
            for (var c, a = h(t), f = 0; null != (c = a());) f += 1, e(t[c], c, u(o));
            0 === f && r(null)
        }, C.forEachOfSeries = C.eachOfSeries = function(t, e, r) {
            function o() {
                var n = !0;
                return null === a ? r(null) : (e(t[a], a, u(function(t) {
                    if (t) r(t);
                    else {
                        if (a = c(), null === a) return r(null);
                        n ? C.setImmediate(o) : o()
                    }
                })), void(n = !1))
            }
            r = i(r || n), t = t || [];
            var c = h(t),
                a = c();
            o()
        }, C.forEachOfLimit = C.eachOfLimit = function(n, t, e, r) { v(t)(n, e, r) }, C.map = d(b), C.mapSeries = k(b), C.mapLimit = g(b), C.inject = C.foldl = C.reduce = function(n, t, e, r) { C.eachOfSeries(n, function(n, r, u) { e(t, n, function(n, e) { t = e, u(n) }) }, function(n) { r(n, t) }) }, C.foldr = C.reduceRight = function(n, e, r, u) {
            var i = a(n, t).reverse();
            C.reduce(i, e, r, u)
        }, C.transform = function(n, t, e, r) { 3 === arguments.length && (r = e, e = t, t = M(n) ? [] : {}), C.eachOf(n, function(n, r, u) { e(t, n, r, u) }, function(n) { r(n, t) }) }, C.select = C.filter = d(w), C.selectLimit = C.filterLimit = g(w), C.selectSeries = C.filterSeries = k(w), C.reject = d(O), C.rejectLimit = g(O), C.rejectSeries = k(O), C.any = C.some = S(C.eachOf, e, t), C.someLimit = S(C.eachOfLimit, e, t), C.all = C.every = S(C.eachOf, r, r), C.everyLimit = S(C.eachOfLimit, r, r), C.detect = S(C.eachOf, t, E), C.detectSeries = S(C.eachOfSeries, t, E), C.detectLimit = S(C.eachOfLimit, t, E), C.sortBy = function(n, t, e) {
            function r(n, t) {
                var e = n.criteria,
                    r = t.criteria;
                return r > e ? -1 : e > r ? 1 : 0
            }
            C.map(n, function(n, e) { t(n, function(t, r) { t ? e(t) : e(null, { value: n, criteria: r }) }) }, function(n, t) { return n ? e(n) : void e(null, a(t.sort(r), function(n) { return n.value })) })
        }, C.auto = function(t, e, r) {
            function u(n) { d.unshift(n) }

            function o(n) {
                var t = p(d, n);
                t >= 0 && d.splice(t, 1)
            }

            function a() { h--, c(d.slice(0), function(n) { n() }) }
            r || (r = e, e = null), r = i(r || n);
            var f = W(t),
                h = f.length;
            if (!h) return r(null);
            e || (e = h);
            var y = {},
                v = 0,
                d = [];
            u(function() { h || r(null, y) }), c(f, function(n) {
                function i() { return e > v && l(g, function(n, t) { return n && y.hasOwnProperty(t) }, !0) && !y.hasOwnProperty(n) }

                function c() { i() && (v++, o(c), h[h.length - 1](d, y)) }
                for (var f, h = M(t[n]) ? t[n] : [t[n]], d = m(function(t, e) {
                        if (v--, e.length <= 1 && (e = e[0]), t) {
                            var u = {};
                            s(y, function(n, t) { u[t] = n }), u[n] = e, r(t, u)
                        } else y[n] = e, C.setImmediate(a)
                    }), g = h.slice(0, h.length - 1), k = g.length; k--;) { if (!(f = t[g[k]])) throw new Error("Has inexistant dependency"); if (M(f) && p(f, n) >= 0) throw new Error("Has cyclic dependencies") }
                i() ? (v++, h[h.length - 1](d, y)) : u(c)
            })
        }, C.retry = function(n, t, e) {
            function r(n, t) {
                if ("number" == typeof t) n.times = parseInt(t, 10) || i;
                else {
                    if ("object" != typeof t) throw new Error("Unsupported argument type for 'times': " + typeof t);
                    n.times = parseInt(t.times, 10) || i, n.interval = parseInt(t.interval, 10) || o
                }
            }

            function u(n, t) {
                function e(n, e) { return function(r) { n(function(n, t) { r(!n || e, { err: n, result: t }) }, t) } }

                function r(n) { return function(t) { setTimeout(function() { t(null) }, n) } }
                for (; a.times;) {
                    var u = !(a.times -= 1);
                    c.push(e(a.task, u)), !u && a.interval > 0 && c.push(r(a.interval))
                }
                C.series(c, function(t, e) { e = e[e.length - 1], (n || a.callback)(e.err, e.result) })
            }
            var i = 5,
                o = 0,
                c = [],
                a = { times: i, interval: o },
                f = arguments.length;
            if (1 > f || f > 3) throw new Error("Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)");
            return 2 >= f && "function" == typeof n && (e = t, t = n), "function" != typeof n && r(a, n), a.callback = e, a.task = t, a.callback ? u() : u
        }, C.waterfall = function(t, e) {
            function r(n) {
                return m(function(t, u) {
                    if (t) e.apply(null, [t].concat(u));
                    else {
                        var i = n.next();
                        i ? u.push(r(i)) : u.push(e), z(n).apply(null, u)
                    }
                })
            }
            if (e = i(e || n), !M(t)) { var u = new Error("First argument to waterfall must be an array of functions"); return e(u) }
            return t.length ? void r(C.iterator(t))() : e()
        }, C.parallel = function(n, t) { L(C.eachOf, n, t) }, C.parallelLimit = function(n, t, e) { L(v(t), n, e) }, C.series = function(n, t) { L(C.eachOfSeries, n, t) }, C.iterator = function(n) {
            function t(e) {
                function r() { return n.length && n[e].apply(null, arguments), r.next() }
                return r.next = function() { return e < n.length - 1 ? t(e + 1) : null }, r
            }
            return t(0)
        }, C.apply = m(function(n, t) { return m(function(e) { return n.apply(null, t.concat(e)) }) }), C.concat = d(I), C.concatSeries = k(I), C.whilst = function(t, e, r) {
            if (r = r || n, t()) {
                var u = m(function(n, i) { n ? r(n) : t.apply(this, i) ? e(u) : r(null) });
                e(u)
            } else r(null)
        }, C.doWhilst = function(n, t, e) { var r = 0; return C.whilst(function() { return ++r <= 1 || t.apply(this, arguments) }, n, e) }, C.until = function(n, t, e) { return C.whilst(function() { return !n.apply(this, arguments) }, t, e) }, C.doUntil = function(n, t, e) { return C.doWhilst(n, function() { return !t.apply(this, arguments) }, e) }, C.during = function(t, e, r) {
            r = r || n;
            var u = m(function(n, e) { n ? r(n) : (e.push(i), t.apply(this, e)) }),
                i = function(n, t) { n ? r(n) : t ? e(u) : r(null) };
            t(i)
        }, C.doDuring = function(n, t, e) {
            var r = 0;
            C.during(function(n) { r++ < 1 ? n(null, !0) : t.apply(this, arguments) }, n, e)
        }, C.queue = function(n, t) { var e = x(function(t, e) { n(t[0], e) }, t, 1); return e }, C.priorityQueue = function(t, e) {
            function r(n, t) { return n.priority - t.priority }

            function u(n, t, e) {
                for (var r = -1, u = n.length - 1; u > r;) {
                    var i = r + (u - r + 1 >>> 1);
                    e(t, n[i]) >= 0 ? r = i : u = i - 1
                }
                return r
            }

            function i(t, e, i, o) {
                if (null != o && "function" != typeof o) throw new Error("task callback must be a function");
                return t.started = !0, M(e) || (e = [e]), 0 === e.length ? C.setImmediate(function() { t.drain() }) : void c(e, function(e) {
                    var c = { data: e, priority: i, callback: "function" == typeof o ? o : n };
                    t.tasks.splice(u(t.tasks, c, r) + 1, 0, c), t.tasks.length === t.concurrency && t.saturated(), C.setImmediate(t.process)
                })
            }
            var o = C.queue(t, e);
            return o.push = function(n, t, e) { i(o, n, t, e) }, delete o.unshift, o
        }, C.cargo = function(n, t) { return x(n, 1, t) }, C.log = j("log"), C.dir = j("dir"), C.memoize = function(n, e) {
            var r = {},
                u = {};
            e = e || t;
            var i = m(function(t) {
                var i = t.pop(),
                    o = e.apply(null, t);
                o in r ? C.setImmediate(function() { i.apply(null, r[o]) }) : o in u ? u[o].push(i) : (u[o] = [i], n.apply(null, t.concat([m(function(n) {
                    r[o] = n;
                    var t = u[o];
                    delete u[o];
                    for (var e = 0, i = t.length; i > e; e++) t[e].apply(null, n)
                })])))
            });
            return i.memo = r, i.unmemoized = n, i
        }, C.unmemoize = function(n) { return function() { return (n.unmemoized || n).apply(null, arguments) } }, C.times = A(C.map), C.timesSeries = A(C.mapSeries), C.timesLimit = function(n, t, e, r) { return C.mapLimit(f(n), t, e, r) }, C.seq = function() {
            var t = arguments;
            return m(function(e) {
                var r = this,
                    u = e[e.length - 1];
                "function" == typeof u ? e.pop() : u = n, C.reduce(t, e, function(n, t, e) { t.apply(r, n.concat([m(function(n, t) { e(n, t) })])) }, function(n, t) { u.apply(r, [n].concat(t)) })
            })
        }, C.compose = function() { return C.seq.apply(null, Array.prototype.reverse.call(arguments)) }, C.applyEach = T(C.eachOf), C.applyEachSeries = T(C.eachOfSeries), C.forever = function(t, e) {
            function r(n) { return n ? i(n) : void o(r) }
            var i = u(e || n),
                o = z(t);
            r()
        }, C.ensureAsync = z, C.constant = m(function(n) { var t = [null].concat(n); return function(n) { return n.apply(this, t) } }), C.wrapSync = C.asyncify = function(n) {
            return m(function(t) {
                var e, r = t.pop();
                try { e = n.apply(this, t) } catch (u) { return r(u) }
                U(e) && "function" == typeof e.then ? e.then(function(n) { r(null, n) })["catch"](function(n) { r(n.message ? n : new Error(n)) }) : r(null, e)
            })
        }, "object" == typeof module && module.exports ? module.exports = C : "function" == typeof define && define.amd ? define([], function() { return C }) : P.async = C
    }();
    // async.parallel with timeout
    //http://davidbcalhoun.com/2014/async.parallel-with-a-simple-timeout-node-js/
    window.async.parallelWithTimeout = function(action, timeoutInMilliseconds, tasks, callback) {
        // tasks[]: name, callback

        //create wrapper functions to track completion of callback
        var trackedTasks = tasks.map(function(task) {
            return function(callback) {
                task.callback(function(err, result) {
                    var metric = AdFuel.getMetricById('modules', task.name)[action + "Callback"];
                    var endTimestamp = new Date().getTime();
                    var elapsed = endTimestamp - metric.start + "ms";
                    AdFuel.addMetric({ type: 'modules', id: task.name, data: { callback: action, end: endTimestamp, elapsed: elapsed } });
                    AdFuel.addMetric({ type: 'timeline', id: task.name + "_" + action, data: { end: endTimestamp, elapsed: elapsed } });
                    task.isCompleted = true;
                    callback(err, result);
                });
            }
        });

        var timeout = setTimeout(function() {
            //remove timeout, indicating errored out
            timeout = null;
            var timedOutCallbacks = [];
            //log all non-completed callbacks
            callback("callback timed out out after " + timeoutInMilliseconds + 'ms.', null);

            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].isCompleted == false) {
                    _dbgLog({ task: tasks[i] });
                    var timeoutAt = new Date().getTime();
                    timedOutCallbacks.push(tasks[i].name + " " + tasks[i].event);
                    AdFuel.addMetric({ type: 'modules', id: tasks[i].name, data: { callback: action, timeout: timeoutAt } });
                    AdFuel.addMetric({ type: 'timeline', id: tasks[i].name + "_" + action, data: { timeout: timeoutAt } });
                }
            }
            //timeout error
        }, timeoutInMilliseconds);

        async.parallel(trackedTasks, function(err, result) {
            //after all tasks are complete

            //if timeout occurred (and was cleared), callback has already been called
            //otherwise, clear the timeout and return the results
            if (timeout) {
                //cancel timeout (if timeout was set longer, and all parallel tasks finished sooner)
                clearTimeout(timeout);

                //passthrough the data to the callback
                callback(err, result);
            } else {

            }
        });
    };
})();

var AdFuel = (function adFuelBuilder() {

    var slice = Array.prototype.slice;
    var noop = function() {};
    var _pageLevelTargeting = [];
    var _inheritableAdUnit;
    var _DOMLoadEventFired = false;
    var _preQueueExecuting = false;
    var _postQueueExecuting = false;
    var _setChildDirectedTreatment;
    var _setSafeFrameConfig;

    var _buildAsyncCallback = function(name, callback, event) {
        return { name: name, callback: callback, event: event, data: {} };
    };

    var RegistryArray = function() {
        var self = [];
        self.push = function(asset, options) {
            //queue singleton or registry
            //called from queueSingleton & Rocketeer generated registry.js
            //calls preQueueCallback and postQueueCallback
            //dispatches queue if _options.autoDispatch
            _preQueueExecuting = true;

            //Modify the asset to correlate to the slot map, if passed.
            if (options && options.slotMap) {
                for (var assetIndex = 1; assetIndex < asset.length; assetIndex++){
                    if (options.slotMap[asset[assetIndex].rktr_slot_id]){
                        asset[assetIndex].rktr_slot_id = options.slotMap[asset[assetIndex].rktr_slot_id];
                    }
                }
            }

            //add asset to this array
            Array.prototype.push.call(self, asset);

            //wait on all registered modules- passing clone of asset (registry/singleton)
            var assetClone = _clone(asset);
            options = options || { dispatch: true };


            var preQueueCallbacks = _registeredModules.filter(function(item) {
                return !!item.callbacks.preQueueCallback;
            }).map(function(item) {
                return _buildAsyncCallback(item.name, function(callback) {
                    item.callbacks.preQueueCallback(assetClone, callback);
                }, 'preQueue');
            });

            for (var x = 0; x < preQueueCallbacks.length; x++) {
                var timeStamp = new Date().getTime();
                AdFuel.addMetric({ type: 'modules', id: preQueueCallbacks[x].name, data: { callback: "preQueue", start: timeStamp } });
                AdFuel.addMetric({ type: 'timeline', id: preQueueCallbacks[x].name + "_preQueue", data: { start: timeStamp } });
            }

            async.parallelWithTimeout('preQueue', _options.queueCallbackTimeoutInMilliseconds, preQueueCallbacks, function(err) {
                if (err) {
                    _dbgLog('error calling preQueueCallbacks for registered modules', { error: err });
                }
                try {
                    var PreQueueCompleteEvent = new CustomEvent('PreQueueComplete', {
                        "detail": {
                            "asset": asset
                        }
                    });
                    document.dispatchEvent(PreQueueCompleteEvent);
                } catch (ex) {
                    _errLog('error dispatching custom Event: PreQueueComplete', { error: ex });
                }
                _preQueueExecuting = false;

                var timeStamp = new Date().getTime();
                AdFuel.addMetric({ type: 'timeline', id: "queueing_registry:_" + asset[0].rktr_id, data: { id: 0, start: timeStamp } });

                var registryName = asset[0].rktr_id;

                addMetric({ type: 'counts', id: 'registries', data: '+' });
                addMetric({ type: 'registries', id: registryName, data: { deployed: asset[0].rktr_deployed_date, slotCount: asset.length - 1 } });

                //set child directed treatment flag
                if (typeof asset[0].child_directed_treatment !== 'undefined') {
                    _setChildDirectedTreatment = asset[0].child_directed_treatment == "true" ? 1 : 0;
                }

                //set SafeFrame config
                if (typeof asset[0].safeframe_config !== 'undefined') {
                    _setSafeFrameConfig = asset[0].safeframe_config;
                }

                if (!asset[0].singleton) {
                    //registry, non-singleton

                    //save page level targeting
                    _applyRegistryPageLevelTargeting(asset[0].targeting);

                    //set inheritable adunit based on first slot
                    _inheritableAdUnit = _removeLeadingNumericNetworkId(asset[1].rktr_ad_id);
                }
                var pageLevelRoot = asset[0].root ? asset[0].root.toUpperCase() : asset[0].site.toUpperCase();
                _applyWindowSiteLevelOptions(pageLevelRoot);

                //process slots
                var registryName = asset[0].rktr_id;

                var startListeners = false;
                for (var x = 1; x < asset.length; x++) {
                    var slot = asset[x];
                    slot.parentRegistry = registryName;
                    if (!slot.queued) {
                        AdFuel.addMetric({ type: 'slots', id: slot.rktr_slot_id, data: { queued: new Date().getTime() } });
                        var hasInViewRefresh = asset[0].hasInViewRefresh ? asset[0].hasInViewRefresh : slot.hasInViewRefresh;
                        if (hasInViewRefresh == true) {
                            AdFuel.addMetric({ type: 'slots', id: slot.rktr_slot_id, data: { "In-View Refresh Registration": new Date().getTime() } });
                            startListeners = true;
                        }
                        _rocketeerSlots.push(slot);
                    }
                }

                if (startListeners) {
                    _startInViewListeners();
                }

                //wait on all registered modules- passing clone of rocketeer slots (registry/singleton)
                var assetsClone = _clone(_rocketeerSlots);

                var postQueueCallbacks = _registeredModules.filter(function(item) {
                    return !!item.callbacks.postQueueCallback;
                }).map(function(item) {
                    return _buildAsyncCallback(item.name, function(callback) {
                        item.callbacks.postQueueCallback(assetsClone, callback);
                    }, 'postQueue');
                });

                for (var x = 0; x < postQueueCallbacks.length; x++) {
                    var timeStamp = new Date().getTime();
                    AdFuel.addMetric({ type: 'modules', id: postQueueCallbacks[x].name, data: { callback: "postQueue", start: timeStamp } });
                    AdFuel.addMetric({ type: 'timeline', id: postQueueCallbacks[x].name + "_postQueue", data: { start: timeStamp } });
                }
                _postQueueExecuting = true;
                async.parallelWithTimeout('postQueue', _options.queueCallbackTimeoutInMilliseconds, postQueueCallbacks, function(err) {
                    if (err) {
                        _dbgLog('error calling postQueueCallbacks for registered modules', { error: err });
                    }
                    try {
                        var PostQueueCompleteEvent = new CustomEvent('PostQueueComplete', {
                            "detail": {
                                "asset": asset
                            }
                        });
                        document.dispatchEvent(PostQueueCompleteEvent);
                    } catch (ex) {
                        _errLog('error dispatching custom Event: PostQueueComplete', { error: ex });
                    }
                    _timeLog(timestamp() + " End postQueue Callbacks");
                    _postQueueExecuting = false;
                    var timeStamp = new Date().getTime();
                    AdFuel.addMetric({ type: 'timeline', id: "queueing_registry:_" + asset[0].rktr_id, data: { id: 0, end: timeStamp } });

                    if (_options.autoDispatch || options.dispatch == true) {
                        AdFuel.dispatchQueue(options);
                    }
                });
            });
        };
        return self;
    };

    /* UTILITY FUNCTIONS */

    function _isFunction(object) {
        return typeof object === 'function';
    }

    function _bind(fn, context /*, function arguments */ ) {
        if (!_isFunction(fn)) {
            throw new TypeError('Bind must be called on a function');
        }

        var args = slice.call(arguments, 2);

        return function bound() {
            return fn.apply(context, args.concat(slice.call(arguments)));
        };
    }

    function _logger( /* log data */ ) {
        window.console.log.apply(window.console, arguments);
    }

    function addEvent(element, event, fn) {
        if (element.addEventListener) {
            return element.addEventListener(event, fn, true);
        } else if (element.attachEvent) {
            return element.attachEvent('on' + event, fn);
        }
    }

    function removeEvent(element, event, fn) {
        if (element.removeEventListener) {
            return element.removeEventListener(event, fn, true);
        } else if (element.detachEvent) {
            return element.detachEvent('on' + event, fn);
        }
    }

    function _generateSingletonId() {
        //return_<9-digit-random-hex>
        var singletonId = '';
        for (var i = 0; i < 9; i++) {
            singletonId += Math.floor(Math.random() * 16).toString(16);
        }
        return singletonId;
    }

    function _getURLParam(name) {
        var result = '';

        if (document.location.search) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(document.location.search);
            if (results) {
                result = results[1];
            }
        }

        return result;
    }

    function readCookie(name) {
        if (!document.cookie) {
            // there is no cookie, so go no further
            return null;
        } else { // there is a cookie
            var ca = document.cookie.split(';');
            var nameEQ = name + "=";
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    //delete spaces
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;
        }
    }

    function _clone(obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copyDate = new Date();
            copyDate.setTime(obj.getTime());
            return copyDate;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copyArray = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copyArray[i] = _clone(obj[i]);
            }
            return copyArray;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copyObject = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copyObject[attr] = _clone(obj[attr]);
                }
            }
            return copyObject;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    function _merge(source, mods) {
        var dest = {};
        for (var attrname in source) {
            if (source.hasOwnProperty(attrname)) {
                dest[attrname] = source[attrname];
            }
        }
        for (var attrname in mods) {
            if (mods.hasOwnProperty(attrname)) {
                dest[attrname] = mods[attrname];
            }
        }
        return dest;
    }

    function _debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /* ADFUEL VARIABLES */
    var _options = {
        refreshOnFocusOnly: false,
        networkId: '8663477',
        // networkId: '10281455',
        autoDispatch: true,
        exclude: [],
        iframeTitle: 'advertisement',
        queueCallbackTimeoutInMilliseconds: 500,
        dispatchCallbackTimeoutInMilliseconds: 500,
        refreshCallbackTimeoutInMilliseconds: 500
    };
    var _dynamicTargeting = { pageTargets: {}, slotTargets: {} };
    var _initialized = false;
    var _focused = true;

    var timestamp = function() {
        var date = new Date();
        var dateString = date.toISOString();
        var datePieces = dateString.split("T");
        var dateDate = datePieces[0];
        var dateTime = datePieces[1].replace("Z", "");
        return dateTime;
    };

    var _dbgLog = (_getURLParam("debug") == "true") ? _bind(_logger, null, '[AdFuel - DEBUG]') : noop;
    var _timeLog = (_getURLParam("timers") == "true") ? _bind(_logger, null, '[AdFuel- TIMER]') : noop;
    var _warnLog = _bind(_logger, null, '[AdFuel - WARNING]');
    var _errLog = _bind(_logger, null, '[AdFuel - ERROR]');
    var _depLog = _bind(_logger, null, '[AdFuel - DEPRECATION NOTICE]');

    var _pageSlots = {};
    var _rocketeerSlots = [];

    var _adsQAPageLevelKey;
    var _adsQAPageLevelValue;

    //contains dispatchQueue functions which must be delayed until queues are dispatchable
    var _delayedDispatchQueues = [];
    //contains dispatchQueue functions which must be delayed until users request their dispatch
    var _userDispatchedQueues = [];

    //contains registered Modules (name, callbacks)
    var _registeredModules = [];

    //contains slots which can be excluded via _options.exclude or queueRegistery queueOptions.exclude
    //excluded slots must be explicitly dispatched via dispatchOptions.slots
    var _excludedSlotIds = [];

    function _bindReady() {
        var called = false;

        function ready() {
            //ensure this only executes once
            if (!called) {
                called = true;
                _timeLog(timestamp() + " DOMContentLoaded");
                _dbgLog("AdFuel DOM Ready Detection");
                _DOMLoadEventFired = true;
                addMetric({ type: 'timeline', id: 'domContentLoaded', data: { id: 1, timestamp: Date.now() } });
                _dispatchAllQueues();
            }
        }

        function tryScroll() {
            if (!called) {
                try {
                    document.documentElement.doScroll("left");
                    ready();
                } catch (e) {
                    setTimeout(tryScroll, 10);
                }
            }
        }

        //listen for document DOMContentLoaded/complete/loaded/interactive
        if (document.addEventListener) { // native event
            document.addEventListener("DOMContentLoaded", ready, false);
        } else if (document.attachEvent) { // IE

            var isFrame = false;
            try {
                isFrame = window.frameElement !== null;
            } catch (e) {}

            // IE, the document is not inside a frame
            if (document.documentElement.doScroll && !isFrame) {
                tryScroll();
            }

            //todo: do we need an else?
            // IE, the document is inside a frame
            document.attachEvent("onreadystatechange", function() {
                if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
                    ready();
                }
            });
        }

        //listen for window load/onload
        if (window.addEventListener) {
            window.addEventListener('load', ready, true);
        } else if (window.attachEvent) {
            window.attachEvent('onload', ready);
        } else {
            var fn = window.onload; // very old browser, copy old onload
            window.onload = function() { // replace by new onload and call the old one
                fn && fn();
                ready();
            };
        }
        // Fallback if adfuel is put on page post-DOMContentLoaded
        if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
            ready();
        }
    }

    //occurs once upon init parsing url for adsQA page-level targeting
    function _checkForAdsQA() {
        try {
            var qaparam = _getURLParam("adsqa");
            if (qaparam) {
                var qaparamPieces = qaparam.split("%3D");
                _adsQAPageLevelKey = qaparamPieces[0];
                _adsQAPageLevelValue = qaparamPieces[1];
                _dynamicTargeting.pageTargets[_adsQAPageLevelKey] = _adsQAPageLevelValue;
            }
        } catch (err) {
            _errLog('checkForAdsQA', err);
        }
    }

    //this will be called each time a singleton/registry is queued
    //no need to call addPageLevelTarget/addSlotLevelTarget, because GPT Page may or may not have been built
    function _applyRegistryPageLevelTargeting(targeting) {
        for (var tIndex = 0; tIndex < targeting.length; tIndex++) {
            var target = targeting[tIndex];
            var currentTargeting = _dynamicTargeting.pageTargets[target[0]] || [];
            for (var valIndex = 0; valIndex < target[1].length; valIndex++) {
                var value = target[1][valIndex];
                if (currentTargeting.indexOf(value) < 0) {
                    currentTargeting.push(value);
                }
            }
            _dynamicTargeting.pageTargets[target[0]] = currentTargeting;
        }
    }

    //this will be called each time a singleton/registry is queued
    //no need to call addPageLevelTarget/addSlotLevelTarget, because GPT Page has not been built
    function _applyWindowSiteLevelOptions(siteLvl) {

        if (window[siteLvl]) {
            //moved to setOptions
            //if (window[siteLvl].refreshOnFocusOnly){
            //    _options.refreshOnFocusOnly = true;
            //}

            if (window[siteLvl].adTargets) {
                for (var key in window[siteLvl].adTargets) {
                    if (window[siteLvl].adTargets.hasOwnProperty(key)) {
                        _dynamicTargeting.pageTargets[key] = window[siteLvl].adTargets[key];
                    }
                }
            }

            if (window[siteLvl].slotTargets) {
                for (var slotId in window[siteLvl].slotTargets) {
                    if (window[siteLvl].slotTargets.hasOwnProperty(slotId)) {
                        var slotTargeting = window[siteLvl].slotTargets[slotId];
                        if (!_dynamicTargeting.slotTargets[slotId]) {
                            _dynamicTargeting.slotTargets[slotId] = {};
                        }
                        for (var key in slotTargeting) {
                            if (slotTargeting.hasOwnProperty(key)) {
                                _dynamicTargeting.slotTargets[slotId][key] = slotTargeting[key];
                            }
                        }
                    }
                }
            }
        }
    }

    function _getCombinedSlotTargeting(rocketeerSlot) {
        var slotTargeting = _clone(rocketeerSlot.targeting);

        if (!Array.isArray(slotTargeting)) {
            slotTargeting = [slotTargeting];
        }

        var dynamicSlotTargeting = _dynamicTargeting.slotTargets;

        if (dynamicSlotTargeting[rocketeerSlot.rktr_slot_id]) {
            for (var targetId in dynamicSlotTargeting[rocketeerSlot.rktr_slot_id]) {
                if (dynamicSlotTargeting[rocketeerSlot.rktr_slot_id].hasOwnProperty(targetId)) {
                    slotTargeting.push([targetId, dynamicSlotTargeting[rocketeerSlot.rktr_slot_id][targetId]]);
                }
            }
        }

        return slotTargeting;
    }

    function _setSlotRenderedClass() {
        addEvent(document, 'GPTRenderComplete', function(e) {
            _dbgLog("GPT Render Complete", { renderEvent: e });
            var el = document.getElementById(e.detail.divId);
            if (el && el.className.indexOf("adfuel-rendered") < 0) {
                el.className += " adfuel-rendered";
            }
        });
    }

    function _removeSlotRenderedClass(slots) {

        if (slots) {
            if (!Array.isArray(slots)) {
                slots = [slots];
            }
            if (slots.length == 0)
                slots = Object.getOwnPropertyNames(_pageSlots);
        }
        for (var x = 0; x < slots.length; x++) {
            var slotId = slots[x];
            var el = document.getElementById(slotId);
            if (el && el.className.indexOf("adfuel-rendered") > 0) {
                el.className = el.className.replace('adfuel-rendered', '');
            }
        }
    }

    function _removePageSlots(slots) {

        if (slots) {
            if (!Array.isArray(slots)) {
                slots = [slots];
            }
            if (slots.length == 0)
                slots = Object.getOwnPropertyNames(_pageSlots);
        }
        for (var x = 0; x < slots.length; x++) {
            var slotId = slots[x];
            if (_pageSlots[slotId]) {
                delete _pageSlots[slotId];
            }
        }
    }

    function _removeRocketeerSlots(slots) {

        if (slots) {
            if (!Array.isArray(slots)) {
                slots = [slots];
            }
            if (slots.length == 0) {
                _dbgLog({ pageSlots: _pageSlots });
                slots = Object.getOwnPropertyNames(_pageSlots);
            }
        }
        _dbgLog("Removing Rocketeer Slots: ", slots);
        for (var x = 0; x < _rocketeerSlots.length; x++) {
            var slotId = _rocketeerSlots[x].rktr_slot_id;
            _dbgLog({ slotId: slotId });
            if (slots.indexOf(slotId) >= 0 || slots.length == 0) {
                _dbgLog("Removing " + slotId);
                _rocketeerSlots.splice(x, 1);
            }
        }
    }

    function _setAdIFrameTitle() {
        window.googletag.setAdIframeTitle(_options.iframeTitle);
    }

    function addPageLevelTarget(key, value) {
        if (!key || !value) {
            return;
        }
        var currentTargeting = AdFuel.dynamicTargeting.pageTargets[key] || [];
        if (!Array.isArray(currentTargeting)) {
            currentTargeting = [currentTargeting];
        }
        if (!Array.isArray(value)) {
            value = [value];
        }
        for (var vIndex = 0; vIndex < value.length; vIndex++) {
            if (currentTargeting.indexOf(value[vIndex]) < 0)
                currentTargeting.push(value[vIndex]);
        }
        _dynamicTargeting.pageTargets[key] = currentTargeting;
        _dbgLog("Setting Page-Level Targeting", key, currentTargeting);
        _googleApi.executeWhenAvailable('adding page-level targeting', function() {
            var data = {};
            data[key] = AdFuel.dynamicTargeting.pageTargets[key];
            AdFuel.addMetric({ type: 'page', id: 'dynamic_targeting', data: data });
            _googleApi.setTargeting(key, AdFuel.dynamicTargeting.pageTargets[key]);
        });
    }

    function removePageLevelTarget(key, value) {

        _googleApi.executeWhenAvailable('removing page-level targeting', function() {

            var targets = _dynamicTargeting.pageTargets[key];

            if (value) {
                if (targets.indexOf(value) >= 0) {
                    targets.splice(targets.indexOf(value), 1);
                }
                _dynamicTargeting.pageTargets[key] = targets;
            }


            if (!value) {
                _googleApi.clearTargeting(key);
                delete _dynamicTargeting.pageTargets[key];
                AdFuel.dynamicTargeting = _dynamicTargeting;
                return;
            }

            if (key && targets.length == 0) {
                delete _dynamicTargeting.pageTargets[key];
            } else if (key && !targets.length == 0) {
                _dynamicTargeting.pageTargets[key] = targets;
                _googleApi.setTargeting(key, targets);
            } else {
                _dynamicTargeting.pageTargets = {};

                if (_adsQAPageLevelKey) {
                    //restore adsQA target
                    addPageLevelTarget(_adsQAPageLevelKey, _adsQAPageLevelValue);
                }
            }
        });
    }

    function addSlotLevelTarget(slotId, key, value) {

        var slotTargeting = _dynamicTargeting.slotTargets[slotId] || {};
        var currentTargeting = slotTargeting[key] || [];
        if (Array.isArray(currentTargeting)) {
            if (Array.isArray(value)) {
                for (var vIndex = 0; vIndex < value.length; vIndex++) {
                    currentTargeting.push(value[vIndex]);
                }
            } else {
                currentTargeting.push(value);
            }
        }
        _dynamicTargeting.slotTargets[slotId] = _dynamicTargeting.slotTargets[slotId] || {};
        _dynamicTargeting.slotTargets[slotId][key] = currentTargeting;

        _googleApi.executeWhenAvailable('adding slot-level targeting', function() {
            var slot = _pageSlots[slotId];

            if (slot) {
                //found slot
                _googleApi.setSlotTargeting(slot, key, currentTargeting);
            }
        });
    }

    function removeSlotLevelTarget(slotId, key, value) {
        _googleApi.executeWhenAvailable('removing slot-level targeting', function() {
            var slot = _pageSlots[slotId];

            if (slot) {
                //valid slot
                var slotTargeting = {};

                //get existing targeting keys
                var currentTargetingKeys = slot.getTargetingKeys();
                for (var keyId in currentTargetingKeys) {
                    var keyName = currentTargetingKeys[keyId];
                    if (typeof keyName !== "function") {
                        slotTargeting[keyName] = slot.getTargeting(keyName) || '';
                    }
                }

                var defaultSlotTargeting = {
                    pos: slotTargeting.pos
                };

                if (key) {
                    //remove only key
                    if (!value) {
                        delete slotTargeting[key];
                    } else {
                        slotTargeting[key].splice(slotTargeting[key].indexOf(value), 1);
                    }
                } else {
                    //remove everything but pos
                    slotTargeting = {
                        pos: slotTargeting.pos
                    };
                }

                _googleApi.clearSlotTargeting(slot);

                //add back everything in slotTargeting
                for (var targetKey in slotTargeting) {
                    if (slotTargeting[targetKey].length == 0) {
                        slotTargeting[targetKey][0] = '';
                    }
                    _googleApi.setSlotTargeting(slot, targetKey, slotTargeting[targetKey]);
                }
            }

            //remove from _dynamicTargeting
            if (_dynamicTargeting.slotTargets[slotId]) {
                if (key) {
                    //remove only key
                    if (!value) {
                        delete _dynamicTargeting.slotTargets[slotId][key];
                    } else {
                        _dynamicTargeting.slotTargets[slotId][key].splice(_dynamicTargeting.slotTargets[slotId][key].indexOf(value), 1);
                    }
                } else {
                    //remove everything but pos
                    _dynamicTargeting.slotTargets[slotId].length = 0;
                    _dynamicTargeting.slotTargets[slotId] = defaultSlotTargeting;
                }
            }
        });
    }

    function _buildPageLevelGPTObject() {

        addMetric({ type: 'timeline', id: 'building_page_level_GPT_object', data: { id: 0, start: Date.now() } });
        var latlong = readCookie("gptgeo");
        if (!latlong) {
            _dbgLog("Unable to retrieve location cookie", latlong);
            addMetric({
                type: 'configuration',
                id: 'spoofed_user_location',
                data: {
                    location_spoofed: false
                }
            });
        } else {
            //send lat/long to GPT
            var latlongPieces = latlong.split("%2C");

            var latitude = parseFloat(latlongPieces[0]);
            var longitude = parseFloat(latlongPieces[1]);
            _googleApi.executeWhenAvailable('setting location', function() {
                addMetric({
                    type: 'configuration',
                    id: 'spoofed_user_location',
                    data: {
                        location_spoofed: true,
                        latitude: latitude,
                        longitude: longitude
                    }
                });
                _googleApi.setLocation(latitude, longitude);
            });

        }

        if (typeof _setChildDirectedTreatment !== 'undefined') {
            _dbgLog("Setting Child Directed Treat Tag : ", _setChildDirectedTreatment);
            _googleApi.executeWhenAvailable('setting child_directed_treatment tag', function() {
                addMetric({ type: 'configuration', id: 'child_directed_treatment', data: { active: _setChildDirectedTreatment == 1 ? 'true' : 'false' } });
                _googleApi.setChildDirectedTreatmentTag(_setChildDirectedTreatment);
            });
        }

        if (typeof _setSafeFrameConfig !== 'undefined') {
            _dbgLog("Setting SafeFrame Config Tag : ", _setSafeFrameConfig);
            _googleApi.executeWhenAvailable('setting safeframe_config', function() {
                addMetric({ type: 'configuration', id: 'safeframe_config', data: { active: _setSafeFrameConfig } });
                _googleApi.setSafeFrameConfig(_setSafeFrameConfig);
            });
        }

        //combine page level targeting and _dynamicTargeting.pageTargets
        var targetings = _clone(_pageLevelTargeting);
        for (var tI = 0; tI < targetings.length; tI++) {
            var target = targetings[tI];
            addMetric({ type: 'page', id: 'static_targeting', data: { key: target[0], value: target[1] } });
        }
        var dynamicPageTargeting = _dynamicTargeting.pageTargets;
        for (var targetId in dynamicPageTargeting) {
            if (dynamicPageTargeting.hasOwnProperty(targetId)) {
                targetings.push([targetId, dynamicPageTargeting[targetId]]);
            }
        }

        _dbgLog("Page Level Targeting", JSON.stringify(targetings));
        for (var targetIndex = 0; targetIndex < targetings.length; targetIndex++) {
            var targetValue = targetings[targetIndex][1];

            //convert targetValue to array if necessary
            if (targetValue && !Array.isArray(targetValue)) {
                if (targetValue.indexOf(',') >= 0) {
                    targetValue = targetValue.split(',');
                } else {
                    targetValue = [targetValue];
                }
            }

            if (targetings[targetIndex][0] == "exclusions") {
                for (var i = 0; i < targetValue.length; i++) {
                    var targetKeyValue = targetings[targetIndex][1][i];
                    _googleApi.executeWhenAvailable('setting category exclusion', function() {
                        _googleApi.setCategoryExclusion(targetKeyValue);
                    });
                }
            } else {
                var targetKey = targetings[targetIndex][0];
                addPageLevelTarget(targetKey, targetValue);
            }
        }
        addMetric({ type: 'timeline', id: 'building_page_level_GPT_object', data: { id: 0, end: Date.now() } });

    }

    function _renderCheck(rocketeerSlot) {
        var unrenderedSlots = document.querySelectorAll("div#" + rocketeerSlot.rktr_slot_id);
        if (unrenderedSlots.length != 0) {
            for (var sI = 0; sI < unrenderedSlots.length; sI++) {
                var slotDiv = unrenderedSlots[sI];
                if (slotDiv.className.indexOf("adfuel-rendered") >= 0) {
                    /* Element already has an ad rendered in it. */
                    _dbgLog("Found rendered slot...", rocketeerSlot.rktr_slot_id);
                } else {
                    /* Clean element ready for rendering */
                    if (unrenderedSlots.length == 1 && _pageSlots[rocketeerSlot.rktr_slot_id]) {
                        /*
                         If there is only one element in unrenderedSlots and a GPT Slot object
                         already exists for this id, ignore the element count when updating the
                         slot and clear the slot.
                         */
                        var updatedSlot = _updateSlot(rocketeerSlot, true);

                        //clear the slot before rendering an ad
                        clearSlots(updatedSlot.rktr_slot_id);

                        return updatedSlot;
                    }

                    return _updateSlot(rocketeerSlot);
                }
            }
        }

        //slot not found
        _dbgLog("Not building slot... Can't Find Unrendered Slot On Page", rocketeerSlot.rktr_slot_id);
        return null;
    }

    function _buildSlot(rocketeerSlot) {

        var networkId = _options.networkId;

        if (rocketeerSlot.inherit && _inheritableAdUnit) {
            //for inheritable slots, override adunit if there's something to inherit
            rocketeerSlot.rktr_ad_id = _inheritableAdUnit;
        }

        _dbgLog("Building Slot", rocketeerSlot);
        addMetric({ type: 'timeline', id: 'building_gpt_slot_' + rocketeerSlot.rktr_slot_id, data: { id: 1, start: Date.now() } });
        addMetric({ type: 'slots', id: rocketeerSlot.rktr_slot_id, data: { build_start: Date.now() } });
        var adPath = '/' + networkId + "/" + rocketeerSlot.rktr_ad_id;
        var slotId = rocketeerSlot.rktr_slot_id;
        var isOutOfPageSlot = (rocketeerSlot.rktr_slot_id.indexOf("_oop") >= 1);
        var action = isOutOfPageSlot ? 'Defining OOP Slot' : 'Defining Standard Slot';
        var setSafeFrameConfig;
        if (typeof rocketeerSlot.safeframe_config !== 'undefined') {
            setSafeFrameConfig = rocketeerSlot.safeframe_config;
        }
        _googleApi.executeWhenAvailable(action, function() {
            if (isOutOfPageSlot) {
                _pageSlots[slotId] = _googleApi.defineOutOfPageSlot(adPath, slotId);
            } else {
                _pageSlots[slotId] = _googleApi.defineSlot(adPath, rocketeerSlot.sizes, slotId);
            }
            if (setSafeFrameConfig) {
                _googleApi.setSlotSafeFrameConfig(_pageSlots[slotId], setSafeFrameConfig);
            }
            addMetric({ type: 'counts', id: 'slots', data: '+' });
            _dbgLog("Slot: ", rocketeerSlot);
        });

        _dbgLog("Slots", _pageSlots);
        _googleApi.executeWhenAvailable('Defining slot targeting', function() {
            var slotTargeting = _getCombinedSlotTargeting(rocketeerSlot);
            for (var target in slotTargeting) {
                if (slotTargeting.hasOwnProperty(target)) {
                    var targetValue;
                    if (slotTargeting[target] && slotTargeting[target][1]) {
                        targetValue = JSON.stringify(slotTargeting[target][1]);
                    } else {
                        targetValue = "";
                    }
                    if (targetValue) {
                        targetValue = JSON.parse(targetValue);
                        var gptSlot = _pageSlots[slotId];

                        if (slotTargeting[target][0] == "exclusions") {
                            if (Array.isArray(slotTargeting[target][1])) {
                                for (var targetIndex in slotTargeting[target][1]) {
                                    if (slotTargeting[target][1].hasOwnProperty(targetIndex)) {
                                        targetValue = slotTargeting[target][1][targetIndex];
                                        _googleApi.setSlotCategoryExclusion(gptSlot, targetValue);
                                    }
                                }
                            } else {
                                _googleApi.setSlotCategoryExclusion(gptSlot, targetValue);
                            }
                        } else {
                            var key = slotTargeting[target][0];
                            _googleApi.setSlotTargeting(gptSlot, key, targetValue);
                        }
                    }
                }
            }
        });

        _dbgLog("Checking Responsive Mapping For Slot", rocketeerSlot.responsive, rocketeerSlot.responsive.length);
        rocketeerSlot.responsive = rocketeerSlot.responsive || [];
        if (rocketeerSlot.responsive.length > 0) {
            _buildSlotMapping(rocketeerSlot.rktr_slot_id, rocketeerSlot.responsive);
        }
        var metric = getMetricById('slots', rocketeerSlot.rktr_slot_id);
        var endTimestamp = Date.now();
        var elapsed = endTimestamp - metric.build_start + "ms";

        addMetric({ type: 'slots', id: rocketeerSlot.rktr_slot_id, data: { build_end: endTimestamp, build_elapsed: elapsed } });
        var allowed_sizes = [];
        for (var x = 0; x < rocketeerSlot.sizes.length; x++) {
            var size = rocketeerSlot.sizes[x];
            allowed_sizes.push(size.join("x"));
        }
        addMetric({ type: 'slots', id: rocketeerSlot.rktr_slot_id, data: { allowed_sizes: allowed_sizes } });
        addMetric({ type: 'timeline', id: 'building_gpt_slot_' + rocketeerSlot.rktr_slot_id, data: { id: 1, end: Date.now() } });
    }

    function _buildSlots(rocketeerSlots, options) {

        /*
         options:
         ignoreCheck: false

         */

        var builtSlots = [];

        function removeSlot(slot) {
            var index = _rocketeerSlots.indexOf(slot);
            if (index >= 0) {
                _rocketeerSlots.splice(index, 1);
            }
        }
        var currentMetric = getMetricById('timeline', 'building_gpt_slots');
        var id = currentMetric.length || 1;
        addMetric({ type: 'timeline', id: 'building_gpt_slots', data: { id: id, start: Date.now() } });
        for (var slotIndex = 0; slotIndex < rocketeerSlots.length; slotIndex++) {
            var rocketeerSlot = rocketeerSlots[slotIndex];

            var ignoreRenderCheck = options && options.ignoreCheck;
            var buildSlot = true;

            if (!ignoreRenderCheck) {
                //renderCheck may return an updatedSlot or null
                //if it updates the slot, it will modify rocketeerSlot
                if (!_renderCheck(rocketeerSlot)) {
                    //remove slot, which is no longer valid
                    removeSlot(rocketeerSlot);

                    buildSlot = false;
                }
            }

            if (buildSlot) {
                _buildSlot(rocketeerSlot);

                builtSlots.push(rocketeerSlot);

                removeSlot(rocketeerSlot);
            }
        }
        addMetric({ type: 'timeline', id: 'building_gpt_slots', data: { id: 1, slots: builtSlots.length, end: Date.now() } });
        return builtSlots;
    }

    //clear slots- optional slotIds (object or array)
    function clearSlots(slotIds) {
        slotIds = slotIds || [];

        if (!Array.isArray(slotIds)) {
            slotIds = [slotIds];
        }

        _dbgLog("Clearing Slots", { slotDivIds: slotIds });

        _googleApi.executeWhenAvailable('clearing slots', function() {

            //convert to slots
            //what if passed slotIds are invalid?
            var slots = [];

            if (slotIds.length > 0) {
                slots = slotIds.filter(function(slotId) {
                    return !!_pageSlots[slotId];
                }).map(function(slotId) {
                    return _pageSlots[slotId];
                });

                if (slots.length == 0) {
                    return;
                }
            }

            _googleApi.clearSlots(slots);
        });
    }

    //destroy slots- optional slotIds (object or array)
    function destroySlots(slotIds) {
        slotIds = slotIds || [];

        if (!Array.isArray(slotIds)) {
            slotIds = [slotIds];
        }

        _dbgLog("Destroying Slots", { slotDivIds: slotIds });

        _googleApi.executeWhenAvailable('destroying slots', function() {

            //convert to slots
            //what if passed slotIds are invalid?
            var slots = [];

            if (slotIds.length > 0) {
                slots = slotIds.filter(function(slotId) {
                    return !!_pageSlots[slotId];
                }).map(function(slotId) {
                    return _pageSlots[slotId];
                });

                if (slots.length == 0) {
                    return;
                }
            }

            _removeSlotRenderedClass(slotIds);

            _googleApi.destroySlots(slots);

            _removePageSlots(slotIds);
            _removeRocketeerSlots(slotIds);
        });
    }

    function _buildSlotMapping(slotId, responsiveMap) {
        //transform responsiveMap- convert string values to integers, allow for "suppress"
        for (var i = 0; i < responsiveMap.length; i++) {
            var val = JSON.parse(JSON.stringify(responsiveMap[i]));
            for (var x = 0; x < val.length; x++) {
                if (Array.isArray(val[x])) {
                    for (var y = 0; y < val[x].length; y++) {
                        if (Array.isArray(val[x][y])) {
                            for (var z = 0; z < val[x][y].length; z++) {
                                val[x][y][z] = parseInt(val[x][y][z]);
                            }

                        } else {
                            if (parseInt(val[x][y]) >= 0) {
                                val[x][y] = parseInt(val[x][y]);
                            } else {
                                val[x] = [];
                            }
                        }
                    }
                } else {
                    val[x] = [];
                }
            }
            responsiveMap[i] = val;
        }

        _googleApi.executeWhenAvailable('setting slot mappings', function() {
            _googleApi.defineSlotSizeMapping(_pageSlots[slotId], responsiveMap);
        });
    }

    function _updateSlot(slot, ignoreCount) {

        _dbgLog("Checking to see if slot div id needs updated.", { slot: slot });

        var orig_slot_id = slot.rktr_slot_id;
        var new_slot_id = orig_slot_id;
        var idArray = orig_slot_id.split("_");
        var incrementer = idArray[idArray.length - 1];
        var pageDivs = document.querySelectorAll("div#" + orig_slot_id);

        if (pageDivs.length > 1 || (pageDivs.length == 1 && ignoreCount)) {
            _dbgLog("updating slot div id.", { slot: slot });

            while (_pageSlots[new_slot_id]) {
                //slot exists, so increment
                if (idArray.length == 3) {
                    incrementer = _generateSingletonId();
                } else {
                    incrementer = parseInt(incrementer) + 1;
                    if (incrementer < 10) {
                        incrementer = "0" + String(incrementer);
                    } else {
                        incrementer = String(incrementer);
                    }
                }
                idArray[idArray.length - 1] = incrementer;
                new_slot_id = idArray.join("_");
            }

            _updateSlotId(slot, new_slot_id, orig_slot_id);
            _updateDivId(orig_slot_id, new_slot_id);
        }

        return slot;
    }

    function _updateSlotId(slot, new_slot_id, orig_slot_id) {
        slot.rktr_slot_id = new_slot_id;

        try {
            var SlotIDChangeEvent = new CustomEvent('SlotIdChange', {
                "detail": {
                    "asset": slot,
                    "originalId": orig_slot_id,
                    "newId": new_slot_id
                }
            });
            document.dispatchEvent(SlotIDChangeEvent);

        } catch (ex) {
            _errLog('error dispatching custom Event: SlotIdChange', { error: ex });
        }
    }

    function _updateDivId(orig_slot_id, new_slot_id) {
        var pageDivs = document.querySelectorAll("div#" + orig_slot_id);
        if (pageDivs.length > 0) {
            for (var slotIndex = 0; slotIndex < pageDivs.length; slotIndex++) {
                var el = pageDivs[slotIndex];
                if ((el.className.indexOf('adfuel-rendered') < 0 && pageDivs.length > 1) || pageDivs.length == 1) {
                    el.id = new_slot_id;
                }
            }
        }
    }

    function _isQueueDispatchable() {
        return _initialized && _DOMLoadEventFired && _preQueueExecuting == false && _postQueueExecuting == false;
    }

    //executed from init and ready, queue is only dispatchable once
    function _dispatchAllQueues() {
        if (_isQueueDispatchable()) {
            if (_delayedDispatchQueues.length > 0 || _userDispatchedQueues.length > 0) {
                _dbgLog("Processing delayed dispatch queues");
                //process all delayed dispatch queue functions
                var i;
                for (i = 0; i < _delayedDispatchQueues.length; i++) {
                    _delayedDispatchQueues[i]();
                }
                _dbgLog("User-Dispatched Queues: ", _userDispatchedQueues);
                for (i = 0; i < _userDispatchedQueues.length; i++) {
                    _userDispatchedQueues[i]();
                }
                _delayedDispatchQueues.length = 0;
                _userDispatchedQueues.length = 0;
            } else if (_options.autoDispatch) {
                _dbgLog("Processing all queues");
                //dispatch whatever has been queued
                AdFuel.dispatchQueue();
            }
        }
    }

    function dispatchQueue(dispatchOptions) {
        /*
         dispatchOptions:
         preDispatchCallback
         postDispatchCallback
         ignoreCheck: false
         sync: false
         syncSlots: []
         slots: []
         exclude: []
         maintainCorrelator: false
         */

        if (!_isQueueDispatchable()) {
            _dbgLog("Delaying Queue Dispatch");
            _delayedDispatchQueues.push(function() {
                dispatchQueue(dispatchOptions);
            });
            return;
        }

        var currentMetric = getMetricById('timeline', 'dispatch_queue');
        var id = currentMetric.length ? currentMetric.length + 1 : 1;
        addMetric({ type: 'timeline', id: 'dispatch_queue_called', data: { id: id, timestamp: Date.now(), slots: _rocketeerSlots.length } });

        dispatchOptions = dispatchOptions || {};

        _dbgLog("Registry", AdFuel.registry);
        _dbgLog("SlotQueue: ", _rocketeerSlots);
        _dbgLog("Dispatch Options: ", dispatchOptions);

        if (dispatchOptions.slots && dispatchOptions.slots.length > 0) {
            for (var slotIndex = 0; slotIndex < dispatchOptions.slots.length; slotIndex++) {
                if (_excludedSlotIds.indexOf(dispatchOptions.slots[slotIndex]) >= 0) {
                    _excludedSlotIds.splice(_excludedSlotIds.indexOf(dispatchOptions.slots[slotIndex]), 1);
                }
            }
        }
        if (_rocketeerSlots.length > 0) {
            //display all slots or just the ones in requestOptions.slots
            //exclude any in requestOptions.exclude
            //if requestOptions.slots are not provided, ensure rocketeer slot is not in _excludeSlotIds (set via QueueRegistery/options.exclude)
            var slotsToDisplay = _rocketeerSlots.filter(function(slot) {
                var test1 = (!dispatchOptions.slots || dispatchOptions.slots.length == 0 || dispatchOptions.slots.indexOf(slot.rktr_slot_id) >= 0);
                var test2 = (!dispatchOptions.exclude || dispatchOptions.exclude.length == 0 || dispatchOptions.exclude.indexOf(slot.rktr_slot_id) < 0);
                var test3 = ((dispatchOptions.slots && dispatchOptions.slots.length > 0) || _excludedSlotIds.indexOf(slot.rktr_slot_id) < 0);
                var validSlot = test1 && test2 && test3;
                return validSlot;
            });
            //remove excluded slot ids if explicitly requested
            if (dispatchOptions.slots && dispatchOptions.slots.length > 0 && _excludedSlotIds.length > 0) {
                for (var i = 0; i < dispatchOptions.slots.length; i++) {
                    var indexToRemove = _excludedSlotIds.indexOf(dispatchOptions.slots[i]);
                    if (indexToRemove >= 0) {
                        _excludedSlotIds.splice(indexToRemove, 1);
                    }
                }
            }

            var builtSlots = _buildSlots(slotsToDisplay, dispatchOptions);

            if (builtSlots.length > 0) {

                var currentCount = parseInt(getMetricById('counts', 'requests').length || 0) + 1;
                var dispatchDateTime = Date.now();
                addMetric({ type: 'counts', id: 'requests', data: '+' });
                addMetric({ type: 'requests', id: currentCount, data: { start: dispatchDateTime, options: dispatchOptions, queue: [] } });
                _buildPageLevelGPTObject();

                //wait on all registered modules- passing clone of slotQueue
                var builtSlotsClone = _clone(builtSlots);
                var requests = getMetricById('counts', 'requests');
                var queueIndex = 0;
                if (requests.length > 0) {
                    queueIndex = requests.length - 1;
                }

                var builtSlotIds = [];
                for (var slotId = 0; slotId < builtSlotsClone.length; slotId++) {
                    var slot = builtSlotsClone[slotId];
                    builtSlotIds.push(slot.rktr_slot_id);
                }
                addMetric({ type: 'requests', id: currentCount, data: { queue: builtSlotIds } });

                var passedOptions = Object.getOwnPropertyNames(dispatchOptions);
                if (passedOptions.length > 0) {
                    addMetric({ type: 'requests', id: currentCount, data: { options: dispatchOptions } });
                }

                var preDispatchCallbacks = _registeredModules.filter(function(item) {
                    return !!item.callbacks.preDispatchCallback;
                }).map(function(item) {
                    return _buildAsyncCallback(item.name, function(callback) {
                        item.callbacks.preDispatchCallback(builtSlotsClone, callback);
                    }, 'preDispatch');
                });

                if (dispatchOptions && dispatchOptions.preDispatchCallback) {
                    //add optional preDispatchCallback
                    preDispatchCallbacks.push(
                        _buildAsyncCallback('dispatchOptions', function(callback) {
                            dispatchOptions.preDispatchCallback(builtSlotsClone, callback);
                        }, 'preDispatch')
                    );
                }

                var callbackTimestamp = Date.now();
                for (var x = 0; x < preDispatchCallbacks.length; x++) {
                    addMetric({ type: 'modules', id: preDispatchCallbacks[x].name, data: { callback: 'preDispatch', start: callbackTimestamp } });
                    addMetric({ type: 'timeline', id: preDispatchCallbacks[x].name + "_preDispatch", data: { start: callbackTimestamp } });
                }
                async.parallelWithTimeout('preDispatch', _options.dispatchCallbackTimeoutInMilliseconds, preDispatchCallbacks, function(err) {
                    if (err) {
                        _dbgLog('Error calling preDispatchCallbacks for registered modules', { error: err });
                    }
                    try {
                        var PreDispatchCompleteEvent = new CustomEvent('PreDispatchComplete', {
                            "detail": {
                                "slots": _rocketeerSlots.length
                            }
                        });
                        document.dispatchEvent(PreDispatchCompleteEvent);
                    } catch (ex) {
                        _errLog('error dispatching custom Event: PreDispatchComplete', { error: ex });
                    }

                    var currentMetric = getMetricById('timeline', 'dispatch_queue');
                    var id = currentMetric.length ? currentMetric.length + 1 : 1;
                    addMetric({ type: 'timeline', id: 'dispatch_queue', data: { id: id, start: Date.now(), slots: _rocketeerSlots.length } });

                    var displayedSlots = _sendRequest(builtSlots, dispatchOptions);

                    var displayedSlotsClone = _clone(displayedSlots);

                    //wait on all registered modules- passing clone of slotQueue
                    var postDispatchCallbacks = _registeredModules.filter(function(item) {
                        return !!item.callbacks.postDispatchCallback;
                    }).map(function(item) {
                        return _buildAsyncCallback(item.name, function(callback) {
                            item.callbacks.postDispatchCallback(displayedSlotsClone, callback);
                        }, 'postDispatch');
                    });

                    for (var x = 0; x < displayedSlotsClone.length; x++) {
                        //_consoleContent.Slots[displayedSlotsClone[x].rktr_slot_id].Status = "Dispatched";
                    }

                    if (dispatchOptions && dispatchOptions.postDispatchCallback) {
                        //add optional postDispatchCallback
                        postDispatchCallbacks.push(
                            _buildAsyncCallback('dispatchOptions', function(callback) {
                                dispatchOptions.postDispatchCallback(displayedSlotsClone, callback);
                            }, 'postDispatch')
                        );
                    }

                    var postTimestamp = Date.now();
                    _timeLog(timestamp() + " Starting postDispatch Callbacks");
                    for (var x = 0; x < postDispatchCallbacks.length; x++) {
                        addMetric({ type: 'modules', id: postDispatchCallbacks[x].name, data: { callback: 'postDispatch', start: postTimestamp } });
                        addMetric({ type: 'timeline', id: postDispatchCallbacks[x].name + "_postDispatch", data: { start: postTimestamp } });
                    }
                    async.parallelWithTimeout('postDispatch', _options.dispatchCallbackTimeoutInMilliseconds, postDispatchCallbacks, function(err) {
                        if (err) {
                            _dbgLog('error calling postDispatchCallbacks for registered modules', { error: err });
                        }
                        try {
                            var PostDispatchCompleteEvent = new CustomEvent('PostDispatchComplete', {
                                "detail": {
                                    "slots": displayedSlotsClone.length
                                }
                            });
                            document.dispatchEvent(PostDispatchCompleteEvent);
                        } catch (ex) {
                            _errLog('error dispatching custom Event: PostDispatchComplete', { error: ex });
                        }
                        _timeLog(timestamp() + " End postDispatch Callbacks");

                        _dbgLog("Slot Queue After Dispatch:", _rocketeerSlots);
                    });
                    _timeLog(timestamp() + " End Dispatch of Queue: " + displayedSlots.length + " slots");
                    var dispatchEnd = Date.now();
                    addMetric({ type: 'timeline', id: 'dispatch_queue', data: { id: id, end: dispatchEnd, slots: displayedSlotsClone.length } });
                    var metric = getMetricById('requests', currentCount)[0];
                    var elapsed = dispatchEnd - metric.start + "ms";
                    addMetric({ type: 'requests', id: currentCount, data: { end: dispatchEnd, elapsed: elapsed } });
                });
            }
        }
    }

    var _loadJSON = function(url, callback) {
        url = url.replace(/^(https?\:)?\/\/[i|z|s](sl)?(.cdn.turner.com\/ads\/.*?\.).*/, function(url, matchA, matchB, matchC) {
            if (matchC && matchA) {
                return matchA + "ssl" + matchC + "json";
            } else if (matchC){
                return "https://ssl" + matchC + "json";
            } else {
                return matchA + "ssl" + matchB + "json";
            }
        });
        var req = new XMLHttpRequest();
        req.onload = function() {
            var data = this.response;
            _dbgLog("JSON Request Finished: ", data);
            try {
                data = { response: JSON.parse(data).registry, error: false };
                _dbgLog("JSON Data Parsed:", data);
                callback(data);
            }catch(err){ 
                _dbgLog("JSON Request Failed: ", err);
                data = { response: err, error: true };
                callback(data);
            }
        };
        try {
            req.open('GET', url, true);
            _dbgLog("Requesting JSON: ", url);
            req.setRequestHeader('Accept', 'application/json');
            req.send();
        } catch (err) {
            _dbgLog("JSON Request Failed: ", err);
            data = { response: err, error: true };
            callback(data);
        }
    };    


    function queueRegistry(url, queueOptions) {
        /*

         queueOptions:
         preDispatchCallback
         postDispatchCallback
         sync: false
         syncSlots: []
         slots: []
         exclude: []
         maintainCorrelator: false
         dispatch: false  (options.autodispatch is ignored)
         slotMap: {}

         */
        _dbgLog("Queueing Registry: ", url, queueOptions);
        _timeLog(timestamp() + " Start Queuing of Registry: " + url);
        queueOptions = queueOptions || {
            //set based on autoDispatch
            dispatch: _options.autoDispatch
        };


        if (queueOptions.exclude && queueOptions.exclude.length > 0) {
            //add non-duplicating exclude slotIds
            for (var i = 0; i < queueOptions.exclude.length; i++) {
                var slotId = queueOptions.exclude[i];
                if (_excludedSlotIds.indexOf(slotId) < 0) {
                    _excludedSlotIds.push(slotId);
                }
            }
        }

        function addScriptTag(url) {
            var a = document,
                b = a.createElement("script"),
                c = a.getElementsByTagName("script")[0],
                d = /^(complete|loaded)$/,
                e = false;
            b.type = "text/javascript";
            b.src = url;
            b.onload = b.onreadystatechange = function() {
                if (!e && !(('readyState' in b) && d.test(b.readyState))) {
                    b.onload = b.onreadystatechange = null;
                    e = true;
                    scriptComplete();
                }
            };
            c.parentNode.insertBefore(b, c);
        }

        function scriptComplete() {
            if (queueOptions.dispatch) {
                AdFuel.dispatchQueue(queueOptions);
            }
            addMetric({ type: 'timeline', id: 'Queueing registry via Script', data: { timestamp: Date.now() } });
        }

        function filterSlots(registry, slots) {
            var returnData = [];
            returnData.push(registry[0]);
            if (slots && slots.length > 0) {
                for (var x = 1; x < registry.length; x++) {
                    if (slots.indexOf(registry[x].rktr_slot_id) >= 0) {
                        returnData.push(registry[x]);
                    }
                }
            } else {
                returnData = registry;
            }
            return returnData;
        }

        function requestComplete(data) {
            if (data.error == true) {
                _dbgLog("Using Script Tag Method...");
                addScriptTag(url);
            } else {
                addMetric({
                    type: 'timeline',
                    id: 'Queueing registry via JSON',
                    data: { timestamp: Date.now() }
                });
                data.response = filterSlots(data.response, queueOptions.slots);
                window.AdFuel.registry.push(data.response, queueOptions);
                _timeLog(timestamp() + " End Queuing of Registry: " + url);
            }
        }

        _dbgLog("Trying JSON Request First...");
        _loadJSON(url, requestComplete);
    }

    function _startInterval(length, steps, oninterval) {
        steps = steps || 10;
        var speed = length / steps,
            count = 0,
            start = Date.now();

        function instance() {
            if (count++ == steps) {
                //return true to continue repeating
                var continueInterval = oninterval();

                if (continueInterval) {
                    _startInterval(length, steps, oninterval);
                }

            } else {
                //wait longer, basing delay upon remaining time
                var diff = (Date.now() - start) - (count * speed);
                window.setTimeout(instance, (speed - diff));
            }
        }

        window.setTimeout(instance, speed);
    }

    function _startTimer(length, steps, oninstance, oncomplete) {
        steps = steps || 10;
        var speed = length / steps,
            count = 0,
            start = Date.now();

        function instance() {
            if (count++ == steps) {
                oncomplete(steps, count);

            } else {
                oninstance(steps, count);

                var diff = (Date.now() - start) - (count * speed);
                window.setTimeout(instance, (speed - diff));
            }
        }

        window.setTimeout(instance, speed);
    }

    function refresh(slotIds, refreshOptions) {
        /***
         slotIds: optional array to refresh (empty/null=refresh all)

         refreshOptions:
         pageload: BOOLEAN (default is true)
         interval: INT
         preRefreshCallback: function (optional)
         postRefreshCallback: function (optional)
         maintainCorrelator: BOOLEAN (default is true)
         ***/
        if (slotIds && !Array.isArray(slotIds) && !refreshOptions) {
            //assume user passed refreshOptions as first argument
            refreshOptions = slotIds;
            slotIds = [];
        } else {
            refreshOptions = refreshOptions || {};
        }

        if (!slotIds) {
            slotIds = [];
        }

        _timeLog(timestamp() + " Begin Slot Refresh: " + slotIds.length + " slots");
        var currentMetric = getMetricById('timeline', 'refresh');
        var id = currentMetric.length || 1;
        addMetric({ type: 'timeline', id: 'refresh', data: { id: id, slots: slotIds, options: refreshOptions, start: Date.now() } });

        //default pageload to true
        refreshOptions.pageload = (refreshOptions.pageload == undefined) ? true : refreshOptions.pageload;
        refreshOptions.maintainCorrelator = (refreshOptions.maintainCorrelator == undefined) ? true : refreshOptions.maintainCorrelator;
        _dbgLog("Refresh Options", refreshOptions);

        var refreshSlots = function() {
            _dbgLog("Testing Refresh: ", { focused: _focused, refreshOnFocusOnly: _options.refreshOnFocusOnly, test: (_focused || !_options.refreshOnFocusOnly) });
            if (_focused || !_options.refreshOnFocusOnly) {

                var slotsToRefresh = [];
                var slotIdsToRefresh = [];
                var slotIdsToCheck = [];

                if (slotIds.length == 0) {
                    //refresh all- build list allowing for repeated iterations via interval option
                    for (var slotId in _pageSlots) {
                        if (_pageSlots.hasOwnProperty(slotId)) {
                            slotIdsToCheck.push(slotId);
                        }
                    }
                } else {
                    slotIdsToCheck = slotIds;
                }

                for (var i = 0; i < slotIdsToCheck.length; i++) {
                    var slotId = slotIdsToCheck[i];
                    if (document.getElementById(slotId)) {
                        addMetric({ type: 'slots', id: slotId, data: { refresh_start: Date.now() } });
                        var slot = _pageSlots[slotId];
                        if (slot) {
                            slotsToRefresh.push(slot);
                            slotIdsToRefresh.push(slotId);
                        }
                    } else {
                        _dbgLog('Cannot find element on page to refresh: ' + slotId);
                    }
                }

                if (slotIds.length > 0 && slotIdsToRefresh.length == 0) {
                    //caller sent all invalid slotIds to refresh, so do nothing
                    return;
                }

                //wait on all registered modules, preRefreshCallback
                var preRefreshCallbacks = _registeredModules.filter(function(item) {
                    return !!item.callbacks.preRefreshCallback;
                }).map(function(item) {
                    return _buildAsyncCallback(item.name, function(callback) {
                        item.callbacks.preRefreshCallback(slotIdsToRefresh, callback);
                    }, 'preRefresh');
                });

                if (refreshOptions.preRefreshCallback) {
                    //add optional preRefreshCallback
                    preRefreshCallbacks.push(
                        _buildAsyncCallback('refreshOptions', function(callback) {
                            refreshOptions.preRefreshCallback(slotIdsToRefresh, callback);
                        }, 'preRefresh')
                    );
                }


                var refreshTimestamp = Date.now();
                _timeLog(timestamp() + " Begin preRefreshCallbacks");
                for (var x = 0; x < preRefreshCallbacks.length; x++) {
                    addMetric({ type: 'modules', id: preRefreshCallbacks[x].name, data: { callback: 'preRefresh', start: refreshTimestamp } });
                    addMetric({ type: 'timeline', id: preRefreshCallbacks[x].name + "_preRefresh", data: { start: refreshTimestamp } });
                }
                async.parallelWithTimeout('preRefresh', _options.refreshCallbackTimeoutInMilliseconds, preRefreshCallbacks, function(err) {
                    if (err) {
                        _dbgLog('error calling preRefreshCallbacks for all registered modules', { error: err });
                    }
                    try {
                        var PreRefreshCompleteEvent = new CustomEvent('PreRefreshComplete', {
                            "detail": {
                                "slots": slotIdsToRefresh
                            }
                        });
                        document.dispatchEvent(PreRefreshCompleteEvent);
                    } catch (ex) {
                        _errLog('error dispatching custom Event: PreRefreshComplete', { error: ex });
                    }
                    _timeLog(timestamp() + " End preRefreshCallbacks");

                    clearSlots(slotIdsToRefresh);

                    // _googleApi.updateCorrelator();

                    if (refreshOptions.pageload) {
                        _googleApi.setTargeting("pageload", "ref");
                    } else {
                        _googleApi.clearTargeting("pageload");
                    }

                    _googleApi.refreshSlots(slotsToRefresh, refreshOptions);

                    //assume all slots requested were refreshed
                    var slotIdsRefreshed = slotIdsToRefresh;
                    var refreshTimestamp = new Date();
                    for (var x = 0; x < slotIdsToRefresh.length; x++) {
                        var divId = slotIdsToRefresh[x];
                        var metric = getMetricById('slots', divId);
                        var endTimestamp = Date.now();
                        var elapsed = endTimestamp - metric.refresh_start + "ms";
                        addMetric({ type: 'slots', id: divId, data: { refresh_end: endTimestamp, refresh_elapsed: elapsed } });
                        addMetric({ type: 'counts', id: divId + "_refreshes", data: '+' });
                    }

                    var postRefreshCallbacks = _registeredModules.filter(function(item) {
                        return !!item.callbacks.postRefreshCallback;
                    }).map(function(item) {
                        return _buildAsyncCallback(item.name, function(callback) {
                            item.callbacks.postRefreshCallback(slotIdsRefreshed, callback);
                        }, 'postRefresh');
                    });

                    if (refreshOptions.postRefreshCallback) {
                        //add optional postRefreshCallback
                        postRefreshCallbacks.push(
                            _buildAsyncCallback('refreshOptions', function(callback) {
                                refreshOptions.postRefreshCallback(slotIdsRefreshed, callback);
                            }, 'postRefresh')
                        );
                    }

                    var postRefreshTimestamp = Date.now();
                    for (var x = 0; x < postRefreshCallbacks.length; x++) {
                        addMetric({ type: 'modules', id: postRefreshCallbacks[x].name, data: { callback: 'postRefresh', start: postRefreshTimestamp } });
                        addMetric({ type: 'timeline', id: postRefreshCallbacks[x].name + "_postRefresh", data: { start: postRefreshTimestamp } });
                    }
                    //note: may occur before GPT refresh completes
                    async.parallelWithTimeout('postRefresh', _options.refreshCallbackTimeoutInMilliseconds, postRefreshCallbacks, function(err) {
                        if (err) {
                            _dbgLog('error calling postRefreshCallbacks for all registered modules', { error: err });
                        }
                        try {
                            var PostRefreshCompleteEvent = new CustomEvent('PostRefreshComplete', {
                                "detail": {
                                    "slots": slotIdsToRefresh
                                }
                            });
                            document.dispatchEvent(PostRefreshCompleteEvent);
                        } catch (ex) {
                            _errLog('error dispatching custom Event: PostRefreshComplete', { error: ex });
                        }
                        _timeLog(timestamp() + " End postRefreshCallbacks");
                    });
                    _timeLog(timestamp() + " End Slot Refresh: " + slotIds.length + " slots");
                    addMetric({ type: 'timeline', id: 'refresh', data: { id: id, slots: slotIds, options: refreshOptions, end: Date.now() } });
                });
            }
        };

        function startInterval(interval) {
            _dbgLog('starting refresh interval: ' + interval, refreshOptions);

            var intervalInMilliseconds = interval * 1000;
            _startInterval(intervalInMilliseconds, 5, function() {
                //if the interval has been removed, stop repeating
                if (!refreshOptions.interval || parseInt(refreshOptions.interval) == 0) {
                    _dbgLog('stopping refresh interval: ' + interval, refreshOptions);
                    return false;
                }

                //if the interval has changed, start new interval and stop repeating
                var currentInterval = parseInt(refreshOptions.interval);
                if (interval != currentInterval) {
                    _dbgLog('changing refresh interval: ' + interval, refreshOptions);
                    startInterval(currentInterval);
                    return false;
                }

                //interval has been reached, so refresh spots
                refreshSlots();

                //repeat interval
                return true;
            });
        }

        if (refreshOptions.interval && parseInt(refreshOptions.interval) > 0) {
            var interval = parseInt(refreshOptions.interval);
            startInterval(interval);
        } else {
            refreshSlots();
        }
    }

    var metrics = {};

    function getMetricTypes() {
        return Object.getOwnPropertyNames(metrics);
    }

    function getMetricsByType(type) {
        return metrics[type] || {};
    }

    function getMetricById(type, id) {
        if (type == 'counts' && !metrics[type][id]) {
            return 0;
        } else if (type == 'timeline' && id == 'request_to_dfp') {
            if (!metrics[type][id]) {
                return [];
            }
        }
        return metrics[type][id] || {};
    }

    function addMetric(metricObject) {
        /*
         Sample Metric Object
         {
         type: timeline|counts|configuration|requests|page|registries|modules|slots
         id: <STRING>
         data: <ANY> For type=counts this should be '+' or '-' to increment or decrement current count.
                For timeline metrics, data should be an object with an index property to use for updates.
                ie: { index: 1, options: { <some options> }, slots: [ 'ad_bnr_atf_01' ], start: <timestamp> }
                On update, the indexes should match:
                ie: { index: 1, end: <timestamp> }
         }
         */
        _dbgLog("Adding Metric: ", JSON.parse(JSON.stringify(metricObject)));

        var metric;
        var newMetric = false;

        if (!metrics[metricObject.type]) {
            // Metric type doesn't exist... create it.
            metrics[metricObject.type] = {};
        }
        if (!metrics[metricObject.type][metricObject.id]) {
            metrics[metricObject.type][metricObject.id] = [];
            newMetric = true;
        }
        var metricType = metrics[metricObject.type];

        if (!newMetric) {
            metric = getMetricById(metricObject.type, metricObject.id);
        } else {
            metric = [];
        }

        switch (metricObject.type) {
            case 'counts':
                if (metric.length == 0) { metric = 0; }
                var currentCount = parseInt(metric);
                if (metricObject.data == '+') {
                    currentCount = currentCount + 1;
                } else if (metricObject.data == '-') {
                    currentCount = currentCount - 1;
                } else {
                    _dbgLog("Metric data contains no operator for counting metrics.", metricObject);
                    return false;
                }
                metrics[metricObject.type][metricObject.id] = currentCount;
                _dbgLog("Metrics updated with: ", metricObject, metrics);
                break;
            case 'modules':
                if (metricObject.data.callback) {
                    var module = _registeredModules.filter(function(item) {
                        return item.name == metricObject.id;
                    });
                    if (Array.isArray(module)) {
                        module = module[0];
                    }
                    if (metric.length == 0) {
                        metric = {};
                    }
                    var callbackNames = Object.getOwnPropertyNames(module.callbacks);
                    var callbackNameFromData = metricObject.data.callback + "Callback";
                    if (callbackNames.indexOf(callbackNameFromData) >= 0) {
                        for (var name = 0; name < callbackNames.length; name++) {
                            if (!metric[callbackNames[name]]) {
                                metric[callbackNames[name]] = {};
                            }
                            delete metricObject.data.callback;
                            metric[callbackNames[name]] = _merge(metric[callbackNames[name]], metricObject.data);
                        }
                    }
                    metrics[metricObject.type][metricObject.id] = metric;
                } else {
                    var data = _merge(metric, metricObject.data);
                    metrics[metricObject.type][metricObject.id] = data;
                    _dbgLog("Metrics updated with: ", metricObject, metrics);
                }
                break;
            case 'requests':
            case 'timeline':
                var metricIndex = metricObject.data.id || 1;
                var data = {};
                if (metric.length > 0) {
                    data = metric[metricIndex - 1];
                }
                data = _merge(data, metricObject.data);
                metrics[metricObject.type][metricObject.id][metricIndex - 1] = data;
                _dbgLog("Metrics updated with: ", metricObject, metrics);
                break;
            case 'slots':
            default:
                var data = _merge(metric, metricObject.data);
                metrics[metricObject.type][metricObject.id] = data;
                _dbgLog("Metrics updated with: ", metricObject, metrics);
                break;

        }

        // Timeout is not implemented as there is no waiting on these callbacks to complete.
        var metricUpdateCallbacks = _registeredModules.filter(function(item) {
            return !!item.callbacks.metricUpdateCallback;
        }).map(function(item) {
            return _buildAsyncCallback(item.name, function(callback) {
                item.callbacks.metricUpdateCallback(metricObject, callback);
            }, 'metricUpdate');
        });
        for (var x = 0; x < metricUpdateCallbacks.length; x++) {
            var item = metricUpdateCallbacks[x];
            item.callback();
        }
        return true;
    }

    // return this API object to modules when they register.
    var _metricApi = { metrics: metrics, getMetricTypes: getMetricTypes, getMetricsByType: getMetricsByType, getMetricById: getMetricById, addMetric: addMetric };

    //combined google APIs
    var _googleApi = function createGoogleAPI() {

        //default window.googletag.cmd
        window.googletag = window.googletag || {};
        window.googletag.cmd = window.googletag.cmd || [];

        var _pubAdsConfiged = false;
        var _isGPTAvailable = false;

        function isAvailable(action, obj) {
            if (!_isGPTAvailable) {
                _isGPTAvailable = window.googletag.apiReady && window.googletag.pubads;

                if (!_isGPTAvailable && action) {
                    _errLog("GPT is unavailable - " + action, obj);
                }
            }

            return _isGPTAvailable;
        }

        function executeWhenAvailable(action, fn) {
            window.googletag.cmd.push(fn);
        }

        function configurePubAds() {
            if (!_pubAdsConfiged) {
                //only execute once
                _pubAdsConfiged = true;

                AdFuel.requestScriptText += 'googletag.pubads().collapseEmptyDivs(true);\n';
                AdFuel.requestScriptText += 'googletag.pubads().enableAsyncRendering();\n';
                AdFuel.requestScriptText += 'googletag.pubads().enableSingleRequest();\n';
                AdFuel.requestScriptText += 'googletag.pubads().disableInitialLoad();\n';
                AdFuel.requestScriptText += 'googletag.enableServices();\n';

                executeWhenAvailable("Sending Request", function pushGPTServices() {
                    window.googletag.pubads().addEventListener('impressionViewable', function(event) {
                        var detail = event;
                        var slotViewableEvent = new CustomEvent('SlotViewable', {
                            "detail": detail
                        });
                        document.dispatchEvent(slotViewableEvent);

                    });
                    window.googletag.pubads().addEventListener('slotVisibilityChanged', function(event) {
                        var detail = event;
                        var slotVisibilityChanged = new CustomEvent('SlotVisibilityChanged', {
                            "detail": detail
                        });
                        document.dispatchEvent(slotVisibilityChanged);

                    });
                    window.googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                        try {
                            var detail = {};
                            var el = null;
                            if (event.slot) { detail.asset = event.slot; }
                            if (event.slot.getTargeting("pos")) { detail.pos = event.slot.getTargeting("pos"); }
                            if (event.isEmpty) { detail.empty = true; } else { detail.empty = false; }
                            if (event.size) { detail.renderedSize = event.size; }
                            if (event.creativeId) { detail.creativeId = event.creativeId; }
                            if (event.lineItemId) { detail.lineItemId = event.lineItemId; }
                            if (event.serviceName) { detail.serviceName = event.serviceName; }
                            if (event.slot.getSlotElementId()) {
                                detail.divId = event.slot.getSlotElementId();
                                el = document.getElementById(detail.divId);
                            }
                            var slotMetrics = getMetricById('slots', detail.divId);
                            var refreshStart = false;
                            for (var metricID in slotMetrics) {
                                if (metricID == ("refresh_start") >= 0) {
                                    refreshStart = true;
                                }
                            }
                            var renderEnd = Date.now();
                            var metric = getMetricById('slots', detail.divId);
                            var elapsed = renderEnd - metric.render_start + "ms";
                            if (!refreshStart) {
                                addMetric({ type: 'timeline', id: detail.divId + '_rendered', data: { id: 1, start: metric.render_start, end: renderEnd, elapsed: elapsed } });
                            }
                            addMetric({ type: 'slots', id: detail.divId, data: { render_end: renderEnd, render_elapsed: elapsed, advertiserId: detail.advertiserId, campaignId: detail.campaignId, creativeId: event.creativeId, lineItemId: event.lineItemId } });
                            try {
                                addMetric({ type: 'slots', id: detail.divId, data: { inventory_url: 'https://www.google.com/dfp/inventory?hl=en-US#inventory/q=' + event.slot.getAdUnitPath(), responsive_map: event.slot.getResponsiveMap() } });
                            } catch (err) {}
                            try {
                                addMetric({ type: 'slots', id: detail.divId, data: { targeting_map: event.slot.getTargetingMap() } });
                            } catch (err) {}
                            if (!detail.empty) {
                                addMetric({ type: 'slots', id: detail.divId, data: { rendered_size: event.size.join("x") } });
                            }
                            addMetric({ type: 'slots', id: detail.divId, data: { empty: detail.empty } });

                            _dbgLog("GPTRenderComplete Details: ", detail);
                            var renderCompleteEvent = new CustomEvent('GPTRenderComplete', {
                                "detail": detail
                            });
                            document.dispatchEvent(renderCompleteEvent);
                        } catch (ex) {
                            _errLog('error dispatching custom Event: GPTRenderComplete', { error: ex });
                        }
                    });
                    window.googletag.pubads().addEventListener('slotOnload', function(event) {
                        var detail = event;
                        var gptSlotLoaded = new CustomEvent('GPTSlotLoaded', {
                            "detail": detail
                        });
                        document.dispatchEvent(gptSlotLoaded);
                    });

                    window.googletag.pubads().collapseEmptyDivs(true);
                    window.googletag.pubads().enableAsyncRendering();
                    window.googletag.pubads().enableSingleRequest();
                    window.googletag.pubads().disableInitialLoad();
                    window.googletag.enableServices();
                });
            }
        }

        function clearTargeting(key) {
            var success = false;

            if (isAvailable('clearing target', { key: (!!key ? key : 'all') })) {
                if (key) {
                    window.googletag.pubads().clearTargeting(key);
                } else {
                    window.googletag.pubads().clearTargeting();
                }

                success = true;
            }

            return success;
        }

        function setTargeting(key, value) {
            var success = false;
            if (isAvailable('setting target', { key: key, value: value })) {
                //this was in refresh() to setTargeting
                AdFuel.requestScriptText += "googletag.pubads().setTargeting('" + key + "', '" + value + "');\n";
                window.googletag.pubads().setTargeting(key, value);

                success = true;
            }

            return success;
        }

        function setLocation(latitude, longitude) {
            var success = false;
            if (isAvailable('setting location', { latitude: latitude, logitude: longitude })) {
                window.googletag.pubads().setLocation(latitude, longitude);
                success = true;
            }
            return success;
        }

        function setChildDirectedTreatmentTag(value) {
            var success = false;
            if (isAvailable('setting child directed treatment tag: ' + value)) {
                window.googletag.pubads().clearTagForChildDirectedTreatment();
                window.googletag.pubads().setTagForChildDirectedTreatment(value);
                success = true;
            }
            return success;
        }


        function setSafeFrameConfig(value) {
            var success = false;
            value.sandbox = (value.sandbox == true || value.sandbox == "true")
            value.allowOverlayExpansion = (value.allowOverlayExpansion == true || value.allowOverlayExpansion == "true");
            value.allowPushExpansion = (value.allowPushExpansion == true || value.allowPushExpansion == "true");
            if (value.sandbox != true) {
                _dbgLog("Removing invalid sandbox value");
                delete value.sandbox;
            }
            if (isAvailable('setting SafeFrame config tag: ' + value)) {
                window.googletag.pubads().setSafeFrameConfig(value);
                success = true;
            }
            return success;
        }

        function setCategoryExclusion(value) {
            var success = false;

            if (isAvailable('setting category exclusion: ' + value)) {
                AdFuel.requestScriptText += "googletag.pubads().setCategoryExclusion('" + value + "');\n";

                window.googletag.pubads().setCategoryExclusion(value);

                success = true;
            }

            return success;
        }

        function updateCorrelator() {
            var success = false;

            if (isAvailable('updating correlator')) {

                AdFuel.requestScriptText += 'googletag.pubads().updateCorrelator();\n';

                window.googletag.pubads().updateCorrelator();

                success = true;
            }

            return success;
        }

        function defineOutOfPageSlot(adPath, slotId) {
            var result;

            if (isAvailable('defining out of page slot', { adPath: adPath, slotId: slotId })) {
                _dbgLog("Building OOP Slot Object", { adPath: adPath, slotId: slotId });

                AdFuel.requestScriptText += "\n_pageSlots['" + slotId + "'] = googletag.defineOutOfPageSlot('" + adPath + "', '" + slotId + "').addService(googletag.pubads());\n";

                result = window.googletag.defineOutOfPageSlot(adPath, slotId).addService(window.googletag.pubads());
            }

            return result;
        }

        function defineSlot(adPath, sizes, slotId) {
            var result;

            if (isAvailable('defining standard slot', { adPath: adPath, sizes: sizes, slotId: slotId })) {
                _dbgLog("Building Standard Slot Object", { adPath: adPath, sizes: sizes, slotId: slotId });

                AdFuel.requestScriptText += "\n_pageSlots['" + slotId + "'] = googletag.defineSlot('" + adPath + "', " +
                    JSON.stringify(sizes) + ", '" + slotId + "').addService(googletag.pubads());\n";

                result = window.googletag.defineSlot(adPath, sizes, slotId).addService(window.googletag.pubads());
            }

            return result;
        }

        function setSlotCategoryExclusion(slot, value) {
            var slotId = slot.getSlotElementId();

            _dbgLog("Setting Slot Category Exclusion", { slotId: slotId, value: value });

            AdFuel.requestScriptText += "_pageSlots['" + slotId + "'].setCategoryExclusion('" + value + "');\n";

            slot.setCategoryExclusion(value);
        }

        function setSlotTargeting(slot, key, value) {
            var slotId = slot.getSlotElementId();

            _dbgLog("Setting Slot Targeting", { slotId: slotId, key: key, value: value });

            AdFuel.requestScriptText += "_pageSlots['" + slotId + "'].setTargeting('" + key + "', '" + value + "');\n";

            slot.setTargeting(key, value);
        }

        function setSlotSafeFrameConfig(slot, value) {
            var slotId = slot.getSlotElementId();

            _dbgLog("Setting Slot SafeFrame config", { slotId: slotId, value: value });

            AdFuel.requestScriptText += "_pageSlots['" + slotId + "'].setSafeFrameConfig(" + value + ");\n";

            slot.setSafeFrameConfig(value);
        }

        function defineSlotSizeMapping(slot, responsiveMap) {
            var slotId = slot.getSlotElementId();

            _dbgLog("Setting Slot size mapping", { slotId: slotId, responsiveMap: responsiveMap });

            AdFuel.requestScriptText += "_pageSlots['" + slotId + "'].defineSizeMapping('" + JSON.stringify(responsiveMap) + "');\n";

            slot.defineSizeMapping(responsiveMap);
        }

        function displaySlotById(slotId) {

            AdFuel.requestScriptText += 'googletag.display("' + slotId + '");\n';
            window.googletag.display(slotId);
            addMetric({ type: 'slots', id: slotId, data: { display: Date.now() } });
        }

        function clearSlotTargeting(slot) {
            var slotId = slot.getSlotElementId();

            _dbgLog("Clearing targeting for Slot: " + slotId);

            AdFuel.requestScriptText += "_pageSlots['" + slotId + "'].clearTargeting();\n";

            slot.clearTargeting();
        }

        function clearSlots(slots) {

            var slotIds = (slots.length == 0) ? 'all' :
                slots.map(function(slot) {
                    return slot.getSlotElementId();
                }).join(',');

            AdFuel.requestScriptText += 'googletag.pubads().clear(' + slotIds + ');\n';

            if (slots.length > 0) {
                window.googletag.pubads().clear(slots);
            } else {
                window.googletag.pubads().clear();
            }
        }

        function destroySlots(slots) {
            var slotIds = (slots.length == 0) ? 'all' : slots.map(function(slot) {
                return slot.getSlotElementId();
            }).join(',');

            AdFuel.requestScriptText += 'googletag.pubads().destroySlots(' + slotIds + ');\n';

            if (slots.length > 0) {
                window.googletag.destroySlots(slots);
            } else {
                window.googletag.destroySlots();
            }

        }

        function refreshSlots(slots, options) {

            options = options || { maintainCorrelator: true };

            var slotIds = (slots.length == 0) ? 'all' :
                slots.map(function(slot) {
                    return slot.getSlotElementId();
                }).join(',');

            AdFuel.requestScriptText += 'googletag.pubads().refresh(' + slotIds + ');\n';

            if (slots.length > 0) {
                window.googletag.pubads().refresh(slots, { changeCorrelator: !options.maintainCorrelator });
            } else {
                window.googletag.pubads().refresh(null, { changeCorrelator: !options.maintainCorrelator });
            }
        }

        return {
            executeWhenAvailable: executeWhenAvailable,
            isAvailable: isAvailable,
            configurePubAds: configurePubAds,
            clearTargeting: clearTargeting,
            setTargeting: setTargeting,
            setLocation: setLocation,
            setChildDirectedTreatmentTag: setChildDirectedTreatmentTag,
            setSafeFrameConfig: setSafeFrameConfig,
            setSlotSafeFrameConfig: setSlotSafeFrameConfig,
            setCategoryExclusion: setCategoryExclusion,
            updateCorrelator: updateCorrelator,
            defineOutOfPageSlot: defineOutOfPageSlot,
            defineSlot: defineSlot,
            setSlotCategoryExclusion: setSlotCategoryExclusion,
            setSlotTargeting: setSlotTargeting,
            displaySlotById: displaySlotById,
            defineSlotSizeMapping: defineSlotSizeMapping,
            refreshSlots: refreshSlots,
            clearSlots: clearSlots,
            clearSlotTargeting: clearSlotTargeting,
            destroySlots: destroySlots
        };
    }();

    function _sendRequest(rocketeerSlots, requestOptions) {
        /*
         rOptions: {
         sync: false,
         syncSlots: [],
         maintainCorrelator: false
         };
         */

        var requestId = getMetricById('timeline', 'request_to_dfp').length + 1;

        if (!requestId) { requestId = 1; }
        addMetric({ type: 'timeline', id: 'request_to_dfp', data: { id: requestId, slots: rocketeerSlots, options: requestOptions, start: Date.now() } });
        requestOptions = requestOptions || { sync: false, syncSlots: [], maintainCorrelator: false };

        var displayedSlots = [];

        _googleApi.configurePubAds();

        var displaySlot = function(slotId) {
            _googleApi.executeWhenAvailable('displaying slot', function() {
                _dbgLog("Displaying Slot: " + slotId);
                _googleApi.displaySlotById(slotId);
            });
        };

        for (var i = 0; i < rocketeerSlots.length; i++) {
            var slotId = rocketeerSlots[i].rktr_slot_id;

            if (!document.getElementById(slotId)) {
                _dbgLog("Can't Find Slot On Page", slotId);
                if (metrics.slots && metrics.slots[slotId]) {
                    delete metrics.slots[slotId];
                }
            } else {
                //solve closure issue with slotId
                displaySlot(slotId);
                displayedSlots.push(rocketeerSlots[i]);
            }
        }

        var displayedSlotIds = displayedSlots.map(function(displayedSlot) {
            addMetric({ type: 'slots', id: displayedSlot.rktr_slot_id, data: { render_start: Date.now() } });
            return displayedSlot.rktr_slot_id;
        });

        _googleApi.executeWhenAvailable('refreshing slots', function() {
            //all displayed slots must be refreshed to have their ad populated
            //when syncing also include requestOptions.syncSlots
            var slotsToRefresh = [];

            for (var slotDivId in _pageSlots) {
                if (_pageSlots.hasOwnProperty(slotDivId)) {
                    //keep all slots or the ones matching requestOptions.syncSlots or the ones matching displayedSlotIds
                    _dbgLog("Checking Slot for Sync: " + slotDivId);
                    if ((requestOptions.sync &&
                            (!requestOptions.syncSlots || requestOptions.syncSlots.length == 0 ||
                                requestOptions.syncSlots.indexOf(slotDivId) >= 0)
                        ) || displayedSlotIds.indexOf(slotDivId) >= 0) {
                        _dbgLog("Syncing Slot With Request: " + slotDivId);
                        slotsToRefresh.push(_pageSlots[slotDivId]);
                    }
                }
            }
            _dbgLog("Slots To Refresh: ", slotsToRefresh.map(function(slot) {
                return slot.getSlotElementId();
            }));
            _googleApi.refreshSlots(slotsToRefresh);
        });
        requestOptions.maintainCorrelator = requestOptions.maintainCorrelator || false;
        _dbgLog({ maintainCorrelator: requestOptions.maintainCorrelator });
        if (requestOptions.maintainCorrelator == false) {
            _googleApi.executeWhenAvailable('updating correlator', _googleApi.updateCorrelator);
        }

        try {
            var requestCompleteEvent = new CustomEvent('AdFuelRequestComplete', {
                "detail": {
                    "slots": JSON.parse(JSON.stringify(displayedSlots)),
                    "options": requestOptions
                }
            });

            document.dispatchEvent(requestCompleteEvent);
        } catch (ex) {
            _errLog('error dispatching custom Event: AdFuelRequestComplete', { error: ex });
        }
        addMetric({ type: 'timeline', id: 'request_to_dfp', data: { id: requestId, slots: rocketeerSlots, options: requestOptions, end: Date.now() } });

        return displayedSlots;
    }

    function setBulkTargeting(targeting) {
        if (targeting) {
            for (var key in targeting) {
                if (targeting.hasOwnProperty(key)) {
                    if (key == "slotTargets") {
                        for (var key2 in targeting[key]) {
                            if (targeting[key].hasOwnProperty(key2)) {
                                var targetGroup = targeting[key][key2];
                                for (var key3 in targetGroup) {
                                    if (targetGroup.hasOwnProperty(key3)) {
                                        AdFuel.addSlotLevelTarget(key2, key3, targeting[key][key2][key3]);
                                    }
                                }

                            }
                        }
                    } else if (key == "adTargets") {
                        for (var key2 in targeting[key]) {
                            if (targeting[key].hasOwnProperty(key2)) {
                                AdFuel.addPageLevelTarget(key2, targeting[key][key2]);
                            }
                        }
                    } else {
                        // For backwards compatibility
                        AdFuel.addPageLevelTarget(key, targeting[key]);
                    }
                }
            }
        }
    }

    function _removeLeadingNumericNetworkId(adunit) {
        //remove leading numeric networkId (ex:  8663477/CNN/Homepage)
        if (adunit && adunit.indexOf("/") >= 0) {
            var nId = adunit.split("/")[0];
            if (parseInt(nId) > 0) {
                var adUnitArray = adunit.split("/");
                adUnitArray.splice(0, 1);
                adunit = adUnitArray.join('/');
            }
        }

        return adunit;
    }

    /* FOR BACKWARDS COMPATIBILITY */
    function logit(msg, groupTitle) {
        _depLog("AdFuel.logit is DEPRECATED and will be removed in the next version of AdFuel.");
        _dbgLog(groupTitle, msg);
    }

    function queueSingleton(queueOptions) {
        _depLog("AdFuel.queueSingleton is DEPRECATED and will be removed in the next version of AdFuel.");
        _dbgLog("Queuing Singleton", queueOptions);
        queueOptions.size = queueOptions.size || [
            [88, 31]
        ];
        queueOptions.targets = queueOptions.targets || [];
        queueOptions.responsive = queueOptions.responsive || [];

        var originalDiv = queueOptions.divId;

        queueOptions.adunit = _removeLeadingNumericNetworkId(queueOptions.adunit);
        //the same singleton may be queued multiple times
        var pageLevel = {
            "singleton": true,
            "rktr_id": "singleton_" + originalDiv,
            "gpt_id": _options.networkId,
            "root": queueOptions.adunit.split("/")[0].toUpperCase(),
            "responsive": [],
            "rktr_slot_id": "page"
                // The rktr_slot_id attribute needs to stay here for looping purposes.
                // There may be creatives that loop over registry elements looking for slot.rktr_slot_id.
        };
        if (_pageLevelTargeting && queueOptions.targets.length > 0) {
            //remove matching page-level targeting from this slot
            var slotTargets = [];
            var matchingPageLevel = [];

            for (var i = 0; i < queueOptions.targets.length; i++) {
                var slotTarget = queueOptions.targets[i];
                var pageLevelTargetKeyFound = false;
                for (var j = 0; j < _pageLevelTargeting.length; j++) {
                    if (_pageLevelTargeting[j][0] == slotTarget[0]) {
                        for (var val = 0; val < slotTarget[1].length; val++) {
                            if (_pageLevelTargeting[j][1].indexOf(slotTarget[1][val]) >= 0) {
                                pageLevelTargetKeyFound = true;
                                matchingPageLevel = _pageLevelTargeting[j];
                                _dbgLog("Found duplicate page-level target. Removing from singleton.", { singleton: slotTarget, pageLevel: matchingPageLevel });
                            }
                        }
                    }
                }

                if (!pageLevelTargetKeyFound) {
                    slotTargets.push(slotTarget);
                }
            }
            queueOptions.targets = slotTargets;
        }

        pageLevel.targeting = _pageLevelTargeting;

        var regObj = {
            present: true,
            responsive: queueOptions.responsive,
            rktr_slot_id: queueOptions.divId,
            sizes: queueOptions.size,
            targeting: queueOptions.targets,
            rktr_ad_id: queueOptions.adunit,
            inherit: queueOptions.inherit
        };

        /** Commented this out because it prevented the carousel from rendering correctly **/
        //this may change regObj.rktr_slot_id
        //regObj = _renderCheck(regObj);

        if (!regObj) {
            _dbgLog('missing singleton: ' + queueOptions.divId);
        } else {

            var reg = [pageLevel, regObj];
            AdFuel.registry.push(reg);

            if (queueOptions.dispatch && !_options.autoDispatch) {
                //dispatch this one slot if it wasn't dispatched automatically
                AdFuel.dispatchQueue({ slots: [regObj.rktr_slot_id] });
            }
        }
    }

    //backward compatibility- always dispatch regardless of options.autodispatch
    function processNewRegistry(url) {
        _depLog("AdFuel.processNewRegistry is DEPRECATED and will be removed in the next version of AdFuel.");
        queueRegistry(url, { dispatch: true });
    }

    function reloadAd(divId, pageload, updateCorrelator) {
        _depLog("AdFuel.reloadAd is DEPRECATED and will be removed in the next version of AdFuel.");
        AdFuel.refresh([divId], {
            pageload: pageload,
            interval: 0,
            updateCorrelator: updateCorrelator
        });
    }

    function refreshAd(divId, interval, pageload, updateCorrelator) {
        _depLog("AdFuel.refreshAd is DEPRECATED and will be removed in the next version of AdFuel.");
        AdFuel.refresh([divId], {
            pageload: pageload || false,
            interval: interval || 0,
            updateCorrelator: updateCorrelator || true
        });
    }

    function refreshAds(divIds, interval, pageload, updateCorrelator) {
        _depLog("AdFuel.refreshAds is DEPRECATED and will be removed in the next version of AdFuel.");
        AdFuel.refresh(divIds, {
            pageload: pageload || false,
            interval: interval || 0,
            updateCorrelator: updateCorrelator || true
        });
    }

    function refreshAllAds(interval, pageload, updateCorrelator) {
        _depLog("AdFuel.refreshAllAds is DEPRECATED and will be removed in the next version of AdFuel.");
        var refreshOpts = {
            pageload: pageload || false,
            interval: interval || 0,
            updateCorrelator: updateCorrelator || true
        };
        AdFuel.refresh([], refreshOpts);
        return true;
    }

    function renderSingleSlot(divId, size, targets, responsive, adunit, delay, inherit, dispatch) {
        _depLog("AdFuel.renderSingleSlot is DEPRECATED and will be removed in the next version of AdFuel.");

        if (divId.indexOf("ad_carousel_slide") >= 0) {
            adunit = "NBA/homepage";
        }
        queueSingleton({
            divId: divId,
            size: size,
            targets: targets,
            responsive: responsive,
            adunit: adunit,
            delay: delay,
            inherit: inherit,
            //default to dispatch unless explicitly set
            dispatch: (dispatch == undefined ? true : dispatch),
            sync: false,
            syncSlots: []
        });
    }

    function _addDebugEvents() {
        addEvent(document, 'AdFuelRequestComplete', function(e) {
            _dbgLog("AdFuel Request Complete", {
                requestEvent: e
            });
        });
        addEvent(document, 'GPTRenderComplete', function(e) {
            _dbgLog("GPT Render Complete", {
                renderEvent: e
            });
        });
        addEvent(document, 'GPTSlotBuildComplete', function(e) {
            _dbgLog("GPT Slot Build Complete", {
                renderEvent: e
            });
        });
        addEvent(document, 'SlotIdChange', function(e) {
            _dbgLog("Slot ID Change", {
                idChangeEvent: e
            });
        });
        addEvent(document, 'SlotVisibilityChanged', function(e) {
            _dbgLog("Slot Visibility Changed", {
                visibilityChangedEvent: e
            });
        });
        addEvent(document, 'SlotViewable', function(e) {
            _dbgLog("Slot Viewable", {
                viewableEvent: e
            });
        });
        addEvent(document, 'GPTSlotLoaded', function(e) {
            _dbgLog("Slot Loaded", {
                slotOnLoadEvent: e
            });
        });
        addEvent(document, 'PreQueueComplete', function(e) {
            _dbgLog("PreQueueComplete", {
                preQueueCompleteEvent: e
            });
        });
        addEvent(document, 'PostQueueComplete', function(e) {
            _dbgLog("PostQueueComplete", {
                postQueueCompleteEvent: e
            });
        });
        addEvent(document, 'PreDispatchComplete', function(e) {
            _dbgLog("PreDispatchComplete", {
                preDispatchCompleteEvent: e
            });
        });
        addEvent(document, 'PostDispatchComplete', function(e) {
            _dbgLog("PostDispatchComplete", {
                postDispatchCompleteEvent: e
            });
        });
        addEvent(document, 'PreRefreshComplete', function(e) {
            _dbgLog("PreRefreshComplete", {
                preRefreshCompleteEvent: e
            });
        });
        addEvent(document, 'PostRefreshComplete', function(e) {
            _dbgLog("PostRefreshComplete", {
                postRefreshCompleteEvent: e
            });
        });
    }

    function init() {
        //only occur once
        if (!_initialized) {
            _initialized = true;
            var exclusions = _options.exclude.join(",") || "No Exclusions";
            addMetric({ type: 'timeline', id: 'adfuel_initialized', data: { id: 1, timestamp: Date.now() } });
            addMetric({ type: 'configuration', id: 'adfuel_initialization_options', data: { refreshOnFocusOnly: _options.refreshOnFocusOnly, networkId: _options.networkId, autoDispatch: _options.autoDispatch, exclude: exclusions, iFrameTitle: _options.iframeTitle } });
            addMetric({ type: 'configuration', id: 'callback_timeout_length', data: { queueCallbackTimeout: _options.queueCallbackTimeoutInMilliseconds + "ms", dispatchCallbackTimeout: _options.dispatchCallbackTimeoutInMilliseconds + "ms", refreshCallbackTimeout: _options.refreshCallbackTimeoutInMilliseconds + "ms" } });
            _setSlotRenderedClass();
            _checkForAdsQA();
            _addDebugEvents();
            _bindReady();
            _googleApi.executeWhenAvailable('set ad iframe title', _setAdIFrameTitle);
            _dispatchAllQueues();

            try {
                //trigger AdFuelCreated event, so pre-loaded modules can register
                var adFuelCreatedEvent = new CustomEvent('AdFuelCreated', {
                    "detail": {
                        "AdFuel": window.AdFuel
                    }
                });
                document.dispatchEvent(adFuelCreatedEvent);

            } catch (ex) {
                _errLog('error dispatching custom Event: AdFuelCreated', { error: ex });
            }
            addEvent(document, 'PostQueueComplete', function() {
                setTimeout(_dispatchAllQueues, 300);
            });
        }
    }

    function getQueuedSlots() {
        return _clone(_rocketeerSlots);
    }

    function getSlotDetails(slotId) {
        var matchingRocketeerSlot;

        for (var i = 0; i < AdFuel.registry.length; i++) {
            var reg = AdFuel.registry[i];
            for (var j = 1; j < reg.length; j++) {
                var rocketeerSlot = reg[j];

                if (rocketeerSlot.rktr_slot_id == slotId) {
                    matchingRocketeerSlot = _clone(rocketeerSlot);
                }
            }
        }

        var adUnitPath;
        var slotTargeting = {};

        var slot = _pageSlots[slotId];

        if (slot) {
            //get adUnit
            adUnitPath = slot.getAdUnitPath();

            //get targeting keys
            var currentTargetingKeys = slot.getTargetingKeys();
            for (var keyId in currentTargetingKeys) {
                var keyName = currentTargetingKeys[keyId];
                slotTargeting[keyName] = slot.getTargeting(keyName);
            }
        }

        return {
            adUnit: adUnitPath,
            slot: matchingRocketeerSlot,
            slotTargeting: slotTargeting
        };
    }

    function registerModule(name, callbacks) {
        _dbgLog('registering module: ' + name);

        var index = -1;

        for (var i = 0; i < _registeredModules.length; i++) {
            if (_registeredModules[i].name == name) {
                index = i;
            }
        }

        if (index >= 0) {
            //replace callbacks
            _registeredModules[index].callbacks = callbacks;
        } else {
            //add module
            _registeredModules.push({
                name: name,
                callbacks: callbacks
            });
        }
        metrics['modules'] = metrics['modules'] || {};
        metrics.modules[name] = metrics.modules[name] || {};
        for (var callbackName in callbacks) {
            if (callbacks.hasOwnProperty(callbackName)) {
                metrics.modules[name][callbackName] = {};
            }
        }
        addMetric({ type: 'counts', id: 'modules', data: '+' });
        return _metricApi;
    }

    function unregisterModule(name) {
        //remove module, if it's found
        var indexToRemove = -1;
        for (var i = 0; i < _registeredModules.length; i++) {
            if (_registeredModules[i].name == name) {
                indexToRemove = i;
            }
        }

        if (indexToRemove >= 0) {
            _registeredModules.splice(indexToRemove, 1);
        }
        addMetric({ type: 'counts', id: 'modules', data: '-' });
    }

    function requireInit(fn) {
        var callee = arguments.callee;
        var caller = "window/console";
        try {
            caller = callee.caller.toString();
        } catch (err) {
            caller = "window/console";
        }

        return function requiringInitialization() {
            if (!_initialized) {
                _errLog('ERROR: AdFuel must be initialized first!');
                _dbgLog(
                    "------------------FUNCTION --------------------",
                    fn,
                    "--------------- END FUNCTION ------------------",
                    "called by: " + caller
                );
                return;
            } else {
                fn.apply(this, arguments);
            }
        };
    }

    function setOptions(options) {
        if (options) {
            //apply options

            if (options.exclude && options.exclude.length > 0) {
                //add non-duplicating exclude slotIds
                for (var i = 0; i < options.exclude.length; i++) {
                    var slotId = options.exclude[i];
                    if (_excludedSlotIds.indexOf(slotId) < 0) {
                        _excludedSlotIds.push(slotId);
                    }
                }
            }

            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    _options[key] = options[key];
                }
            }
            var exclusions = _options.exclude.length > 0 ? _options.exclude.join(",") : "No Exclusions";
            addMetric({ type: 'configuration', id: 'adfuel_initialization_options', data: { refreshOnFocusOnly: _options.refreshOnFocusOnly, networkId: _options.networkId, autoDispatch: _options.autoDispatch, exclude: exclusions, iFrameTitle: _options.iframeTitle } });
            addMetric({ type: 'configuration', id: 'callback_timeout_length', data: { queueCallbackTimeout: _options.queueCallbackTimeoutInMilliseconds + "ms", dispatchCallbackTimeout: _options.dispatchCallbackTimeoutInMilliseconds + "ms", refreshCallbackTimeout: _options.refreshCallbackTimeoutInMilliseconds + "ms" } });
        }
    }

    function updateCorrelator() {
        return _googleApi.updateCorrelator();
    }

    // Set browser timeline metrics
    addEvent(window, 'load', function(event) {
        addMetric({ type: 'timeline', id: 'navigation_start', data: { id: 1, timestamp: window.performance.timing.navigationStart } });
        addMetric({ type: 'timeline', id: 'fetch_start', data: { id: 1, timestamp: window.performance.timing.fetchStart } });
        addMetric({ type: 'timeline', id: 'domain_lookup_start', data: { id: 1, timestamp: window.performance.timing.domainLookupStart } });
        addMetric({ type: 'timeline', id: 'connection_start', data: { id: 1, timestamp: window.performance.timing.connectStart } });
        addMetric({ type: 'timeline', id: 'document_request_start', data: { id: 1, timestamp: window.performance.timing.requestStart } });
        setTimeout(function() {
            addMetric({ type: 'timeline', id: 'window_load', data: { id: 1, timestamp: window.performance.timing.loadEventEnd } });
        }, 1000);
    });

    return ({
        init: init,
        logit: logit,
        addEvent: addEvent,
        setOptions: setOptions,

        /////////// backward compatibility //////////////////
        clearSlot: requireInit(clearSlots),
        clearSlots: requireInit(clearSlots),
        clearAllSlots: requireInit(clearSlots),
        queueSingleton: queueSingleton,
        processNewRegistry: processNewRegistry,
        reloadAd: requireInit(reloadAd),
        refreshAd: requireInit(refreshAd),
        refreshAds: requireInit(refreshAds),
        refreshAllAds: requireInit(refreshAllAds),
        renderSingleSlot: renderSingleSlot,
        requestAndRenderAds: dispatchQueue,
        ///////////////////////////////////////////////////

        // for old rubicon passbacks
        pageSlots: _pageSlots,
        pageSlotsObj: _pageSlots,
        ///////////////////////////////////////////////////

        dynamicTargeting: _dynamicTargeting,
        setBulkTargeting: setBulkTargeting,
        dispatchQueue: dispatchQueue,
        queueRegistry: queueRegistry,
        getQueuedSlots: getQueuedSlots,
        getSlotDetails: getSlotDetails,
        refresh: requireInit(refresh),
        destroySlots: requireInit(destroySlots),
        removePageLevelTarget: requireInit(removePageLevelTarget),
        removeSlotLevelTarget: requireInit(removeSlotLevelTarget),
        addPageLevelTarget: requireInit(addPageLevelTarget),
        addSlotLevelTarget: requireInit(addSlotLevelTarget),
        generateSingletonId: _generateSingletonId,
        registry: new RegistryArray(),
        requestScriptText: "",
        updateCorrelator: updateCorrelator,

        //required by registry.js files
        readCookie: readCookie,

        //module registration
        registerModule: registerModule,
        unregisterModule: unregisterModule,
        registeredModules: _registeredModules,

        //data collection
        timestamp: timestamp,
        metrics: metrics,
        addMetric: addMetric,
        getMetricTypes: getMetricTypes,
        getMetricsByType: getMetricsByType,
        getMetricById: getMetricById,

        // for debug
        rocketeerSlots: _rocketeerSlots
            ///////////////////////////////////////////////////

    });

})();

// For Backwards Compatibility with Deprecation Warnings
function sendDeprecationNotification(methodName) {
    return function() {
        console.log("[AdFuel - DEPRECATION NOTICE] AMPTManager is DEPRECATED and will be removed in the next version of AdFuel.  Please update your code to reference AdFuel instead of AMPTManager.");
        window.AdFuel[methodName].apply(this, arguments);
    };
}
window.AMPTManager = {};
var exposedMethods = Object.getOwnPropertyNames(window.AdFuel);
for (var x = 0; x < exposedMethods.length; x++) {
    var methodName = exposedMethods[x];
    if (typeof window.AdFuel[methodName] === "function") {
        window.AMPTManager[methodName] = sendDeprecationNotification(methodName);
    } else {
        window.AMPTManager[methodName] = window.AdFuel[methodName];
    }
}

window.AdFuel.init();
