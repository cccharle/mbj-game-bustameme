var winners = [];
var winnersArray = [];
var numberOfWinners;
var totalWin;
var currentSliderId;
var seOcapityId;
var setOcapity;
var oldWinCount = 0;

var offset = 10;

//bitmap or text
var sizeOfComponent = Math.round(getWindowWidth()/winners_onScreen()) - offset;

// winner is an image or text next to image
function winners_onScreen(){
    return 4;
}

// some tablets have width 1500px so minimum 15 winners
function number_of_winners_from_server(){
    return 12;
}

function get_winners(whichwinners){
    
    //stillLoading = true;
    // jQuery.ui.showMask();

    var payload = {
        "resource": "v2services",
        "method": "winners",
        "params": {
            "limit":String(number_of_winners_from_server())
        }
    };

    var opts = {
        type: 'POST',
        url: API_URL,
        data: JSON.stringify(payload),
        contentType: 'application/json',
        success: function(data)

        {
            winners = [];
            winnersArray = [];
            
            var json = JSON.parse(data);
            console.log(json);
            var status = json.status;
            winnersArray = json.response.winners;
            totalWin = json.response.totalbeans;
            numberOfWinners = winnersArray.length;
            console.log(json);
            console.log(status);
            
            if (status === 1) {  
              parse_winners();
                if(whichwinners ==="mainmenu"){
                    append_winners();
                }
                else if(whichwinners ==="totalbeans"){
                    append_totalbeans(totalWin);
                }
                else if(whichwinners==="mybeans"){
                    console.log("append mybeans winners");
                    mybeans_append_winners();}
              // jQuery.ui.hideMask();
              stillLoading=false;                     
            } else {
              af.ui.hideMask();
              stillLoading = false;
              console.log("Failed to initialize slider. API request failed.");                      
            }

        },
        error: function(data)

        {
            af.ui.hideMask();
            stillLoading = false;
                    
        }
    };
    var result = jQuery.ajax(opts);

}

function parse_winners(){ 
    for(var i = 0 ; i < numberOfWinners ; i ++){
        push_to_winners(i);
    }   
}

function push_to_winners(i){
    
    if(!winnersArray[i].sponsorlogourl.contains(".jpg") &&
            !winnersArray[i].sponsorlogourl.contains(".png") && 
            !winnersArray[i].sponsorlogourl.contains(".gif")){
                winnersArray[i].sponsorlogourl = winnersArray[i].sponsorlogourl+".jpg";
     }
    
    winners.push({
        appkey: winnersArray[i].appkey,
        appname: winnersArray[i].appname,
        sponsorlogourl: winnersArray[i].sponsorlogourl,
        username: winnersArray[i].username
    });
}

function mybeans_append_winners(){
    
    // String value with px
    var size_text = String(Math.round((sizeOfComponent/4)))+"px";
    
   console.log("this is size of text " + size_text);

   af("#slider_components2").empty();
   af("#slider2_container").attr('style',"position:relative;"+"width:"+Math.floor(getWindowWidth())+"px; height:"+Math.floor((getWindowWidth()/6)+70+50)+"px;"+"overflow: hidden;");
   af("#slider_components2").attr('style',"position:relative;"+"width:"+Math.floor(getWindowWidth())+"px; height:"+Math.floor((getWindowWidth()/6)+70+50)+"px;"+"overflow: hidden;");
 af("#mybeans_header_before").attr('style',"background:#1c1b20!important;height:"+Math.floor((getWindowWidth()/6)+50+ 70)+"px!important;");
   for (var i = 0 ; i < number_of_winners_from_server() ; i++)
   {
       if(i === number_of_winners_from_server() - 1){
        currentSliderId = slider2_container;
        setOcapity = "main_slider_div2";
        var id_of_last_child = number_of_winners_from_server() - 1;
        af("#slider_components2").append(
        "<div id='main_slider_div2"+id_of_last_child+"' style='opacity:0'>" +
          "<img class='slider_image' alt='logo' onload='initSlider()' src='"+winners[i].sponsorlogourl+"' style='position: relative; left: 5px; top:5px; width:"+Math.floor(getWindowWidth()/6)+"px; height:"+Math.floor(getWindowWidth()/6)+"px;' />" +
                "<h3 style='position:relative; left: 5px; top:5px; text-overflow: ellipsis;white-space:nowrap;overflow:hidden;'>"+winners[i].username+"</h3>" +
                "<h3 style='position:relative; left: 5px; top:5px; text-overflow: ellipsis;white-space:nowrap;overflow:hidden;'>"+"won at"+"</h3>" +
                "<h3 style='position:relative; left: 5px; top:5px; text-overflow: ellipsis;white-space:nowrap;overflow:hidden;'>"+winners[i].appname+"</h3>" +
            "</div>" 
        );
    } else
    {   
        af("#slider_components2").append(
        "<div id='main_slider_div2"+i+"' style='opacity:0'>" +
          "<img class='slider_image' alt='logo' src='"+winners[i].sponsorlogourl+"' style='position: relative; left: 5px; top:5px; width:"+Math.floor(getWindowWidth()/6)+"px; height:"+Math.floor(getWindowWidth()/6)+"px;' />" +
                "<h3 style='position:relative; left: 5px; top:5px;  text-overflow: ellipsis;white-space:nowrap;overflow:hidden;'>"+winners[i].username+"</h3>" +
                "<h3 style='position:relative; left: 5px; top:5px; text-overflow: ellipsis;white-space:nowrap;overflow:hidden;'>"+"won at"+"</h3>" +
                "<h3 style='position:relative; left: 5px; top:5px; text-overflow: ellipsis;white-space:nowrap;overflow:hidden;'>"+winners[i].appname+"</h3>" +
        "</div>" 
        );
    }
    
   }
}

function change_opacity_of_slider_div_main_view(){
    for(var i = 0 ; i < number_of_winners_from_server() ; i++ ){
        // af("#"+setOcapity+i).attr('style','opacity:1');
        jQuery("#"+setOcapity+i).attr('style','opacity:1');
    }
}

function append_winners(){
    
    // String value with px
    var size_text = String(Math.round((sizeOfComponent/4)))+"px";
    
    jQuery("#main_buttons").attr('style',"position:relative;");
    jQuery(".count_wins").empty();
    jQuery(".count_wins").append("<span>Total Beans awarded: "+totalWin+"</span>");
  
    console.log("this is size of text " + size_text);
    
   
   jQuery("#slider_components").empty();
    jQuery("#slider1_container").attr('style',"position:relative;"+"width:"+Math.floor(getWindowWidth())+"px; height:"+Math.floor((getWindowWidth()/10+50+20))+"px;"+"overflow: hidden;");
     jQuery("#slider_components").attr('style',"position:relative;"+"width:"+Math.floor(getWindowWidth())+"px; height:"+Math.floor((getWindowWidth()/10)+50+20)+"px;"+"overflow: hidden;");
     bindFooterListener();
  
   for (var i = 0 ; i < number_of_winners_from_server() ; i++)
   {
       if(i === number_of_winners_from_server() - 1){
            currentSliderId = slider1_container;
            setOcapity = "main_slider_div";
            var id_of_last_child = number_of_winners_from_server() - 1;
            jQuery("#slider_components").append(
            "<div id='main_slider_div"+id_of_last_child+"' style='opacity:0' class='slider_div'>" +
              "<img class='slider_image' alt='logo' onload='initSlider()' src='"+winners[i].sponsorlogourl+"' style='position: relative; left: 0px; top: 0px; width:"+Math.floor(getWindowWidth()/8)+"px; height:"+Math.floor(getWindowWidth()/8)+"px;' />" +
                    "<h3 class='slider_h3' style='position:relative; left: 0px; top: 0px;  text-overflow: ellipsis;white-space:nowrap;overflow:hidden;'>"+winners[i].username+"</h3>" +
                    // "<h3 class='slider_h3' style='position:relative; left: 0px; top: 0px;  text-overflow: ellipsis;white-space:nowrap; overflow:hidden;'>"+"won at"+"</h3>" +
                    "<h3 class='slider_h3' style='position:relative; left: 0px; top: 0px;  text-overflow: ellipsis;white-space:nowrap; overflow:hidden;'>"+winners[i].appname+"</h3>" +
                "</div>" 
            );
       }
       else {   
            jQuery("#slider_components").append(
            "<div class='slider_div' id='main_slider_div"+i+"' style='opacity:0' class='slider_div'>" +
              "<img class='slider_image' alt='logo' src='"+winners[i].sponsorlogourl+"' style='position: relative; left: 0px; top: 0px; width:"+Math.floor(getWindowWidth()/8)+"px; height:"+Math.floor(getWindowWidth()/8)+"px;' />" +
                    "<h3 class='slider_h3' style='position:relative; left: 0px; top: 0px; text-overflow: ellipsis;white-space:nowrap;overflow:hidden;'>"+winners[i].username+"</h3>" +
                    // "<h3 class='slider_h3' style='position:relative; left: 0px; top: 0px; text-overflow: ellipsis;white-space:nowrap;overflow:hidden;'>"+"won at"+"</h3>" +
                    "<h3 class='slider_h3' style='position:relative; left: 0px; top: 0px; text-overflow: ellipsis;white-space:nowrap;overflow:hidden;'>"+winners[i].appname+"</h3>" +
            "</div>" 
            );
        }
   }
}

// get Width of mybeans panel
function getWidth(){
    return document.getElementById("mybeans_panel").offsetWidth;
}
function getWindowWidth(){
    
    //return window.innerWidth;
    return jQuery('#app').width();
}

function getWindowHeight(){
    
    //return window.innerHeight;
    return jQuery('#app').height();
}

// value from 1 to 100
function getPercentagesWidth(percentages){
    return Math.round(window.innerWidth*percentages/100);   
}

// get Height of mybeans panel
function getHeight(){
    return document.getElementById("mybeans_panel").offsetHeight;
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
