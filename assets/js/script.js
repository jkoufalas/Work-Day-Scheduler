
var workItemList = $("#workList");
var today  = moment(); 
var curDate = today.format("dddd, DD MMMM");
$("#currentDay").text(curDate);

var schedule = []; 
var curEventList = [];



function init(){
    schedule = [];
    curEventList = [];
    var localSchedule = JSON.parse(localStorage.getItem("scheduler"));
    if(localSchedule == undefined){
        for(var i=9;i<=17;i++){
            var sheduleItem = {
                hour: "hour-"+i,
                conent: ""
            }
            schedule.push(sheduleItem);
        }
    }else{
        //loop through high scores parsed from loacl storage
        for (var currentSchedule in localSchedule) {
            //create object from each parsed input
            content = localSchedule[currentSchedule].content;
            hour = localSchedule[currentSchedule].hour;
            if(content == undefined){
                content = '';
            }
            var sceduleElement = {
                hour: hour,
                content: content
            }
            //add that to the high score array
            schedule.push(sceduleElement);
            $('#'+hour).children('TEXTAREA').text(content);
        }
        
    }
    $('#notification').hide();
    processEventTime();
    timerEventProcess();
}

function timerEventProcess(){
    var reprocessEventInterval = setInterval(function() {
        var curTime  = moment().format('H'); 
        for(var i=9;i<=17;i++){
            if(curEventList[i-9] == "past"){
                $('#hour-'+i).children('TEXTAREA').removeClass('past');
            }
            else if(curEventList[i-9] == "future"){
                $('#hour-'+i).children('TEXTAREA').removeClass('future');
            }else{
                $('#hour-'+i).children('TEXTAREA').removeClass('present');
            }
        }
        curEventList = [];
        for(var i=9;i<=17;i++){
            if(i<curTime){
                $('#hour-'+i).children('TEXTAREA').addClass('past');
                curEventList.push("past");
            }
            else if(i > curTime){
                $('#hour-'+i).children('TEXTAREA').addClass('future');
                curEventList.push("future");
            }else{
                $('#hour-'+i).children('TEXTAREA').addClass('present');
                curEventList.push("present");
            }
        }
    }, 60000);
}

function processEventTime(){
    var curTime  = moment().format('H'); 
    for(var i=9;i<=17;i++){
        if(i<curTime){
            $('#hour-'+i).children('TEXTAREA').addClass('past');
            curEventList.push("past");
        }
        else if(i > curTime){
            $('#hour-'+i).children('TEXTAREA').addClass('future');
            curEventList.push("future");
        }else{
            $('#hour-'+i).children('TEXTAREA').addClass('present');
            curEventList.push("present");
        }
    }


}


function saveWorkFromButton(event){
    var btnClicked = $(event.target);
    var label = btnClicked.parent();
    processSave(btnClicked, label);
}

function saveWorkFromIcon(event){
    event.stopPropagation();
    var btnClicked = $(event.target);
    var label = btnClicked.parent().parent();
    processSave(btnClicked, label);
}

function processSave(btnClicked, label){
    var outputLine = label.children('TEXTAREA').val();
    var attrName = label.attr('id');
    for(var i=9;i<=17;i++){
        if(attrName == "hour-"+i){
            var sheduleItem = {
                hour: attrName,
                content: outputLine
            }
            //i-9 to align time with 0 index of array as time starts at 9
            schedule[i-9] = sheduleItem;

        }
    }
    localStorage.setItem("scheduler", JSON.stringify(schedule));
    hideNotification();

}

function hideNotification() {
    var counter = 0;
    var notificationInterval = setInterval(function() {
        counter++;
        if(counter === 5){
            $('#notification').show();
        }
        if(counter === 20){
            $('#notification').hide();
            clearInterval(notificationInterval);
        }
    }, 100);
  }

workItemList.on("click", ".fas", saveWorkFromIcon);
workItemList.on("click", ".saveBtn", saveWorkFromButton);
init();