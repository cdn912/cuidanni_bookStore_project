var user = $.cookie('username');
if(user){
    $(".menu ul .login").html(`<span class="red">hi，${user}</span> [退出]`)
}

var list = [];



//页面刷新，如果未登录，则跳转到登录页,如果已登录，则将购物车中的数据渲染到页面上
$(function(){
    if(!user){
        alert("未登录，请先登录");
        location.href = './02-login.html';
    }else{
        ajax("get","./php/getShoppingCart.php",{'vipName':user}).then(function(res){
            render(res);
            list = JSON.parse(res);
            console.log(list);
        }) 

    }
});

//封装函数删除和数量加1减1
function changeCart(){
    //1.数量加1减1
    $('.shoppingbag .shoppinglist').on('click','.num_del,.num_add',function(){
        var id = $(this).parent().parent().attr("id");//获取点击的商品id
        var count = $(this).siblings("input").val();
        var price = $(this).parent().siblings(".perprice").find("div").find("span").html();
        if(this.className == "num_del"){
            count == 1 ? alert("数量已经为1，不能再减少") : count--;
        }else if(this.className == "num_add"){
            count++;
        }
        $(this).siblings("input").val(count);
        $(this).parent().siblings(".sum").children().html("￥"+price*count);
        ajax("get","./php/updateGoodsCount.php",{'vipName':user,'goodsId':id,'goodsCount':count}).then(function(res){
            //console.log(res);
        })
    })
    //2.删除商品
    $(".shoppingbag .shoppinglist").on("click",'.del',function(){
        var id = $(this).parent().parent().attr("id");;
        $(this).parent().parent().remove();
        ajax("get","./php/deleteGoods.php",{'vipName':user,'goodsId':id}).then(function(res){
            console.log(res);
        })
    })
}
changeCart();

//封装函数全选和全不选
function changeBtn(){
    //点击全选框
    $(".shoppingsum .checkall").on("click","input",function(){
        var allChecks = $('.shoppingbag .shoppinglist .goods .select input');
        for(var i = 0 ; i < allChecks.length ; i++){
            allChecks.prop("checked",this.checked);
        }
    })
    //点击复选框
    $('.shoppingbag .shoppinglist').on('click',".select input",function(){
        //判断全选按钮是否还能勾选
        var flag = true; //flag控制全选按钮是否选中
        var inputs = $(this).parent().parent().parent().find(" .select input");
        for(var i = 0 ; i < inputs.length ; i++){
            if(!inputs[i].checked){
                flag = false;
            };
        }
        $(".shoppingsum .checkall input").prop("checked",flag);

        //数量 和 金额 变化

    })
}
changeBtn();

//封装渲染函数
function render(res){
    var str = $.map(JSON.parse(res),function(item,index){
        return `<div class="goods" id=${item.goodsId}>
        <div class="select">
            <input type="checkbox" checked="false">
        </div>
        <div class="pic">
            <img src="${item.goodsImg}" alt="">
        </div>
        <div class="row_name">
            <span class="name">${item.goodsName}</span>
            <span class="red">比加入购物车时降低1.80元</span>
        </div>
        <div class="perprice">
            <div>￥<span>${item.goodsPrice}</span></div>
            <div class="cuxiao">促销</div>
        </div>
        <div class="amount">
            <span class="num_del">-</span>
            <input type="text" value="${item.goodsCount}">
            <span class="num_add">+</span>
        </div>
        <div class="sum">
            <span class="red">￥${item.goodsCount*item.goodsPrice}</span>
        </div>
        <div class="caozuo">
            <div>移入收藏</div>
            <div class="del">删除</div>
        </div>
    </div>`;
    }).join('');
    $(".shoppingcart .container .shoppingbag .shoppinglist").html(str);

    var count = JSON.parse(res).reduce(function(t,i){
        return t + parseInt(i.goodsCount);
    },0);
    $(".shoppingsum .msg span").html(count);

    var total = JSON.parse(res).reduce(function(t,i){
        return t + parseInt(i.goodsCount)*parseFloat(i.goodsPrice);
    },0);
    $(".shoppingsum .sum span").eq(1).html('￥'+total);
}


//封装ajax发请求方法
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
