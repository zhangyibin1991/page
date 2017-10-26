# page
一个比较简单的分页，可单纯前端发分页，也可以和后端共同协作分页（可Form表单提交、Ajax请求）
依赖jQuery。
可传递参数：
totalPage:总的页数。设置总的页数之后，就会忽略totalRecode，不会再通过totalRecode和pageSize计算totalPage。
totalRecode: 总的记录条数。不是必须的，如果页面需要显示总的页数，则需要设置。如果没有设置总的页数（totalPage），则会自动根据totalRecode和pageSize计算totalPage。
currentPage: 当前页。
pageSize: 每页显示的记录条数, 默认20.
pageButtonCount: 页面显示总的按钮数量, <= 0时显示全部。默认显示全部页。
showTotalPage:是否显示“总页数”信息,默认false。
showTotalRecode:是否显示“总条数”信息,默认false。
showFirstEnd: 是否显示首页、末页,默认true。
showJump: 是否显示跳转,默认false。
type: 数据获取方式，可以通过Ajax获取记录，也可以通过Form方式获取记录,可能值：“JSON”/“FORM”，注意区分大小写。通过Ajax方式获取记录，返回的结果通过callBack指定的回调函数出来；通过Form表单提交的方式获取的记录则通过可以JSP等技术显示。
url:Ajax请求地址/Form表单提交的地址。
callBack:处理Ajax获取记录信息回调函数，可以通过该回调函数将Ajax返回的数据显示到页面中。当使用存前端分页时，也是使用该回调函数将记录显示到页面中。
param:请求的参数,Ajax/Form请求时需要一起提交的参数。包含参数的对象。
isFront: 是否前端分页,默认false。
data:为前端分页时，所需要显示的所有记录。

For Example：
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Page Example</title>
		<link rel="stylesheet" href="css/page.css" />
		<script src="js/jquery.js" type="text/javascript"></script>
		<script src="js/page.js" type="text/javascript"></script>
		<script type="text/javascript">
			$(function() {
				$("#show-page").page({
					/*totalRecode: 500,*/
					currentPage:1,
					/*showTotalPage: true,*/
					/*showTotalRecode: true,*/
					pageButtonCount: 3,
					/*showJump: true,*/
					/*totalPage: 30,*/
					/*url:"json/data.json",*/
					/*type: "JSON",*/
					callBack: function(data){
						alert(JSON.stringify(data));
					},
					data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
					pageSize: 4,
					isFront: true
				});
			});
		</script>
	</head>

	<body>
		<div id="show-page"></div>
	</body>
</html>
