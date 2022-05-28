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

	//1接收数据
	$username = preDo($_GET["username"]);

	//2、在数据库中查询
	//1)、建立连接，并选择数据库
	
	//2)、执行SQL语句（查询）
	$sqlStr="select * from vip where username='$username'";

	   $result = mysqli_query($conn,$sqlStr);
	   
	   //3)、关闭连接
	   mysqli_close($conn);

	//3、响应结果
	//获得$result的行数
	$rows = mysqli_num_rows($result);
		
	if($rows>0){//如果用户名存在，返回0；
		echo "0";	
	}else {//如果用户名不存在，返回1.
		echo "1";
	}	

?>