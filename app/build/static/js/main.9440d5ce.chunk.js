/*! For license information please see main.9440d5ce.chunk.js.LICENSE.txt */
(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{121:function(e,t){},141:function(e,t,r){},147:function(e,t,r){},148:function(e,t,r){},149:function(e,t,r){"use strict";r.r(t);var n=r(0),a=r.n(n),o=r(17),i=r.n(o),c=(r(85),r(86),r(6)),s=r(79),l=r(27),u=r(28),h=r(71),f=r(14),p=r(15),m=r(29),d=r(23),g=r(22),v=r(72),y=r.n(v),b=r(73),w=r.n(b),E=r(74),S=r.n(E),x=r(156),L=r(155),j=r(154),O=r(152),T=r(77),k=r(153),_=r(31),N=r.n(_),F=r(44),C=r.n(F);function M(){M=function(){return e};var e={},t=Object.prototype,r=t.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},a=n.iterator||"@@iterator",o=n.asyncIterator||"@@asyncIterator",i=n.toStringTag||"@@toStringTag";function c(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{c({},"")}catch(O){c=function(e,t,r){return e[t]=r}}function s(e,t,r,n){var a=t&&t.prototype instanceof h?t:h,o=Object.create(a.prototype),i=new x(n||[]);return o._invoke=function(e,t,r){var n="suspendedStart";return function(a,o){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===a)throw o;return j()}for(r.method=a,r.arg=o;;){var i=r.delegate;if(i){var c=w(i,r);if(c){if(c===u)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var s=l(e,t,r);if("normal"===s.type){if(n=r.done?"completed":"suspendedYield",s.arg===u)continue;return{value:s.arg,done:r.done}}"throw"===s.type&&(n="completed",r.method="throw",r.arg=s.arg)}}}(e,r,i),o}function l(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(O){return{type:"throw",arg:O}}}e.wrap=s;var u={};function h(){}function f(){}function p(){}var m={};c(m,a,(function(){return this}));var d=Object.getPrototypeOf,g=d&&d(d(L([])));g&&g!==t&&r.call(g,a)&&(m=g);var v=p.prototype=h.prototype=Object.create(m);function y(e){["next","throw","return"].forEach((function(t){c(e,t,(function(e){return this._invoke(t,e)}))}))}function b(e,t){var n;this._invoke=function(a,o){function i(){return new t((function(n,i){!function n(a,o,i,c){var s=l(e[a],e,o);if("throw"!==s.type){var u=s.arg,h=u.value;return h&&"object"==typeof h&&r.call(h,"__await")?t.resolve(h.__await).then((function(e){n("next",e,i,c)}),(function(e){n("throw",e,i,c)})):t.resolve(h).then((function(e){u.value=e,i(u)}),(function(e){return n("throw",e,i,c)}))}c(s.arg)}(a,o,n,i)}))}return n=n?n.then(i,i):i()}}function w(e,t){var r=e.iterator[t.method];if(void 0===r){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=void 0,w(e,t),"throw"===t.method))return u;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return u}var n=l(r,e.iterator,t.arg);if("throw"===n.type)return t.method="throw",t.arg=n.arg,t.delegate=null,u;var a=n.arg;return a?a.done?(t[e.resultName]=a.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,u):a:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,u)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function S(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function x(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function L(e){if(e){var t=e[a];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,o=function t(){for(;++n<e.length;)if(r.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=void 0,t.done=!0,t};return o.next=o}}return{next:j}}function j(){return{value:void 0,done:!0}}return f.prototype=p,c(v,"constructor",p),c(p,"constructor",f),f.displayName=c(p,i,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===f||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,p):(e.__proto__=p,c(e,i,"GeneratorFunction")),e.prototype=Object.create(v),e},e.awrap=function(e){return{__await:e}},y(b.prototype),c(b.prototype,o,(function(){return this})),e.AsyncIterator=b,e.async=function(t,r,n,a,o){void 0===o&&(o=Promise);var i=new b(s(t,r,n,a),o);return e.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},y(v),c(v,i,"Generator"),c(v,a,(function(){return this})),c(v,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=L,x.prototype={constructor:x,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(S),!e)for(var t in this)"t"===t.charAt(0)&&r.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(r,n){return i.type="throw",i.arg=e,t.next=r,n&&(t.method="next",t.arg=void 0),!!n}for(var a=this.tryEntries.length-1;a>=0;--a){var o=this.tryEntries[a],i=o.completion;if("root"===o.tryLoc)return n("end");if(o.tryLoc<=this.prev){var c=r.call(o,"catchLoc"),s=r.call(o,"finallyLoc");if(c&&s){if(this.prev<o.catchLoc)return n(o.catchLoc,!0);if(this.prev<o.finallyLoc)return n(o.finallyLoc)}else if(c){if(this.prev<o.catchLoc)return n(o.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return n(o.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var a=this.tryEntries[n];if(a.tryLoc<=this.prev&&r.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var o=a;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,u):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),u},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),S(r),u}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var a=n.arg;S(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:L(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=void 0),u}},e}var I=new(function(){function e(){Object(f.a)(this,e)}return Object(p.a)(e,[{key:"configs",value:function(){return{appurl:"https://sigribamar.com.br/geoitbi_login/"}}},{key:"session",value:function(){var e=Object(u.a)(M().mark((function e(){var t,r,n;return M().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.configs(),e.next=3,fetch(t.appurl+"geoportal/logged",{method:"POST",body:JSON.stringify({email:localStorage.getItem("email"),salt:localStorage.getItem("salt")}),headers:{"Content-Type":"application/json"}});case 3:return r=e.sent,e.next=6,r.json();case 6:if(!(n=e.sent)){e.next=11;break}return e.abrupt("return",n);case 11:return e.abrupt("return",[]);case 12:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"auth",value:function(e,t){var r=[];if(e.length>0)for(var n=0;n<e.length;n++)t===e[n].codigo_recurso&&r.push(e[n].codigo_recurso);return r}}]),e}());r(141);function P(){P=function(){return e};var e={},t=Object.prototype,r=t.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},a=n.iterator||"@@iterator",o=n.asyncIterator||"@@asyncIterator",i=n.toStringTag||"@@toStringTag";function c(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{c({},"")}catch(O){c=function(e,t,r){return e[t]=r}}function s(e,t,r,n){var a=t&&t.prototype instanceof h?t:h,o=Object.create(a.prototype),i=new x(n||[]);return o._invoke=function(e,t,r){var n="suspendedStart";return function(a,o){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===a)throw o;return j()}for(r.method=a,r.arg=o;;){var i=r.delegate;if(i){var c=w(i,r);if(c){if(c===u)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var s=l(e,t,r);if("normal"===s.type){if(n=r.done?"completed":"suspendedYield",s.arg===u)continue;return{value:s.arg,done:r.done}}"throw"===s.type&&(n="completed",r.method="throw",r.arg=s.arg)}}}(e,r,i),o}function l(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(O){return{type:"throw",arg:O}}}e.wrap=s;var u={};function h(){}function f(){}function p(){}var m={};c(m,a,(function(){return this}));var d=Object.getPrototypeOf,g=d&&d(d(L([])));g&&g!==t&&r.call(g,a)&&(m=g);var v=p.prototype=h.prototype=Object.create(m);function y(e){["next","throw","return"].forEach((function(t){c(e,t,(function(e){return this._invoke(t,e)}))}))}function b(e,t){var n;this._invoke=function(a,o){function i(){return new t((function(n,i){!function n(a,o,i,c){var s=l(e[a],e,o);if("throw"!==s.type){var u=s.arg,h=u.value;return h&&"object"==typeof h&&r.call(h,"__await")?t.resolve(h.__await).then((function(e){n("next",e,i,c)}),(function(e){n("throw",e,i,c)})):t.resolve(h).then((function(e){u.value=e,i(u)}),(function(e){return n("throw",e,i,c)}))}c(s.arg)}(a,o,n,i)}))}return n=n?n.then(i,i):i()}}function w(e,t){var r=e.iterator[t.method];if(void 0===r){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=void 0,w(e,t),"throw"===t.method))return u;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return u}var n=l(r,e.iterator,t.arg);if("throw"===n.type)return t.method="throw",t.arg=n.arg,t.delegate=null,u;var a=n.arg;return a?a.done?(t[e.resultName]=a.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,u):a:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,u)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function S(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function x(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function L(e){if(e){var t=e[a];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,o=function t(){for(;++n<e.length;)if(r.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=void 0,t.done=!0,t};return o.next=o}}return{next:j}}function j(){return{value:void 0,done:!0}}return f.prototype=p,c(v,"constructor",p),c(p,"constructor",f),f.displayName=c(p,i,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===f||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,p):(e.__proto__=p,c(e,i,"GeneratorFunction")),e.prototype=Object.create(v),e},e.awrap=function(e){return{__await:e}},y(b.prototype),c(b.prototype,o,(function(){return this})),e.AsyncIterator=b,e.async=function(t,r,n,a,o){void 0===o&&(o=Promise);var i=new b(s(t,r,n,a),o);return e.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},y(v),c(v,i,"Generator"),c(v,a,(function(){return this})),c(v,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=L,x.prototype={constructor:x,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(S),!e)for(var t in this)"t"===t.charAt(0)&&r.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(r,n){return i.type="throw",i.arg=e,t.next=r,n&&(t.method="next",t.arg=void 0),!!n}for(var a=this.tryEntries.length-1;a>=0;--a){var o=this.tryEntries[a],i=o.completion;if("root"===o.tryLoc)return n("end");if(o.tryLoc<=this.prev){var c=r.call(o,"catchLoc"),s=r.call(o,"finallyLoc");if(c&&s){if(this.prev<o.catchLoc)return n(o.catchLoc,!0);if(this.prev<o.finallyLoc)return n(o.finallyLoc)}else if(c){if(this.prev<o.catchLoc)return n(o.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return n(o.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var a=this.tryEntries[n];if(a.tryLoc<=this.prev&&r.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var o=a;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,u):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),u},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),S(r),u}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var a=n.arg;S(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:L(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=void 0),u}},e}var R=function(e){Object(d.a)(r,e);var t=Object(g.a)(r);function r(e){var n;return Object(f.a)(this,r),(n=t.call(this,e)).handleChange=function(e){n.setState(Object(h.a)({},e.target.name,e.target.value))},n.handleSubmit=function(){var e=Object(u.a)(P().mark((function e(t){var r,o;return P().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),t.target.checkValidity()){e.next=4;break}return n.setState({setValidated:!0}),e.abrupt("return");case 4:n.setState({setValidated:!1}),r=y()(w.a.generate()+Date.now()).toString(),localStorage.setItem("email",n.state.email),localStorage.setItem("salt",r),o={email:n.state.email,password:n.state.password,salt:r},fetch(n.config.appurl+"geoportal/dologin",{method:"POST",body:JSON.stringify(o),headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then(n.setState({setToast:!0,messageToast:a.a.createElement(C.a,{size:28,color:"#2a3850"}),classToast:"toastMsg alert alert-primary"})).then((function(e){e.error?n.setState({setToast:!0,messageToast:N()(e.message),classToast:"toastMsg alert alert-danger"}):(n.setState({setToast:!0,messageToast:a.a.createElement("span",null,N()(e.message)," ",a.a.createElement("br",null),a.a.createElement("br",null)," ",a.a.createElement(C.a,{size:28,color:"green"})),classToast:"toastMsg alert alert-success",logged:!0}),console.log(e),localStorage.setItem("nome",e.nome))}),(function(e){console.log(e),n.setState({setToast:!0,messageToast:"Ocorreu um erro: "+e,classToast:"toastMsg alert alert-danger"})}));case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),n.handleRecSenhaSubmit=function(){var e=Object(u.a)(P().mark((function e(t){var r;return P().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),t.target.checkValidity()){e.next=4;break}return n.setState({setRecValidated:!0}),e.abrupt("return");case 4:n.setState({setRecValidated:!1}),r={email_recuperacao:n.state.email_recuperacao},fetch(n.config.appurl+"admin/usuarios/recuperarsenha",{method:"POST",body:JSON.stringify(r),headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then(n.setState({alertMessageStatus:!0,alertMessage:a.a.createElement(C.a,{size:28,color:"#2a3850"}),alertType:"primary"})).then((function(e){e.error?n.setState({alertMessageStatus:!0,alertMessage:N()(e.message),alertType:"danger"}):(n.setState({alertMessageStatus:!0,alertMessage:N()(e.message),alertType:"success"}),setTimeout((function(){n.setState({alertMessageStatus:!1})}),3e3))}),(function(e){n.setState({alertMessageStatus:!0,alertMessage:"Ops aconteceu um erro na opera\xe7\xe3o: "+e,alertType:"danger"})}));case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),n.openFormRecSenha=function(e){n.setState({openFormRecSenhaAction:e})},n.closeToast=function(){n.setState({setToast:!1})},n.closeAlertMessage=function(){n.setState({alertMessageStatus:!1})},n.handleChange=n.handleChange.bind(Object(m.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(m.a)(n)),n.state={logged:!1,setToast:!1,messageToast:"",classToast:"",setValidated:!1,setRecValidated:!1,email:"",password:"",openFormRecSenhaAction:!1,alertType:"primary",alertMessageStatus:!1,alertMessage:""},n.config=I.configs(),n}return Object(p.a)(r,[{key:"render",value:function(){var e=this;return this.state.logged?a.a.createElement(c.a,{push:!0,to:"/geoitbi/app"}):a.a.createElement(a.a.Fragment,null,a.a.createElement(x.a,{onClose:function(){return e.closeToast()},show:this.state.setToast,delay:5e3,autohide:!0,className:this.state.classToast},a.a.createElement(x.a.Header,null,a.a.createElement("strong",{className:"mr-auto"},"Mensagem")),a.a.createElement(x.a.Body,null,a.a.createElement("strong",null,this.state.messageToast," "))),a.a.createElement(S.a,{images:["/geoitbi/sjr3.jpg","/geoitbi/sjr1.jpg"],duration:5,transition:2}),a.a.createElement("section",{className:"container-fluid p-2"},a.a.createElement("form",{onSubmit:this.handleSubmit,noValidate:!0,className:this.state.setValidated?"form-signin text-center is-invalid was-validated form-control:invalid":"form-signin text-center"},a.a.createElement("img",{src:"/geoitbi/logo.png",alt:"Logo SJR",width:"111",height:"164",className:"mb-4 d-inline-block align-center"}),a.a.createElement("h2",{className:"h3 mb-3 font-weight-normal"},"Geoportal de ITBI"),a.a.createElement("input",{type:"email",className:"form-control",name:"email",value:this.state.value,onChange:this.handleChange,placeholder:"Email do Usu\xe1rio",required:!0}),a.a.createElement(L.a.Control.Feedback,{type:"invalid"},"Por favor insira um email v\xe1lido"),a.a.createElement("input",{type:"password",id:"inputPassword",className:"form-control",name:"password",value:this.state.value,onChange:this.handleChange,placeholder:"Senha do Usu\xe1rio",required:!0}),a.a.createElement(L.a.Control.Feedback,{type:"invalid"},"Insira sua senha de usu\xe1rio"),a.a.createElement("hr",null),a.a.createElement("div",{className:"checkbox mb-3 mt-1"},a.a.createElement("p",null,a.a.createElement("a",{className:"text-blue",href:"#per",onClick:function(){return e.openFormRecSenha(!e.state.openFormRecSenhaAction)}},"Pedeu a senha?"))),a.a.createElement("button",{className:"btn btn-lg btn-danger btn-block",type:"submit"},"Acessar"),a.a.createElement("hr",null),a.a.createElement("p",null,"\xa9 ",(new Date).getFullYear()," - Prefeitura Municipal de S\xe3o Jos\xe9 de Ribamar |",a.a.createElement("a",{href:"http://tecgeobr.com.br",rel:"noopener noreferrer",target:"_blank"}," Desenvolvimento Tecgeo"),"."))),a.a.createElement(j.a,{show:this.state.openFormRecSenhaAction,onHide:function(){return e.openFormRecSenha(!e.state.openFormRecSenhaAction)},backdrop:"static",keyboard:!0},a.a.createElement(j.a.Header,{closeButton:!0},a.a.createElement(j.a.Title,null,"Recuperar Senha")),a.a.createElement(j.a.Body,null,a.a.createElement(L.a,{onSubmit:function(t){return e.handleRecSenhaSubmit(t)},noValidate:!0,className:this.state.setRecValidated?"is-invalid was-validated form-control:invalid":""},a.a.createElement(O.a,{variant:this.state.alertType,show:this.state.alertMessageStatus,onClose:function(){return e.closeAlertMessage()},dismissible:!0},this.state.alertMessage),a.a.createElement(L.a.Row,null,a.a.createElement(T.a,null,a.a.createElement(L.a.Group,null,a.a.createElement(L.a.Label,null,"Email do Usu\xe1rio"),a.a.createElement(L.a.Control,{type:"email",placeholder:"Insira o email do usu\xe1rio",name:"email_recuperacao",value:this.state.email_recuperacao||"",onChange:this.handleChange,required:!0}),a.a.createElement(L.a.Control.Feedback,{type:"invalid"},"Insira o email do usu\xe1rio que deseja recuperar a senha")))),a.a.createElement(k.a,{variant:"danger",type:"submit",block:!0},"Recuperar"))),a.a.createElement(j.a.Footer,null,a.a.createElement(k.a,{variant:"secondary",onClick:function(){return e.openFormRecSenha(!e.state.openFormRecSenhaAction)}},"Fechar"))))}}]),r}(a.a.Component),G=(r(147),r(78)),A=r.n(G),V=function(e){Object(d.a)(r,e);var t=Object(g.a)(r);function r(){return Object(f.a)(this,r),t.apply(this,arguments)}return Object(p.a)(r,[{key:"render",value:function(){return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{className:"loading__centered"},a.a.createElement("div",{className:"loading__logo"},a.a.createElement(A.a,{size:22,color:"#fafafa"}))))}}]),r}(a.a.Component),B=(r(148),function(e){Object(d.a)(r,e);var t=Object(g.a)(r);function r(e){var n;return Object(f.a)(this,r),(n=t.call(this,e)).state={logged:"loading"},n.config=I.configs(),n}return Object(p.a)(r,[{key:"componentDidMount",value:function(){var e=this;fetch(this.config.appurl+"geoportal/logged",{method:"POST",body:JSON.stringify({email:localStorage.getItem("email"),salt:localStorage.getItem("salt")}),headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then(this.setState({logged:"loading"})).then((function(t){t.error?(e.setState({logged:"no"}),localStorage.clear()):e.setState({logged:"yes"})}))}},{key:"componentWillUnmount",value:function(){this.setState=function(e,t){}}},{key:"render",value:function(){var e;return e="yes"===this.state.logged?a.a.createElement("iframe",{title:"GeoITBI",frameBorder:"0",allowtransparency:"yes",scrolling:"no",src:"https://sigribamar.com.br/webapp/index.html",width:"100%",height:"100%"}):"loading"===this.state.logged?a.a.createElement(V,null):a.a.createElement(c.a,{push:!0,to:"/geoitbi"}),a.a.createElement(a.a.Fragment,null,e)}}]),r}(a.a.Component)),J=r(52);function D(){return a.a.createElement(a.a.Fragment,null,a.a.createElement(J.a,{bg:"light",variant:"light"},a.a.createElement(J.a.Brand,{href:"/geoitbi/"},a.a.createElement("img",{src:"/geoitbi/logo.png",alt:"Logo PMSJR",width:"32",height:"42",className:"d-inline-block align-center"})," ","Geoportal de ITBI | 404 Ops P\xe1gina n\xe3o encontrada..")))}var Y=function(){return a.a.createElement(l.a,null,a.a.createElement(c.d,null,a.a.createElement(c.b,{component:R,exact:!0,path:"/geoitbi/"}),a.a.createElement(c.b,{component:B,exact:!0,path:"/geoitbi/app"}),a.a.createElement(c.b,{component:D,exact:!0,path:"*"})))},q=Object(s.a)();var z=function(){return a.a.createElement(a.a.Fragment,null,a.a.createElement(c.c,{history:q},a.a.createElement(Y,null)))};i.a.render(a.a.createElement(z,null),document.getElementById("root"))},80:function(e,t,r){e.exports=r(149)},86:function(e,t,r){},88:function(e,t){}},[[80,1,2]]]);
//# sourceMappingURL=main.9440d5ce.chunk.js.map