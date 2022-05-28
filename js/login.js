//密码明文显示与隐藏
$(function(){
    //获取标签
    var eye = document.querySelector('.register .content span');
    var pwd = document.getElementById('pwd');
    var flag = 0;
    //绑定事件
    eye.onclick = function(){
        if(flag == 0){
            pwd.type = 'text';
            eye.classList.remove('icon-biyanjing');
            eye.classList.add('icon-yanjing');
            flag = 1;
        }else{
            pwd.type = 'password';
            eye.classList.remove('icon-yanjing');
            eye.classList.add('icon-biyanjing');
            flag = 0;
        }
    }
})

//密码框验证码框切换
$(function(){
    var spans = $('.register .btns span');
    var contentdiv = $('.register .content>div');
    var current_index = 0;
    $('.register .btns span').on('click',function(){
        current_index = $(this).index();
        console.log(current_index);
        spans.removeClass('active');
        spans.eq(current_index).addClass('active');
        contentdiv.eq(current_index).show().siblings().hide();
    })
})


//点击登录按钮发送请求(发请求前先做前端验证)

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
	if($("#pwd").val()==""){
		return false;
	}
	//2)、格式判断
	// 数字，6-16位
	let reg = /^\d{6,16}$/;
	if(!reg.test($("#pwd").val())){
		return false;
	}
	return true;
}
$(function(){
    let oBtnLogin = document.getElementById("btnLogin");
    let oUserPass = document.getElementById("pwd"); 
    let oUserName = document.getElementById("username"); 
    $("#username").blur(function(){
        if(isUserName()==false){
            $("#showUser").css({"color":"red"});
            $("#showUser").html("亲，用户名的格式不正确！");
            return;
        }
    })
    $("#pwd").blur(function(){
        //1、前端验证
        if(isPass()==false){
            $("#showPass").html("亲，密码格式不正确	！");
            $("#showPass").css({"color":"red"});
            return;
        }else{
            $("#showPass").html("√");
        }
    });
    oBtnLogin.onclick = function(){
        if(isTest()==false){
            $("#messageBox").html("亲，您的信息输入不全");
            return;
        }
        let xhr = new XMLHttpRequest();
        xhr.open("post","./php/login.php",true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState==4 && xhr.status==200){   
               if(xhr.responseText=="success"){
                   var name=$('#username').val();
                   //存入cookie
                   $.cookie("username", name,{expires:7});
                   document.getElementById("msg").innerHTML = "登录成功!2秒后跳转到<a href='./index.html'>首页</a>页面";
                   setTimeout(()=>{
                        location.href="./index.html";
                    },2000);
               }else{
                   document.getElementById("msg").innerHTML = "登录失败,用户名或者密码错误";
               }
            }
        }
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        let str = "username="+oUserName.value+"&userpass="+oUserPass.value;
        xhr.send(str);
    }    
})

//点击立即注册按钮 跳转到注册页
$(".register .zhuce").on("click",function(){
    location.href="./register.html";
})

