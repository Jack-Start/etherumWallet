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
      var address_f = document.getElementById("address_f").value;
      var address_t = document.getElementById("address_t").value;
      var trans_v = document.getElementById("trans_v").value;

      //转账
      $.get("/fromMore?fromAddress=" + address_f + "&toAddress=" + address_t + "&value=" + trans_v, function(data){
          $("#MTO_hash").html("交易: " + data);

      });
}
