//发请求ajax方法
function ajax(method,url,params){
    return new Promise(function(resolove,reject){
        //发请求(借助jquery内部封装好的方法来发请求)
        $.ajax(url,{
            type:method,//请求类型
            data:params,
            success:function(res){ //回调函数,接收服务器返回的数据
                resolove(res)
            },
            error:function(err){
                reject(err);
            }
        } )
    })
}

//底部  点击关闭按钮关闭广告
$(function(){
    $('.bottomadv span').on('click',function(){
        $('.bottomadv').hide();
    })
})

//顶部  页面刷新顶部广告变窄
function debounce(){
    var timerid = null;//保存定时器id
    return function(){      
        if( timerid ) {
            clearTimeout( timerid );
        }
        //创建定时器 并保存定时器id
        timerid = setTimeout(function(){
            $(".topbanner .container").stop(true,true).animate({height:200},1000);            
        },1000)
    }
}
window.onload = debounce(); 

//折叠卡片
$(function(){
    $(".book .right ul li").on("mouseenter",function(){
        $(this).stop().animate({height:133},200).find(".bar").hide().siblings(".item").show();
        $(this).siblings("li").stop().animate({height:33},200).find(".item").hide().siblings(".bar").show();
    })
})

//页面刷新 向bannerGet.php文件发请求，拿到轮播图数据并进行渲染
ajax("get","./php/bannerGet.php").then(function(res){
    var str = $.map(JSON.parse(res),function(item,index){
        return `<img    src=${item.img}  ${index==0?"class="+"active":""}>`;
    }).join('');
    $(".list .container .center .swiper1 .imgs").html(str);
    swiper();
})

//轮播图
function swiper(){
    var imgs =  $(".list .swiper1  .imgs img");
    var spans = $(".list .swiper1  .spans span");
    var timerid = null;
    var current_index = 0;
    autoPlay();
    //自动轮播
    function autoPlay(){
        timerid = setInterval(function(){
            current_index++;
            if(current_index > imgs.length-1){
                current_index = 0;
            }
            changePic();
        },2000)
    }
    //鼠标移入移出
    $('.list .swiper1').on("mouseover",function(){
        $('.list .swiper1 .left1').show().nextAll().show();
        clearInterval(timerid);
    })
    $('.list .swiper1').on("mouseout",function(){
        $('.list .swiper1 .left1').hide().nextAll().hide();
        autoPlay();
    })
    //点击左箭头
    $('.list .swiper1 .left1').on('click',function(){
        current_index--;
        if( current_index < 0 ){
            current_index = imgs.length-1;
        }
        changePic();
    })
    //点击右箭头
    $('.list .swiper1 .right1').on('click',function(){
        current_index++;
        if( current_index > imgs.length-1 ){
            current_index = 0;
        }
        changePic();
    })
    //点击小圆点
    spans.on("click",function(){
        current_index=$(this).index();
        console.log(current_index);
        changePic();
    })
    //封装函数 切换图片
    function changePic(){
        imgs.removeClass("active");
        imgs.eq(current_index).addClass('active');
        spans.removeClass("active");
        spans.eq(current_index).addClass('active');
    }
}

//第二个轮播图
$(function(){
    var swiper_index = 0;
    //自动轮播
    setInterval(function(){
        swiper_index++;
        if(swiper_index > $(".swiper2 div").length-1){
            swiper_index = 0;
        }
        $(".swiper2 div").eq(swiper_index).show().siblings("div").hide();
    },2000)
    //鼠标移入移出
    $('.list .swiper2').on("mouseover",function(){
        $('.list .swiper2 .icon-xiangzuojiantou').show().nextAll().show();
    })
    $('.list .swiper2').on("mouseout",function(){
        $('.list .swiper2 .icon-xiangzuojiantou').hide().nextAll().hide();
    })
    //点击左箭头
    $('.list .swiper2 .icon-xiangzuojiantou').on('click',function(){
        swiper_index--;
        if( swiper_index < 0 ){
            swiper_index = $(".swiper2 div").length-1;
        }
        $(".swiper2 div").eq(swiper_index).show().siblings("div").hide();
    })
    //点击右箭头
    $('.list .swiper2 .icon-xiangyoujiantou').on('click',function(){
        swiper_index++;
        if( swiper_index >$(".swiper2 div").length-1 ){
            swiper_index = 0;
        }
        $(".swiper2 div").eq(swiper_index).show().siblings("div").hide();
    })
})

//倒计时秒杀
$(function(){
    var endtime = new Date("2022-5-27 23:00:00");
    var span =  $(".countdown .time .numtime span:even");
    var timerid1 = setInterval(function(){
        var now = new Date();
        var time = endtime - now; 
        var hour = parseInt( time/(1*60*60*1000) );
        var minute = parseInt( time/(1*60*1000) )  % 60 ;
        var second = parseInt( time/(1*1000) )  % 60 ;
        span.eq(0).html(buling(hour));
        span.eq(1).html(buling(minute));
        span.eq(2).html(buling(second));
    },1000)
    //补零函数, 传入一个数字, 返回补零后的字符串
    function buling(num){
        return num<10?'0'+num:''+num;
    }
})

//页面刷新 取出cookie
var user = $.cookie('username');
if(user){
    $(".menu ul p").html(`<p><span class="red">hi，${user}</span> [退出] </p>`)
}

//页面刷新，向后端getGoodsListNew.php发送请求 获取typeId为001的最新的6条商品，并渲染到页面
ajax("get","./php/getGoodsListNew.php",{'typeId':"001",'count':6}).then(function(res){
    var str = $.map(JSON.parse(res),function(item,index){
        return `<ul class="list">
        <li class="item">
            <div class="pic">
                <img src="${item.goodsImg}" alt="">
            </div>
            <div class="name">${item.goodsName}</div>
            <div class="author">${item.goodsDesc}</div>
            <div class="price">￥${item.goodsPrice}</div>
        </li>
    </ul> `;
    }).join('');
    $(".tuijian .tuijian_list").html(str);
})

//点击登录
$("header .container p .red").on("click",function(){
    location.href = './login.html';
})