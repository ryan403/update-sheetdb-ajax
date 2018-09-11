const SHEETDB_API_ID = "YourSheetDB API ID";

$(document).ready(function() {
    //Get the switch status from Google Sheets
    getLightSwitchStatus();
    
    //If user change the switch manually
    $("input[type=checkbox]").change(function(e) {
        
        var setStatus;
        //The very early moment is still trun off status.  
        if($(".slider").css("backgroundColor")=="rgb(204, 204, 204)")
        {
            console.log("開!");
            $("img").attr("src","images/pic_bulbon.gif");
            $("h1").text("電燈狀態：開");
            setStatus=true;
        }else
        {
            console.log("關!");
            $("img").attr("src","images/pic_bulboff.gif");
            $("h1").text("電燈狀態：關");
            setStatus=false;
        }
        
        //update to Google Sheets if need. - It will count once.
        updateLightSwitchStatus(setStatus);
        
    });
});

function getLightSwitchStatus(){
    var url = "https://sheetdb.io/api/v1/"+SHEETDB_API_ID+"/search?";
    var data = $.getJSON(url,{
        light_name:"main"
    })
    .done(
        function(msg){
            console.log(msg);
            $("h1").text("電燈狀態："+msg[0].light_switch);
            if(msg[0].light_switch=="開"){
                $("img").attr("src","images/pic_bulbon.gif");
                $("input[type=checkbox]").attr("checked","checked");
            }else{
                $("img").attr("src","images/pic_bulboff.gif");
                $("input[type=checkbox]").attr("checked",null);
            }
        }
    )
    .fail(
        function(msg){
            console.log("fail!");
        }
    )
    .always(
        function(msg){
            console.log("complete!");
        }
    );
}

function updateLightSwitchStatus(status){
    
    var uri = "https://sheetdb.io/api/v1/"+SHEETDB_API_ID+"/light_name/main";
    var thisQs={};
    thisQs.light_name = "main";  
    var switchStatus="";
    (status)? switchStatus="開" : switchStatus="關";
    thisQs.light_switch = switchStatus;
    $.ajax({
      url: uri,
      type: 'PUT',
      data: {"data":[thisQs]}
    })
    .done(function(data){
        console.log('success update!');
    })
    .fail(
        function(msg){
            console.log("fail!");
        }
    )
    .always(
        function(msg){
            console.log("complete!");
        }
    );
}
