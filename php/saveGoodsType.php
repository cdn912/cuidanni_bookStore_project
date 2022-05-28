<?php
	header("Content-Type:text/html;charset=utf-8");
	$conn = mysqli_connect("localhost:3306","root","root","book");
	if(!$conn){
		die("数据库连接失败：请检查，数据库的地址，端口号，用户名，密码和数据库名是否正确");
	}
	function preDo($str){

		$str = str_replace("'","‘",$str);
		$str = str_replace("\"","”",$str);
		$str = str_replace("(","（",$str);
		$str = str_replace(")'","）",$str);
		$str = str_replace(",'","，",$str);

		return $str;
	}

	//1、接受客户端的数据（用户输入的数据）
	$typeId   =  preDo($_REQUEST['typeId']);
	$goodsType =  preDo($_REQUEST['goodsType']);

	//2、数据保存在数据库中
	
	//3）、传输数据（过桥）
	$sqlstr = "insert into goodstype values('".$typeId."','".$goodsType."')";
	
	$count = mysqli_query($conn,$sqlstr);
	if(!$count){
		die('插入失败！'.mysqli_error());
	}
	//4）、关闭连接（拆桥）
	mysqli_close($conn);
	
	//3、给客户端返回（响应）一个注册成功！
	if($count>0){
	    echo "保存成功,<a href='addGoodsType.html'>继续添加</a>";
	}
	
?>