
一、搭建环境：
   安装本目录下的 phpStudy_64.rar。保证环境的版本：

   	apache：2.4.39

   	php：7.4.3nts

   	mysql：5.7.26


二、按照以下步骤，进行开发

1、建库，建表：
    1)、建库：根据自己的项目建立数据库

    2）、建表
       把文件“电子商务数据库.sql”的代码在mysql执行一下，完成建表。


2、修改数据库连接的用户名，密码，库名
    1）、把goodsAndShoppingCart文件夹下的内容拷贝到项目里。  
    2）、把文件夹“goodsAndShoppingCart/conndb.php”文件里的数据库连接的用户名，密码，库名进行修改

3、添加商品类型：

      打开“addGoodsType.html”文件添加商品类型。

4、添加商品：
      打开“addGoods.html”文件添加商品。

5、开发功能：

      依据接口文档“电子商务网站的后端接口.md”，进行功能开发。
      
