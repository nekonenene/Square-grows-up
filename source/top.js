window.addEventListener("load", function () {
	"use strict";

	initRangeInput(1.0, 2.5);
	setZoomInputListener();
	setStrokeWidthInputListener();

	growInnerSquare();
}, false);

/** 四角の中に四角をどんどん作っていく */
function growInnerSquare() {
	var xx = 10;var yy = 130;
	var points = [[xx, xx], [yy, xx], [yy, yy], [xx, yy]];
	createSquare(points);
	var level = 1;

	d3.select("button#grow-button").on("click", function () {
		// growSquareInside(level++);
		points = calculateNextPoints(points);
		createSquare(points);
	});

	d3.select("button#init-button").on("click", function () {
		deleteAll();
		points = [[xx, xx], [yy, xx], [yy, yy], [xx, yy]];
		createSquare(points);
		var level = 1;
	});
}

/** PATH を全て除去 */
function deleteAll() {
	var svgField = d3.select("svg#sample").selectAll("path").remove();
}

/** スライドバーのトグルの位置と、現在値の表示を初期化 */
function initRangeInput(defaultZoom, defaultStrokeWidth) {
	d3.selectAll("input#zoom-level")[0][0].value = defaultZoom;
	d3.selectAll("input#stroke-width-level")[0][0].value = defaultStrokeWidth;
	d3.selectAll(".range-output")[0][0].textContent = defaultZoom.toFixed(1) + " 倍";
	d3.selectAll(".range-output")[0][1].textContent = defaultStrokeWidth.toFixed(1) + " px";
}

/** 「zoom」のスライダーに対してリスナー設定 */
function setZoomInputListener() {
	d3.select("input#zoom-level").on("change", function () {
		d3.select("svg#sample").selectAll("path").attr({
			"transform": "translate(0, 0) scale(" + this.value + ")"
		});
		d3.selectAll(".range-output")[0][0].textContent = Number(this.value).toFixed(1) + " 倍";
		// TODO: ここの 150 はマジックナンバーなので、SVGのサイズに直したい
		d3.selectAll("svg#sample").style("height", 150 * this.value + "px").style("width", 150 * this.value + "px");
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

/** 「成長させる」ボタンを押した時の反応
	@param level : 成長段階（1～）
	@param firstPoints : level=1 のときの座標配列 */
function growSquareInside(level, firstPoints) {
	var svgField = d3.select("svg#sample").selectAll("path").remove();

	var points = firstPoints.concat();
	for (var i = 0; i < level; ++i) {
		points = calculateNextPoints(points);
		createSquare(points);
	}
}

/** x点の座標をもらってきて、そこから x角形を作成する
	@param pointsArray : [x, y] の座標が複数格納された二次元配列 */
function createSquare(pointsArray) {
	var svgField = d3.select("svg#sample");

	var lineFunction = d3.svg.line().x(function (d, i) {
		return pointsArray[i][0];
	}).y(function (d, i) {
		return pointsArray[i][1];
	}).interpolate("linear");

	/* path の SVG については難しいので、以下でオプションを参照のこと
  * http://www.h2.dion.ne.jp/~defghi/svgMemo/svgMemo_03.htm */

	var zoomLevel = d3.selectAll("input#zoom-level")[0][0].value;
	var strokeWidthLevel = d3.selectAll("input#stroke-width-level")[0][0].value;
	var centerAdjust = 60 * zoomLevel;

	var path = svgField.append("path").attr({
		"d": lineFunction(pointsArray) + "z", // z オプションによって図形は閉じられる
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

/** 内側に x角形を作るための次の四点を計算する
	@param previousPoints : 新しく作る図形の一個前の図形の座標たち */
function calculateNextPoints(previousPoints) {
	var vertices = previousPoints.length;
	var nextPoints = [];

	for (var i = 0; i < vertices; ++i) {
		var iNext = i + 1;
		if (i === vertices - 1) {
			iNext = 0;
		}
		var xNext = (previousPoints[i][0] + previousPoints[iNext][0]) / 2;
		var yNext = (previousPoints[i][1] + previousPoints[iNext][1]) / 2;
		nextPoints.push([xNext, yNext]);
	}

	return nextPoints;
}