


//封装ajax函数
function ajax(method,url,params){
    return new Promise(function(resolove,reject){
        //发请求(借助jquery内部封装好的方法来发请求)
        $.ajax(url,{
            type:method,//请求类型
            data:params,
            success:function(res){ //回调函数,接收服务器返回的数据
                resolove(res);
            },
            error:function(err){
                reject(err);
            }
        } )
    })
}

//取出cookie里保存的点击的商品Id
var goodsId = $.cookie('goodsId');
//发请求获取商品详情
$(function(){
    ajax("get","./php/getGoodsinfo.php",{'goodsId':goodsId}).then(function(res){
        //渲染到页面上
        var pic = `<img src=${JSON.parse(res).goodsImg} alt=""><div class="mask"></div>`;
        $(".product_mes .pic_small").html(pic);
        var bookname = `<img src="./images/商品详情页/ddzy.png" alt=""><span>${JSON.parse(res).goodsName}</span>`;
        $(".product_mes .msg .text").html(bookname);
        var bookintro = `<span>${JSON.parse(res).goodsDesc}</span>`;
        $(".product_mes .msg .intro").html(bookintro);
        var bookPrice = `<div class="paper">
        <p>当当价</p>
        <p>${JSON.parse(res).goodsPrice}<span>(9.71折)</span></p>
        <p>定价：￥405.00</p>
        </div><div class="ebook">
        <p>电子书价</p>
        <p>￥202.50</p>
        </div>`;
        $(".product_mes .msg .price").html(bookPrice);
        appear();
    })  
})

//收藏
// $.get(
//     "./goodsAndShoppingCart/getGoodsinfo.php",{'goodsId':goodsId}
//     ,function(res){
//         console.log(res);
//         var pic = `<img src=${JSON.parse(res).goodsImg} alt=""><div class="mask"></div>`;
//         console.log(pic);
//         $(".product_mes .pic_small").html(pic);
//     }
// )

//放大镜效果
function appear(){
    var fdj = document.querySelector(".product .container .product_mes .main");
    var small = document.querySelector(".product .container .product_mes  .pic_small");
    var mask = document.querySelector(".product .container .product_mes  .pic_small .mask");
    var big = document.querySelector(".product .container .product_mes .pic_big");
    var bigimg = document.querySelector(".product .container .product_mes .pic_big img");        

    //给小盒子 绑定鼠标移动事件
    small.onmousemove = function(e){
        var x = e.pageX - fdj.offsetLeft - mask.offsetWidth/2;
        var y = e.pageY - fdj.offsetTop - mask.offsetHeight/2;
        if( x < 0 ){
            x = 0;
        }
        if( x > small.offsetWidth - mask.offsetWidth ){
            x = small.offsetWidth - mask.offsetWidth;
        }
        if( y < 0 ){
            y = 0;
        }
        if( y > small.offsetHeight - mask.offsetHeight ){
            y = small.offsetHeight - mask.offsetHeight;
        }
        mask.style.left = x + "px";
        mask.style.top = y + "px";
        //让大图 跟随鼠标移动
        //大图和小图的比例 == 小图和半透明盒子的比例
        var scale = bigimg.offsetWidth/small.offsetWidth;
        bigimg.style.left = -scale*x + "px"; 
        bigimg.style.top = -scale*y + "px"; 

    }
    //给小盒子 绑定鼠标移入事件
    small.onmouseover = function(){
        mask.style.display = "block";
        big.style.display = "block";
    }
    //给小盒子 绑定鼠标移出事件
    small.onmouseout = function(){
        mask.style.display = "none";
        big.style.display = "none";
    }
}
    
var count = $(".product_mes .msg .buy_box .num input").val();
$(function(){
    //数量减一
    $('.product_mes .msg .buy_box .num .num_del').on('click',function(){
        if(count == 1){
            alert("数量已经为1，不能再减少了")
        }else{
            count--;
        }
        $(".product_mes .msg .buy_box .num input").val(count);
    })    
    //数量加一
    $('.product_mes .msg .buy_box .num .num_add').on('click',function(){
        count++;
        $(".product_mes .msg .buy_box .num input").val(count);
    })
})

//点击加入购物车按钮 发请求，加入购物车
$(".product_mes .msg .buy_box .buy_btn").on("click",function(){
    console.log("点击了加入购物车按钮");
    if(!user){
        alert("未登录，请先登录再添加购物车");
        location.href = './login.html';
    }else{
        ajax("post","./php/addShoppingCart.php",{'goodsId':goodsId,'vipName':user,'goodsCount':count}).then(function(res){
           alert("加入购物车成功");
           //location.href = './shoppingcart.html';
        }).catch(function(err){
            alert("加入购物车失败");
        })
    }
})

//页面刷新 取出cookie
var user = $.cookie('username');
if(user){
    $(".menu ul p").html(`<p><span class="red">hi，${user}</span> [退出] </p>`)
}

//点击发布评论按钮，先判断用户是否登录，如果已登录，再判断输入框是否有内容，有内容的话向addComment.php后端接口发请求
$(".fabu button").on("click",function(){
    var content = $(".fabu textarea").val();
    if(user){
        if(content){
            var div = document.createElement('div');
            div.innerHTML = `<div class="items_left">
                    <div class="describe_detail">
                        <span>${content}</span>
                    </div>
                    <div class="pic_show">
                        <img src="./images/商品详情页/comment.jpg" alt="">
                    </div>
                    <div class="starS_line">
                        <span>2022-05-26 16:16:41</span>
                    </div>
                </div>
                <div class="items_right">
                    <img src="./images/商品详情页/user.jpg" alt="">
                    <div>${user}</div>
                </div>`;
            div.classList.add('comment_item');
            $(".goods").prepend(div);
            ajax("post","./php/addComment.php",{'vipname':user,'goodsId':goodsId,'content':content}).then(function(res){
                if(res == 'success'){
                    alert("评论成功");
                }
            })  
        }else{
            alert('请输入评论内容');
        }
    }else{
        alert("未登录，请先登录再进行评论");
        location.href = './login.html';
    } 
})

//页面刷新时向 getComment.php接口发送请求，获取商品评论列表
ajax("get","./php/getComment.php",{'goodsId':goodsId,'pageCount':'20','pageIndex':"1"}).then(function(res){
    var comment = JSON.parse(JSON.parse(res).data);
    var str = $.map(comment,function(item,index){
        return `<div class="comment_item">
        <div class="items_left">
            <div class="describe_detail">
                <span>${item.content}</span>
            </div>
            <div class="pic_show">
                <img src="./images/商品详情页/comment.jpg" alt="">
            </div>
            <div class="star_line">
                <span>${item.commentTime}</span>
            </div>
        </div>
        <div class="items_right">
            <img src="./images/商品详情页/user.jpg" alt="">
            <div>${item.vipName}</div>
        </div>
    </div>`
    }).join("");
    $(".comment .goods").html(str);
});

//点击选项卡切换
$('.t_box .tab').on('click','li',function(){
    var index = $(this).index();
    $('.t_box_left').children().eq(index).show().siblings().hide();
})

//点击登录
$(".nav ul .tushu").on("click",function(){
    location.href = './goodslist.html';
})