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

//页面刷新 获取所有的商品类型
ajax("get","./php/getGoodsType.php").then(function(res){
    console.log(JSON.parse(res));
    var str = $.map(JSON.parse(res),function(item,index){
        console.log(item);
        return `<span id=${item.typeId}>${item.goodsType}</span>`
    }).join("");
    $(".typename").html(str);
});

//页面刷新 默认获取图书的所有商品并渲染
ajax("get","./php/getGoodsList.php",{"typeId":"001"}).then(function(res){
    var str = $.map(JSON.parse(res),function(item,index){
        return `<ul class="list">
        <li class="item">
            <div class="pic">
                <a href="./gooddetail.html"><img src="${item.goodsImg}" alt=""></a>
            </div>
            <div class="name">${item.goodsName}</div>
            <div class="author">${item.goodsDesc}</div>
            <div class="price">￥${item.goodsPrice}</div>
        </li>
    </ul>`;
    }).join('');
    $(".goods_list .container .detail .goods").html(str);
})

//点击某类商品获得该类商品的所有商品并渲染
$(".typename").on("click","span",function(){
    var id = $(this).attr("id");
    ajax("get","./php/getGoodsList.php",{"typeId":id}).then(function(res){
        var str = $.map(JSON.parse(res),function(item,index){
            return `<ul class="list">
            <li class="item">
                <div class="pic">
                    <a href="./gooddetail.html"><img src="${item.goodsImg}" alt=""></a>
                </div>
                <div class="name">${item.goodsName}</div>
                <div class="author">${item.goodsDesc}</div>
                <div class="price">￥${item.goodsPrice}</div>
            </li>
        </ul>`;
        }).join('');
        $(".goods_list .container .detail .goods").html(str);
        var uls = $(".goods_list .goods ul");
        //点击商品，跳转到商品详情，同时保存商品id到cookie
        $(".goods_list .goods").on("click","ul",function(){
            var current_index = $(this).index();
            var id = JSON.parse(res)[current_index].goodsId;
            console.log(id);
            //把获取到的id存入cookie
            $.cookie("goodsId",id,{expires:7});
        })
    })
})




//页面刷新 取出cookie
var un = $.cookie('username');
if(un){
    $(".menu ul p").html(`<p><span class="red">hi，${un}</span> [退出] </p>`);
}

