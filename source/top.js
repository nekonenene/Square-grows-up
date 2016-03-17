"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.addEventListener("load", function () {
	"use strict";

	initRangeInput(1.0, 2.5);
	setZoomInputListener();
	setStrokeWidthInputListener();

	growOuterSquare(5);
}, false);

function growOuterSquare(_vertices, _r) {
	deleteAllPath();

	var vertices = _vertices;
	var points = [];
	var verticesAngle = PreviousPolygon.verticesAngle(vertices); // 頂点の角度
	var firstAngle = verticesAngle / 2; // X軸に平行な中心点を通る線を水平としたときの、points[0] の傾き
	var r = _r || 80; // 最初の半径。2で割られていくので、2の階乗の値がもっとも良い
	var centerPoint = [2.5 * r, 2.5 * r];
	var zoomLevel = 1;
	var previousPolygons = [];

	points = calculateRegularPolygonsPoints(vertices, firstAngle, r, centerPoint, zoomLevel);
	createPolygon(points);
	previousPolygons.push(new PreviousPolygon(points, firstAngle, r, centerPoint));

	d3.select("button#inner-grow-button").on("click", function () {
		// growSquareInside(level++);
		points = calculateNextInnerPoints(points);
		createPolygon(points);
	});

	d3.select("button#grow-button").on("click", function () {
		r /= 2;
		if (vertices % 2 === 1) {
			firstAngle += 180;
		}

		previousPolygons = createOuterRegularPolygons(previousPolygons, vertices, firstAngle, r, zoomLevel);
	});

	d3.select("button#init-button").on("click", function () {
		deleteAllPath();
		firstAngle = verticesAngle / 2; // X軸に平行な中心点を通る線を水平としたときの、points[0] の傾き
		r = 100; // 最初の半径。2で割られていくので、2の階乗の値がもっとも良い
		previousPolygons = [];

		points = calculateRegularPolygonsPoints(vertices, firstAngle, r, centerPoint, zoomLevel);
		createPolygon(points);
		previousPolygons.push(new PreviousPolygon(points, firstAngle, r, centerPoint));
	});
}

/** 前回作られた図形の情報、このクラスの配列を作り保存するとよい */

var PreviousPolygon = function () {
	function PreviousPolygon(_points, _firstAngle, _r, _centerPoint) {
		_classCallCheck(this, PreviousPolygon);

		this.points = _points;
		this.firstAngle = _firstAngle;
		this.r = _r;
		this.centerPoint = _centerPoint;
	}

	/** 頂点の角度を求める */


	_createClass(PreviousPolygon, null, [{
		key: "verticesAngle",
		value: function verticesAngle(vertices) {
			return 180 - 360 / vertices;
		}
	}]);

	return PreviousPolygon;
}();

/** 前回作られた正多角形の周りに半分の大きさの合同な図形を描く
	@param previousPolygons : 前回作られた図形の情報 PreviousPolygon クラスが、作った個数ぶん格納された配列
	他の引数は calculateRegularPolygonsPoints メソッドを参照のこと */


function createOuterRegularPolygons(_previousPolygons, _vertices, _firstAngle, _r, _zoomLevel) {
	var ppCopy = _previousPolygons.slice(0);
	var creatingPolygons = [];

	for (var i = 0; i < ppCopy.length; ++i) {
		for (var j = 0; j < _vertices; ++j) {
			var jNext = j !== _vertices - 1 ? j + 1 : 0;
			var centerX = (1.5 * (ppCopy[i].points[j][0] + ppCopy[i].points[jNext][0]) - ppCopy[i].centerPoint[0]) / 2;
			var centerY = (1.5 * (ppCopy[i].points[j][1] + ppCopy[i].points[jNext][1]) - ppCopy[i].centerPoint[1]) / 2;
			var centerPoint = [centerX, centerY];
			var points = calculateRegularPolygonsPoints(_vertices, _firstAngle, _r, centerPoint, _zoomLevel);
			createPolygon(points);
			creatingPolygons.push(new PreviousPolygon(points, _firstAngle, _r, centerPoint));
		}
	}
	return creatingPolygons;
}

/** 正多角形をPATHで描くために必要な座標群を計算する
 	@param vertices    : 頂点数、正X角形のX
	@param firstAngle  : x軸と水平を0としたときの、最初の座標の傾き
	@param r           : 正多角形を引く基準とする円の半径
	@param centerPoint : 基準とする円の中心座標
	@param zoomLevel   : 拡大率、よって実際の基準とする円の半径は r * zoomLevel となる
	*/
function calculateRegularPolygonsPoints(_vertices, _firstAngle, _r, _centerPoint, _zoomLevel) {
	var dividedAngle = 360 / _vertices;
	var verticesAngle = 180 - dividedAngle; // 頂点の角度
	var points = [];

	for (var i = 0; i < _vertices; ++i) {
		var angleRadian = (_firstAngle + i * dividedAngle) / 180 * Math.PI;
		var x = _r * Math.cos(angleRadian);
		var y = _r * Math.sin(angleRadian);

		x += _centerPoint[0];y += _centerPoint[1];
		x *= _zoomLevel;y *= _zoomLevel;
		points.push([x, y]);
	}
	return points;
}

/** PATH を全て除去 */
function deleteAllPath() {
	var svgField = d3.select("svg#sample").selectAll("path").remove();
}

/** スライドバーのトグルの位置と、現在値の表示を初期化 */
function initRangeInput(_defaultZoom, _defaultStrokeWidth) {
	d3.selectAll("input#zoom-level")[0][0].value = _defaultZoom;
	d3.selectAll("input#stroke-width-level")[0][0].value = _defaultStrokeWidth;
	d3.selectAll(".range-output")[0][0].textContent = _defaultZoom.toFixed(1) + " 倍";
	d3.selectAll(".range-output")[0][1].textContent = _defaultStrokeWidth.toFixed(1) + " px";
}

/** 「zoom」のスライダーに対してリスナー設定 */
function setZoomInputListener() {
	d3.select("input#zoom-level").on("change", function () {
		d3.select("svg#sample").selectAll("path").attr({
			"transform": "translate(0, 0) scale(" + this.value + ")"
		});
		d3.selectAll(".range-output")[0][0].textContent = Number(this.value).toFixed(1) + " 倍";
		// TODO: ここの 150 はマジックナンバーなので、SVGのサイズに直したい
		/*
  d3.selectAll( "svg#sample" )
  	.style("height", 150 * this.value + "px")
  	.style("width" , 150 * this.value + "px");
  */
	});
}

/** 「線幅」のスライダーに対してリスナー設定 */
function setStrokeWidthInputListener() {
	d3.select("input#stroke-width-level").on("change", function () {
		d3.select("svg#sample").selectAll("path").attr({
			"stroke-width": this.value
		});
		d3.selectAll(".range-output")[0][1].textContent = Number(this.value).toFixed(1) + " px";
	});
}

/** x点の座標をもらってきて、そこから x角形を作成する
	@param points : [x, y] の座標が複数格納された二次元配列 */
function createPolygon(_points) {
	var svgField = d3.select("svg#sample");

	var lineFunction = d3.svg.line().x(function (d, i) {
		return _points[i][0];
	}).y(function (d, i) {
		return _points[i][1];
	}).interpolate("linear");

	/* path の SVG については難しいので、以下でオプションを参照のこと
  * http://www.h2.dion.ne.jp/~defghi/svgMemo/svgMemo_03.htm */

	var zoomLevel = d3.selectAll("input#zoom-level")[0][0].value;
	var strokeWidthLevel = d3.selectAll("input#stroke-width-level")[0][0].value;
	var centerAdjust = 60 * zoomLevel;

	var path = svgField.append("path").attr({
		"d": lineFunction(_points) + "z", // z オプションによって図形は閉じられる
		"stroke": "#3e3833",
		"stroke-width": strokeWidthLevel,
		"fill": "none",
		"shape-rendering": "auto", // アンチエイリアス設定
		"transform": "translate(" + centerAdjust + ", " + centerAdjust + ") scale(0.1)",
		"stroke-linejoin": "round" });

	// だんだん大きくなるアニメーション
	// 頂点を丸める
	path.transition().duration(1400).attr({
		"transform": "translate(0, 0) scale(" + zoomLevel + ")"
	});
}

/** 内側に x角形を作るための次の点を計算する
	@param previousPoints : 新しく作る図形の一個前の図形の座標たち */
function calculateNextInnerPoints(_previousPoints) {
	var vertices = _previousPoints.length;
	var nextPoints = [];

	for (var i = 0; i < vertices; ++i) {
		var iNext = i + 1;
		if (i === vertices - 1) {
			iNext = 0;
		}
		var xNext = (_previousPoints[i][0] + _previousPoints[iNext][0]) / 2;
		var yNext = (_previousPoints[i][1] + _previousPoints[iNext][1]) / 2;
		nextPoints.push([xNext, yNext]);
	}

	return nextPoints;
}