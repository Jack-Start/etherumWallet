//加载模块
var express=require('express');
var path=require('path');
var Web3=require('web3');
var BigNumber = require('bignumber.js');
var mysql=require('mysql');
//创建对象
var app=express();
//连接到geth节点
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/johwplXBLt7y4wpFlgQ7"));
   //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8989"));
}


//设置访问路由
app.use('/public',express.static(path.join(__dirname,"public")));//静态资源
//首页
app.get('/',function(req,res){
res.sendFile(path.join(__dirname,"index.html"));
});
//注册新账户
app.use("/register",function(req,res){
  var password=req.query.password;
  var account= web3.personal.newAccount(password);
//  将数据插入数据库


 console.log("新建账号："+account);
  res.send(account);
});
//手动获取账户的以太坊余额
app.use("/getBalance",function(req,res){
  //像数据库发起请求查询数据
  var address=req.query.address;
  var weivalue=web3.eth.getBalance(address);
  console.log("weivalue:"+weivalue);
  var ethvalue=web3.fromWei(weivalue,'ether');
  console.log("返回的余额："+ethvalue.toString());
  res.send(ethvalue.toString());
});

//定义合约abi
var contractAbi =
[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"stop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stopped","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"setName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address[]"},{"name":"num","type":"uint256[]"}],"name":"benchTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];

//合约地址
var contractAddress = "0x7f9ce12bb17d084f0efef95b279ce2a1d00ff97b";//NUT合约地址
var NutContract = web3.eth.contract(contractAbi).at(contractAddress);//NUT合约实例

//获取账户的nut余额
app.use("/getNutBalance",function(req,res){
  var address=req.query.address;
  var Nut_balance=NutContract.balanceOf.call(address);
  var nutvalue=Nut_balance/(1000000000000000000);
  console.log("代币余额："+nutvalue);
res.send(nutvalue.toString());
});

//监听代币交易事件
var myEvent=NutContract.Transfer();
myEvent.watch(function(err, result) {
    if (!err) {
      console.log("from:"+result.args._from);//打印转出账户地址
      console.log("to:"+result.args._to);//打印转入账户地址
        console.log(result.args._value.toNumber()/1000000000000000000);//打印交易额
      console.log("代币又有新交易啦，请调用查余额方法更新用户余额");
    } else {
        console.log(err);
    }
    //myEvent.stopWatching();
});

//发送以太坊
app.use("/sendETH",function(req,res){
  var fromAddr = req.query.fromAddress;
  var toAddr = req.query.toAddress;
  var val = req.query.value;

  var bol=web3.personal.unlockAccount(fromAddr,"zx232423",1000);
  console.log("账户解锁"+bol.toString());

  var txhash=web3.eth.sendTransaction({from:fromAddr,to:toAddr,value:val*10^18});
  console.log("以太坊交易哈希："+txhash);

  var ubol=web3.personal.lockAccount(fromAddr);
   console.log("锁定账户："+ubol);
  res.send(txhash);
});
//发送NUT
app.use("/sendNUT",function(req,res) {
  var fromaddr = req.query.fromAddress;
  var toaddr = req.query.toAddress;
  var val = req.query.value;

  var bol=web3.personal.unlockAccount(fromaddr,"zx232423",1000);//解锁账户
  console.log("账户解锁"+bol.toString());

  var txhash = NutContract.transfer.sendTransaction(toaddr, val*1000000000000000000, {from:fromaddr});
  console.log("代币交易哈西："+txhash);

  var ubol=web3.personal.lockAccount(fromaddr);//锁定账户
   console.log("锁定账户："+ubol);
     res.send(txhash);
});
//批量转出NUT
app.use("/benchNUT",function(req,res) {
  var fromaddr=req.query.fromAddress
  var arrT=req.query.toAddress.split(',');
  var arrV=req.query.value.split(',');
  var newV=[];
  for (var i = 0; i < arrV.length; i++){//将String数组转NUmber数组
    newV.push(Number.parseInt(arrV[i]));
}
if(arrT.length!==newV.length){//判断传入参数当地址集和交易额集是否一致
    res.send("传入的数据有误");
}else{
var bol=web3.personal.unlockAccount(fromaddr,"zx232423",1000);//实际运营中从数据库读取密码
if(bol===false){//判断密码是否正确，如正确则会解锁成功
  res.send("解锁账户或密码有误");
}else{
  var txhash = NutContract.benchTransfer.sendTransaction(arrT,newV, {from:fromaddr});
  web3.personal.lockAccount(fromaddr);//锁定账户
    res.send(txhash);
    }
  }
});
//批量转入NUT
app.use("/fromMore",function(req,res){
  //from 账户数组
  var fArray= req.query.fromAddress.split(',');
  var toaddr = req.query.toAddress;
  var arrV=req.query.value.split(',');
  var newV=[];
  var hashArray=[];
  for (var i = 0; i < arrV.length; i++){//将String数组转NUmber数组
    newV.push(Number.parseInt(arrV[i]));
  }
  if(fArray.length!=newV.length){//判断传入参数当地址集和交易额集是否一致
    res.send("传入的数据有误");
  }else{
  for(var i=0;i<fArray.length;i++){//循环遍历每一个转出账户解锁并发送交易
    var bol=web3.personal.unlockAccount(fArray[i],"123",9999);//实际运营中从数据库读取密码
    if(bol===false){
      res.send("解锁账户或密码有误");
    }else{
        var tx=web3.eth.sendTransaction({from:fArray[i],to:toaddr,value:newV[i]});
        web3.personal.lockAccount(fArray[i]);
        hashArray.push(tx);//将所有交易放入一个数组
        }
     }
  res.send(hashArray);
    }
});
  //myEvent.stopWatching();
//监听9090端口
app.listen(9090,function(){
  console.log("服务器启动了！！！");
});
