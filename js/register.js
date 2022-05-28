// 一、先做前端的表单验证
//功能：所有前端的验证；
function isTest(){
	return isUserName()&&isPass();
}
//1、用户名的前端验证
function isUserName(){
	//1)、非空判断
	if($("#username").val()==""){
		return false;
	}
	//2)、格式判断
	// 用户名有数字，字母下划线组成，但不能以数字开头，2-10位
	let reg = /^[a-zA-Z_]\w{1,9}$/;
	if(!reg.test($("#username").val())){
		return false;
	}
	return true;
}
//2、密码的前端验证
function isPass(){
	//1)、非空判断
	if($("#userpass").val()==""){
		return false;
	}
	//2)、格式判断
	// 数字，6-16位
	let reg = /^\d{6,16}$/;
	if(!reg.test($("#userpass").val())){
		return false;
	}
	return true;
}

//二、后端验证
let hasUser = false;//该用户名不存在
function hasUserBack(){
	//后端验证用户名是否存在
	$.get("./php/checkUser.php",{"username":$("#username").val()},function(data){
		if(data=="0"){
			$("#showUser").html("亲，该用户名已经存在，请重新思考！");
			$("#showUser").css({"color":"red"});
			hasUser = true;
		}else{
			$("#showUser").html("亲，该用户名可以使用，赶紧注册吧！");
			$("#showUser").css({"color":"green"});
			hasUser = false;
		}
	})
}

$(function(){		
		$("#username").blur(function(){
			//1、前端验证
			if(isUserName()==false){
				$("#showUser").css({"color":"red"});
				$("#showUser").html("亲，用户名的格式不正确！");
				return;
			}
			//2、后端的验证
			hasUserBack();
		});	

		$("#userpass").blur(function(){
			//1、前端验证
			if(isPass()==false){
				$("#showPass").html("亲，密码格式不正确	！");
				$("#showPass").css({"color":"red"});
				return;
			}else{
				$("#showPass").html("√");
			}
		});

		$("#btnReg").click(function(){
			//1、前端验证
			if(isTest()==false){
				$("#messageBox").html("亲，您的信息输入不全");
				return;
			}
			//2、用户名是否存在(后端验证)
			if(hasUser){
				return;
			}		
			$.post(
				"./php/addUser.php",
				{
					"username":$("#username").val(),
					"userpass":$("#userpass").val()
				},
				function(data){
                    console.log(data);
					if(data=="success"){
						$("#messageBox").css({"color":"green"});
						$("#messageBox").html("恭喜您，注册成功！2秒后跳转到<a href='./login.html'>登录</a>页面");
						setTimeout(()=>{
							location.href="./login.html";
						},2000);
					}else if(data=="fail"){
						$("#messageBox").css({"color":"red"});
						$("#messageBox").html("不好意思，注册失败!");
					}else{
						$("#messageBox").css({"color":"red"});
						$("#messageBox").html("不好意思，服务器出问题了!");
					}
				}
			);
		});
	});
	