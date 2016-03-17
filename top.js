"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function growOuterSquare(e,t,n){deleteAllPath();var l=e;initVerticesRangeInput(l,.5);var o=[],r=PreviousPolygon.verticesAngle(l),i=r/2,u=t||80,s=[3*u,2.5*u];o=calculateRegularPolygonsPoints(l,i,u,s),createPolygon(o);var a=new PreviousPolygon(o,i,u,s),c=[a];d3.select("button#inner-grow-button").on("click",function(){o=calculateNextInnerPoints(o),createPolygon(o)}),d3.select("button#outer-grow-button").on("click",function(){var e=Number(d3.selectAll("input#reducing-level")[0][0].value);u*=e,l%2===1&&(i+=180),c=createOuterRegularPolygons(c,l,i,u,e)}),d3.select("button#init-button").on("click",function(){deleteAllPath(),l=d3.selectAll("input#vertices")[0][0].value,i=PreviousPolygon.verticesAngle(l)/2,u=a.r,o=calculateRegularPolygonsPoints(l,i,u,s),createPolygon(o),a=new PreviousPolygon(o,i,u,s),c=[a]})}function createOuterRegularPolygons(e,t,n,l,o){for(var r=e.slice(0),i=[],u=0;u<r.length;++u)for(var s=0;t>s;++s){var a=s!==t-1?s+1:0,c=((r[u].points[s][0]+r[u].points[a][0])/2-r[u].centerPoint[0])*(1+o)+r[u].centerPoint[0],v=((r[u].points[s][1]+r[u].points[a][1])/2-r[u].centerPoint[1])*(1+o)+r[u].centerPoint[1],d=[c,v],g=calculateRegularPolygonsPoints(t,n,l,d);createPolygon(g),i.push(new PreviousPolygon(g,n,l,d))}return i}function calculateRegularPolygonsPoints(e,t,n,l){for(var o=360/e,r=[],i=0;e>i;++i){var u=(t+i*o)/180*Math.PI,s=n*Math.cos(u),a=n*Math.sin(u);s+=l[0],a+=l[1],r.push([s,a])}return r}function deleteAllPath(){d3.select("svg#sample").selectAll("path").remove()}function initRangeInput(e,t){d3.selectAll("input#zoom-level")[0][0].value=e,d3.selectAll("input#stroke-width-level")[0][0].value=t,d3.selectAll("#zoom-level-output")[0][0].textContent=e.toFixed(1)+" 倍",d3.selectAll("#stroke-width-level-output")[0][0].textContent=t.toFixed(1)+" px"}function initVerticesRangeInput(e,t){d3.selectAll("input#vertices")[0][0].value=e,d3.selectAll("#vertices-output")[0][0].textContent="正 "+e+" 角形",d3.selectAll("input#reducing-level")[0][0].value=t,d3.selectAll("#reducing-level-output")[0][0].textContent=t.toFixed(2)+" 倍",d3.select("input#vertices").on("change",function(){d3.selectAll("#vertices-output")[0][0].textContent="正 "+this.value+" 角形"}),d3.select("input#reducing-level").on("change",function(){d3.selectAll("#reducing-level-output")[0][0].textContent=Number(this.value).toFixed(2)+" 倍"})}function setZoomInputListener(){d3.select("input#zoom-level").on("change",function(){d3.select("svg#sample").selectAll("path").attr({transform:"translate(0, 0) scale("+this.value+")"}),d3.selectAll("#zoom-level-output")[0][0].textContent=Number(this.value).toFixed(1)+" 倍"})}function setStrokeWidthInputListener(){d3.select("input#stroke-width-level").on("change",function(){d3.select("svg#sample").selectAll("path").attr({"stroke-width":this.value}),d3.selectAll("#stroke-width-level-output")[0][0].textContent=Number(this.value).toFixed(1)+" px"})}function createPolygon(e){var t=d3.select("svg#sample"),n=d3.svg.line().x(function(t,n){return e[n][0]}).y(function(t,n){return e[n][1]}).interpolate("linear"),l=d3.selectAll("input#zoom-level")[0][0].value,o=d3.selectAll("input#stroke-width-level")[0][0].value,r=60*l,i=t.append("path").attr({d:n(e)+"z",stroke:"#3e3833","stroke-width":o,fill:"none","shape-rendering":"auto",transform:"translate("+r+", "+r+") scale(0.1)","stroke-linejoin":"round"});i.transition().duration(1400).attr({transform:"translate(0, 0) scale("+l+")"})}function calculateNextInnerPoints(e){for(var t=e.length,n=[],l=0;t>l;++l){var o=l+1;l===t-1&&(o=0);var r=(e[l][0]+e[o][0])/2,i=(e[l][1]+e[o][1])/2;n.push([r,i])}return n}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var l=t[n];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,n,l){return n&&e(t.prototype,n),l&&e(t,l),t}}();window.addEventListener("load",function(){initRangeInput(1,2.5),setZoomInputListener(),setStrokeWidthInputListener(),growOuterSquare(5,void 0,.5)},!1);var PreviousPolygon=function(){function e(t,n,l,o){_classCallCheck(this,e),this.points=t,this.firstAngle=n,this.r=l,this.centerPoint=o}return _createClass(e,null,[{key:"verticesAngle",value:function(e){return 180-360/e}}]),e}();