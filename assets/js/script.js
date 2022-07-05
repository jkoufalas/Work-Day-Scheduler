
var workItemList = $("#workList");
var today  = moment(); 
var curDate = today.format("dddd, DD MMMM");
$("#currentDay").text(curDate);

var schedule = []; 



function init(){
    schedule = [];
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
        $('#notification').hide();
    }
    processEventTime();
}

function processEventTime(){
    var curTime  = moment().format('H'); 
    console.log("---- "+curTime);

    for(var i=9;i<=17;i++){
        if(i<curTime){
            $('#hour-'+i).children('TEXTAREA').addClass('past');
        }
        else if(i === curTime){
            $('#hour-'+i).children('TEXTAREA').addClass('present');
        }else{
            $('#hour-'+i).children('TEXTAREA').addClass('future');
        }
    }


}


function saveWorkFromButton(event){
    console.log("Got Here Button");
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
    console.log(schedule);
    localStorage.setItem("scheduler", JSON.stringify(schedule));
    $('#notification').show();
    hideNotification();

}

function hideNotification() {
    var counter = 0;
    var notificationInterval = setInterval(function() {
        counter++;
        if(counter === 10){
            $('#notification').hide();
            clearInterval(notificationInterval);
        }
    }, 100);
  }

workItemList.on("click", ".fas", saveWorkFromIcon);
workItemList.on("click", ".saveBtn", saveWorkFromButton);
init();