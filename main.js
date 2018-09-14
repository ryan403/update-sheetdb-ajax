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
        //將網頁的狀態更新至SheetDB
        updateLightSwitchStatus(setStatus);
        
    });
});

function getLightSwitchStatus(){
    //SheetDB API - Search
    //給予搜尋條件，符合條件的列全部變成一個集合，傳回
    var url = "https://sheetdb.io/api/v1/"+SHEETDB_API_ID+"/search?";
    //搜尋條件：light_name為main
    var data = $.getJSON(url,{
        light_name:"main"
    })
    .done( //如果成功呼叫就進入這裡
        function(msg){
            console.log(msg);
            //更新標題文字顯示的電燈狀態
            $("h1").text("電燈狀態："+msg[0].light_switch);
            //更新開關，如果傳來的值是開，就用開燈的圖片、把開關打開
            if(msg[0].light_switch=="開"){
                $("img").attr("src","images/pic_bulbon.gif");
                $("input[type=checkbox]").attr("checked","checked");
            }else{ //否則就用關燈的圖片、還有把開關關掉
                $("img").attr("src","images/pic_bulboff.gif");
                $("input[type=checkbox]").attr("checked",null);
            }
        }
    )
    .fail( //如果呼叫失敗就進入這裡
        function(msg){
            console.log("fail!");
        }
    )
    .always( //不論成功或失敗都要做的事情放這裡
        function(msg){
            console.log("complete!");
        }
    );
}

function updateLightSwitchStatus(status){
    //使用SheetDB API - 找到light_name為main的那一列來進行更新
    var uri = "https://sheetdb.io/api/v1/"+SHEETDB_API_ID+"/light_name/main";
    //將要更新的內容都放入thisQs
    var thisQs={};
    //所以有light_name為main
    thisQs.light_name = "main";
    //開關狀態要依據傳入值來決定  
    var switchStatus="";
    //如果status為真，就設定switchStatus為開，否則就是設定為關
    (status)? switchStatus="開" : switchStatus="關";
    thisQs.light_switch = switchStatus;
    //使用jQuery .ajax方法來傳東西給SheetDB
    $.ajax({ //網址、PUT方法、SheetDB指定的格式，東西放在data key對應的陣列中
      url: uri,
      type: 'PUT',
      data: {"data":[thisQs]}
    })
    .done(function(data){ //成功
        console.log('success update!');
    })
    .fail( //失敗
        function(msg){
            console.log("fail!");
        }
    )
    .always( //都要做的事
        function(msg){
            console.log("complete!");
        }
    );
}
