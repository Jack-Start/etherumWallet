function register()
{
    var password = document.getElementById("password").value;

    $.get("/register?password=" + password, function(data){
        if(data == "Error")
        {
            $("#address_test").text("An error occured.");
        }
        else
        {
            $("#address_test").html("地址: " + data);
        }
    });
}

function getBalance()
{
  var address = document.getElementById("address").value;

  $.get("/getBalance?address=" + address, function(data){

      if(data == "Error")
      {
          $("#address_balance").text("An error occured.");
      }
      else
      {
          $("#address_balance").html("ETH余额: " + data);
      }
  });
}
function bsnslceofNut()
{
  var address = document.getElementById("address_nut").value;

  $.get("/getNutBalance?address=" + address, function(data){

      if(data == "Error")
      {
          $("#Nut_balance").text("An error occured.");
      }
      else
      {
          $("#Nut_balance").html("NUT余额:" + data);
      }
  });

}

function sendETH()
{
    var address_a = document.getElementById("address_a").value;
    var address_b = document.getElementById("address_b").value;
    var trans_value = document.getElementById("trans_value").value;

    var tx_hash = document.getElementById("tx_hash").value;

    //转账
    $.get("/sendETH?fromAddress=" + address_a + "&toAddress=" + address_b + "&value=" + trans_value, function(data){

        $("#tx_hash").html("交易: " + data);

    });

}
function sendNUT()
{
      var address_f = document.getElementById("address_f").value;
      var address_t = document.getElementById("address_t").value;
      var trans_v = document.getElementById("trans_v").value;

      var nut_hash = document.getElementById("nut_hash").value;

      //转账
      $.get("/sendNUT?fromAddress=" + address_f + "&toAddress=" + address_t + "&value=" + trans_v, function(data){
          $("#nut_hash").html("交易: " + data);

      });
}

function sendbenchNUT()
{
      var address_f = document.getElementById("address_Af").value;
      var address_t = document.getElementById("address_tArr").value;
      var trans_v = document.getElementById("trans_vArr").value;

      //转账
      $.get("/benchNUT?fromAddress=" + address_f + "&toAddress=" + address_t + "&value=" + trans_v, function(data){

          $("#nutArr_hash").html("交易: " + data);

      });
}

function fromMore()
{
      var address_f = document.getElementById("address_ff").value;
      var address_t = document.getElementById("address_tt").value;
      var trans_v = document.getElementById("trans_vv").value;

      //转账
      $.get("/fromMore?fromAddress=" + address_f + "&toAddress=" + address_t + "&value=" + trans_v, function(data){
          $("#MTO_hash").html("交易: " + data);

      });
}
