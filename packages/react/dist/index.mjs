import Ye, { forwardRef as S } from "react";
import { Slot as xr } from "@radix-ui/react-slot";
var Q = { exports: {} }, W = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ce;
function Tr() {
  if (Ce) return W;
  Ce = 1;
  var b = Ye, s = Symbol.for("react.element"), u = Symbol.for("react.fragment"), a = Object.prototype.hasOwnProperty, f = b.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, d = { key: !0, ref: !0, __self: !0, __source: !0 };
  function _(g, v, h) {
    var x, C = {}, j = null, V = null;
    h !== void 0 && (j = "" + h), v.key !== void 0 && (j = "" + v.key), v.ref !== void 0 && (V = v.ref);
    for (x in v) a.call(v, x) && !d.hasOwnProperty(x) && (C[x] = v[x]);
    if (g && g.defaultProps) for (x in v = g.defaultProps, v) C[x] === void 0 && (C[x] = v[x]);
    return { $$typeof: s, type: g, key: j, ref: V, props: C, _owner: f.current };
  }
  return W.Fragment = u, W.jsx = _, W.jsxs = _, W;
}
var Y = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Oe;
function Sr() {
  return Oe || (Oe = 1, process.env.NODE_ENV !== "production" && function() {
    var b = Ye, s = Symbol.for("react.element"), u = Symbol.for("react.portal"), a = Symbol.for("react.fragment"), f = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), _ = Symbol.for("react.provider"), g = Symbol.for("react.context"), v = Symbol.for("react.forward_ref"), h = Symbol.for("react.suspense"), x = Symbol.for("react.suspense_list"), C = Symbol.for("react.memo"), j = Symbol.for("react.lazy"), V = Symbol.for("react.offscreen"), re = Symbol.iterator, Ve = "@@iterator";
    function Le(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = re && e[re] || e[Ve];
      return typeof r == "function" ? r : null;
    }
    var D = b.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function m(e) {
      {
        for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++)
          t[n - 1] = arguments[n];
        Me("error", e, t);
      }
    }
    function Me(e, r, t) {
      {
        var n = D.ReactDebugCurrentFrame, c = n.getStackAddendum();
        c !== "" && (r += "%s", t = t.concat([c]));
        var l = t.map(function(o) {
          return String(o);
        });
        l.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, l);
      }
    }
    var Ue = !1, Be = !1, He = !1, qe = !1, ze = !1, te;
    te = Symbol.for("react.module.reference");
    function Ge(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === a || e === d || ze || e === f || e === h || e === x || qe || e === V || Ue || Be || He || typeof e == "object" && e !== null && (e.$$typeof === j || e.$$typeof === C || e.$$typeof === _ || e.$$typeof === g || e.$$typeof === v || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === te || e.getModuleId !== void 0));
    }
    function Je(e, r, t) {
      var n = e.displayName;
      if (n)
        return n;
      var c = r.displayName || r.name || "";
      return c !== "" ? t + "(" + c + ")" : t;
    }
    function ne(e) {
      return e.displayName || "Context";
    }
    function O(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && m("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case a:
          return "Fragment";
        case u:
          return "Portal";
        case d:
          return "Profiler";
        case f:
          return "StrictMode";
        case h:
          return "Suspense";
        case x:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case g:
            var r = e;
            return ne(r) + ".Consumer";
          case _:
            var t = e;
            return ne(t._context) + ".Provider";
          case v:
            return Je(e, e.render, "ForwardRef");
          case C:
            var n = e.displayName || null;
            return n !== null ? n : O(e.type) || "Memo";
          case j: {
            var c = e, l = c._payload, o = c._init;
            try {
              return O(o(l));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var P = Object.assign, I = 0, ae, ie, oe, se, ce, ue, le;
    function fe() {
    }
    fe.__reactDisabledLog = !0;
    function Ke() {
      {
        if (I === 0) {
          ae = console.log, ie = console.info, oe = console.warn, se = console.error, ce = console.group, ue = console.groupCollapsed, le = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: fe,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        I++;
      }
    }
    function Xe() {
      {
        if (I--, I === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: P({}, e, {
              value: ae
            }),
            info: P({}, e, {
              value: ie
            }),
            warn: P({}, e, {
              value: oe
            }),
            error: P({}, e, {
              value: se
            }),
            group: P({}, e, {
              value: ce
            }),
            groupCollapsed: P({}, e, {
              value: ue
            }),
            groupEnd: P({}, e, {
              value: le
            })
          });
        }
        I < 0 && m("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var H = D.ReactCurrentDispatcher, q;
    function L(e, r, t) {
      {
        if (q === void 0)
          try {
            throw Error();
          } catch (c) {
            var n = c.stack.trim().match(/\n( *(at )?)/);
            q = n && n[1] || "";
          }
        return `
` + q + e;
      }
    }
    var z = !1, M;
    {
      var Ze = typeof WeakMap == "function" ? WeakMap : Map;
      M = new Ze();
    }
    function de(e, r) {
      if (!e || z)
        return "";
      {
        var t = M.get(e);
        if (t !== void 0)
          return t;
      }
      var n;
      z = !0;
      var c = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var l;
      l = H.current, H.current = null, Ke();
      try {
        if (r) {
          var o = function() {
            throw Error();
          };
          if (Object.defineProperty(o.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(o, []);
            } catch (E) {
              n = E;
            }
            Reflect.construct(e, [], o);
          } else {
            try {
              o.call();
            } catch (E) {
              n = E;
            }
            e.call(o.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (E) {
            n = E;
          }
          e();
        }
      } catch (E) {
        if (E && n && typeof E.stack == "string") {
          for (var i = E.stack.split(`
`), R = n.stack.split(`
`), p = i.length - 1, y = R.length - 1; p >= 1 && y >= 0 && i[p] !== R[y]; )
            y--;
          for (; p >= 1 && y >= 0; p--, y--)
            if (i[p] !== R[y]) {
              if (p !== 1 || y !== 1)
                do
                  if (p--, y--, y < 0 || i[p] !== R[y]) {
                    var T = `
` + i[p].replace(" at new ", " at ");
                    return e.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", e.displayName)), typeof e == "function" && M.set(e, T), T;
                  }
                while (p >= 1 && y >= 0);
              break;
            }
        }
      } finally {
        z = !1, H.current = l, Xe(), Error.prepareStackTrace = c;
      }
      var A = e ? e.displayName || e.name : "", k = A ? L(A) : "";
      return typeof e == "function" && M.set(e, k), k;
    }
    function Qe(e, r, t) {
      return de(e, !1);
    }
    function er(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function U(e, r, t) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return de(e, er(e));
      if (typeof e == "string")
        return L(e);
      switch (e) {
        case h:
          return L("Suspense");
        case x:
          return L("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case v:
            return Qe(e.render);
          case C:
            return U(e.type, r, t);
          case j: {
            var n = e, c = n._payload, l = n._init;
            try {
              return U(l(c), r, t);
            } catch {
            }
          }
        }
      return "";
    }
    var N = Object.prototype.hasOwnProperty, ve = {}, pe = D.ReactDebugCurrentFrame;
    function B(e) {
      if (e) {
        var r = e._owner, t = U(e.type, e._source, r ? r.type : null);
        pe.setExtraStackFrame(t);
      } else
        pe.setExtraStackFrame(null);
    }
    function rr(e, r, t, n, c) {
      {
        var l = Function.call.bind(N);
        for (var o in e)
          if (l(e, o)) {
            var i = void 0;
            try {
              if (typeof e[o] != "function") {
                var R = Error((n || "React class") + ": " + t + " type `" + o + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[o] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw R.name = "Invariant Violation", R;
              }
              i = e[o](r, o, n, t, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (p) {
              i = p;
            }
            i && !(i instanceof Error) && (B(c), m("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", n || "React class", t, o, typeof i), B(null)), i instanceof Error && !(i.message in ve) && (ve[i.message] = !0, B(c), m("Failed %s type: %s", t, i.message), B(null));
          }
      }
    }
    var tr = Array.isArray;
    function G(e) {
      return tr(e);
    }
    function nr(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, t = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return t;
      }
    }
    function ar(e) {
      try {
        return ye(e), !1;
      } catch {
        return !0;
      }
    }
    function ye(e) {
      return "" + e;
    }
    function _e(e) {
      if (ar(e))
        return m("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", nr(e)), ye(e);
    }
    var ge = D.ReactCurrentOwner, ir = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, be, me;
    function or(e) {
      if (N.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function sr(e) {
      if (N.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function cr(e, r) {
      typeof e.ref == "string" && ge.current;
    }
    function ur(e, r) {
      {
        var t = function() {
          be || (be = !0, m("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: t,
          configurable: !0
        });
      }
    }
    function lr(e, r) {
      {
        var t = function() {
          me || (me = !0, m("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: t,
          configurable: !0
        });
      }
    }
    var fr = function(e, r, t, n, c, l, o) {
      var i = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: s,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: t,
        props: o,
        // Record the component responsible for creating this element.
        _owner: l
      };
      return i._store = {}, Object.defineProperty(i._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(i, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: n
      }), Object.defineProperty(i, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: c
      }), Object.freeze && (Object.freeze(i.props), Object.freeze(i)), i;
    };
    function dr(e, r, t, n, c) {
      {
        var l, o = {}, i = null, R = null;
        t !== void 0 && (_e(t), i = "" + t), sr(r) && (_e(r.key), i = "" + r.key), or(r) && (R = r.ref, cr(r, c));
        for (l in r)
          N.call(r, l) && !ir.hasOwnProperty(l) && (o[l] = r[l]);
        if (e && e.defaultProps) {
          var p = e.defaultProps;
          for (l in p)
            o[l] === void 0 && (o[l] = p[l]);
        }
        if (i || R) {
          var y = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          i && ur(o, y), R && lr(o, y);
        }
        return fr(e, i, R, c, n, ge.current, o);
      }
    }
    var J = D.ReactCurrentOwner, Re = D.ReactDebugCurrentFrame;
    function F(e) {
      if (e) {
        var r = e._owner, t = U(e.type, e._source, r ? r.type : null);
        Re.setExtraStackFrame(t);
      } else
        Re.setExtraStackFrame(null);
    }
    var K;
    K = !1;
    function X(e) {
      return typeof e == "object" && e !== null && e.$$typeof === s;
    }
    function he() {
      {
        if (J.current) {
          var e = O(J.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function vr(e) {
      return "";
    }
    var Ee = {};
    function pr(e) {
      {
        var r = he();
        if (!r) {
          var t = typeof e == "string" ? e : e.displayName || e.name;
          t && (r = `

Check the top-level render call using <` + t + ">.");
        }
        return r;
      }
    }
    function xe(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var t = pr(r);
        if (Ee[t])
          return;
        Ee[t] = !0;
        var n = "";
        e && e._owner && e._owner !== J.current && (n = " It was passed a child from " + O(e._owner.type) + "."), F(e), m('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', t, n), F(null);
      }
    }
    function Te(e, r) {
      {
        if (typeof e != "object")
          return;
        if (G(e))
          for (var t = 0; t < e.length; t++) {
            var n = e[t];
            X(n) && xe(n, r);
          }
        else if (X(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var c = Le(e);
          if (typeof c == "function" && c !== e.entries)
            for (var l = c.call(e), o; !(o = l.next()).done; )
              X(o.value) && xe(o.value, r);
        }
      }
    }
    function yr(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var t;
        if (typeof r == "function")
          t = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === v || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === C))
          t = r.propTypes;
        else
          return;
        if (t) {
          var n = O(r);
          rr(t, e.props, "prop", n, e);
        } else if (r.PropTypes !== void 0 && !K) {
          K = !0;
          var c = O(r);
          m("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", c || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && m("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function _r(e) {
      {
        for (var r = Object.keys(e.props), t = 0; t < r.length; t++) {
          var n = r[t];
          if (n !== "children" && n !== "key") {
            F(e), m("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", n), F(null);
            break;
          }
        }
        e.ref !== null && (F(e), m("Invalid attribute `ref` supplied to `React.Fragment`."), F(null));
      }
    }
    var Se = {};
    function we(e, r, t, n, c, l) {
      {
        var o = Ge(e);
        if (!o) {
          var i = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (i += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var R = vr();
          R ? i += R : i += he();
          var p;
          e === null ? p = "null" : G(e) ? p = "array" : e !== void 0 && e.$$typeof === s ? (p = "<" + (O(e.type) || "Unknown") + " />", i = " Did you accidentally export a JSX literal instead of a component?") : p = typeof e, m("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", p, i);
        }
        var y = dr(e, r, t, c, l);
        if (y == null)
          return y;
        if (o) {
          var T = r.children;
          if (T !== void 0)
            if (n)
              if (G(T)) {
                for (var A = 0; A < T.length; A++)
                  Te(T[A], e);
                Object.freeze && Object.freeze(T);
              } else
                m("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Te(T, e);
        }
        if (N.call(r, "key")) {
          var k = O(e), E = Object.keys(r).filter(function(Er) {
            return Er !== "key";
          }), Z = E.length > 0 ? "{key: someKey, " + E.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Se[k + Z]) {
            var hr = E.length > 0 ? "{" + E.join(": ..., ") + ": ...}" : "{}";
            m(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Z, k, hr, k), Se[k + Z] = !0;
          }
        }
        return e === a ? _r(y) : yr(y), y;
      }
    }
    function gr(e, r, t) {
      return we(e, r, t, !0);
    }
    function br(e, r, t) {
      return we(e, r, t, !1);
    }
    var mr = br, Rr = gr;
    Y.Fragment = a, Y.jsx = mr, Y.jsxs = Rr;
  }()), Y;
}
process.env.NODE_ENV === "production" ? Q.exports = Tr() : Q.exports = Sr();
var w = Q.exports;
const wr = "_box_8wxcx_6", je = {
  box: wr
}, $ = S(function({ asChild: s = !1, className: u, children: a, ...f }, d) {
  const _ = s ? xr : "div", g = u ? `${je.box} ${u}` : je.box;
  return /* @__PURE__ */ w.jsx(_, { ref: d, className: g, ...f, children: a });
});
$.displayName = "Box";
const Cr = "_flex_b70sw_6", Pe = {
  flex: Cr
}, ee = S(function({ direction: s = "row", gap: u, align: a, justify: f, wrap: d = "nowrap", className: _, ...g }, v) {
  const h = _ ? `${Pe.flex} ${_}` : Pe.flex;
  return /* @__PURE__ */ w.jsx(
    $,
    {
      ref: v,
      className: h,
      "data-direction": s,
      "data-wrap": d,
      "data-align": a,
      "data-justify": f,
      "data-gap": u,
      ...g
    }
  );
});
ee.displayName = "Flex";
const Or = "_stack_klio5_4", ke = {
  stack: Or
}, jr = {
  vertical: "column",
  horizontal: "row"
}, Pr = S(function({ direction: s = "vertical", gap: u = "300", className: a, ...f }, d) {
  const _ = a ? `${ke.stack} ${a}` : ke.stack;
  return /* @__PURE__ */ w.jsx(ee, { ref: d, className: _, direction: jr[s], gap: u, ...f });
});
Pr.displayName = "Stack";
const kr = "_center_1btca_5", $e = {
  center: kr
}, $r = S(function({ className: s, ...u }, a) {
  const f = s ? `${$e.center} ${s}` : $e.center;
  return /* @__PURE__ */ w.jsx(ee, { ref: a, className: f, align: "center", justify: "center", ...u });
});
$r.displayName = "Center";
const Dr = "_grid_6b3wg_11", De = {
  grid: Dr
}, Fr = S(function({ columns: s = 12, gap: u, responsive: a, className: f, style: d, ..._ }, g) {
  const v = f ? `${De.grid} ${f}` : De.grid, h = {
    "--ds-grid-cols": s
  };
  return (a == null ? void 0 : a.sm) !== void 0 && (h["--ds-grid-cols-sm"] = a.sm), (a == null ? void 0 : a.md) !== void 0 && (h["--ds-grid-cols-md"] = a.md), (a == null ? void 0 : a.lg) !== void 0 && (h["--ds-grid-cols-lg"] = a.lg), (a == null ? void 0 : a.xl) !== void 0 && (h["--ds-grid-cols-xl"] = a.xl), /* @__PURE__ */ w.jsx(
    $,
    {
      ref: g,
      className: v,
      "data-gap": u,
      style: { ...h, ...d },
      ..._
    }
  );
});
Fr.displayName = "Grid";
const Ar = "_container_kq8aw_6", Fe = {
  container: Ar
}, Ir = S(function({ size: s = "lg", className: u, ...a }, f) {
  const d = u ? `${Fe.container} ${u}` : Fe.container;
  return /* @__PURE__ */ w.jsx($, { ref: f, className: d, "data-size": s, ...a });
});
Ir.displayName = "Container";
const Nr = "_spacer_veq2c_7", Ae = {
  spacer: Nr
}, Wr = S(function({ size: s, className: u, ...a }, f) {
  const d = u ? `${Ae.spacer} ${u}` : Ae.spacer;
  return /* @__PURE__ */ w.jsx($, { ref: f, className: d, "data-size": s, "aria-hidden": "true", ...a });
});
Wr.displayName = "Spacer";
const Yr = "_divider_1gsbv_5", Ie = {
  divider: Yr
}, Vr = S(function({ orientation: s = "horizontal", variant: u = "hairline", className: a, ...f }, d) {
  const _ = a ? `${Ie.divider} ${a}` : Ie.divider;
  return /* @__PURE__ */ w.jsx(
    $,
    {
      ref: d,
      className: _,
      role: "separator",
      "aria-orientation": s,
      "data-orientation": s,
      "data-variant": u,
      ...f
    }
  );
});
Vr.displayName = "Divider";
const Lr = "_aspectRatio_1n9gr_7", Ne = {
  aspectRatio: Lr
}, Mr = (b) => typeof b == "string", Ur = S(function({ ratio: s, className: u, style: a, ...f }, d) {
  const _ = u ? `${Ne.aspectRatio} ${u}` : Ne.aspectRatio, g = Mr(s) ? s : void 0, v = g ? {} : { aspectRatio: String(s) };
  return /* @__PURE__ */ w.jsx(
    $,
    {
      ref: d,
      className: _,
      "data-ratio": g,
      style: { ...v, ...a },
      ...f
    }
  );
});
Ur.displayName = "AspectRatio";
const Br = "_visuallyHidden_elb8n_6", We = {
  visuallyHidden: Br
}, Hr = S(
  function({ className: s, children: u, ...a }, f) {
    const d = s ? `${We.visuallyHidden} ${s}` : We.visuallyHidden;
    return /* @__PURE__ */ w.jsx("span", { ref: f, className: d, ...a, children: u });
  }
);
Hr.displayName = "VisuallyHidden";
export {
  Ur as AspectRatio,
  $ as Box,
  $r as Center,
  Ir as Container,
  Vr as Divider,
  ee as Flex,
  Fr as Grid,
  Wr as Spacer,
  Pr as Stack,
  Hr as VisuallyHidden
};
//# sourceMappingURL=index.mjs.map
