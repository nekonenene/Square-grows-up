window.addEventListener("load", function () {

	var points = [ [10, 10], [130, 10], [130, 130], [10, 130] ];
	createSquare(points);

	for ( var i = 0; i < 6; ++i )
	{
		points = calculateNextPoints( points );
		createSquare( points );
	}

	var svgField = d3.select( "svg#sample" )
		.attr({
			"transform" : "scale(1) translate(80, 80)"
		});

}, false);


/* x点の座標をもらってきて、そこから x角形を作成する */
function createSquare(pointsArray)
{
	var svgField = d3.select("svg#sample");

	var lineFunction
	        = d3.svg.line()
	                .x(function(d,i) { return pointsArray[i][0]; })
	                .y(function(d,i) { return pointsArray[i][1]; })
	                .interpolate("linear");

	/* path の SVG については難しいので、以下でオプションを参照のこと
	 * http://www.h2.dion.ne.jp/~defghi/svgMemo/svgMemo_03.htm */
	var path = svgField.append("path")
    	.attr({
        	"d"                : lineFunction(pointsArray)+"z", // z オプションによって図形は閉じられる
        	"stroke"           : "#3e3833",
        	"stroke-width"     : 2.5,
			"fill"             : "none",
			"shape-rendering"  : "auto", // アンチエイリアス設定
			"transform"        : "scale(0.1)",
			"stroke-linejoin"  : "round", // 頂点を丸める
		});

	/* だんだん大きくなる */
	path.transition()
		.duration(1400)
		.attr({
			"transform" :"translate(-60,-60) scale(2)",
		});
}

/* 内側に x角形を作るための次の四点を計算する */
function calculateNextPoints(pointsArray)
{
	var vertices = pointsArray.length;

	var nextPoints = [];
	for ( var i = 0; i < vertices; ++i )
	{
		var iNext = i + 1;
		if( i === vertices - 1 )
		{
			iNext = 0;
		}
		var xNext = ( pointsArray[ i ][ 0 ] + pointsArray[ iNext ][ 0 ] ) / 2;
		var yNext = ( pointsArray[ i ][ 1 ] + pointsArray[ iNext ][ 1 ] ) / 2;
		nextPoints.push( [ xNext, yNext ] );
	}

	return nextPoints;
}
