$(document).ready(async function() {
    var serverEvents = NaN
    await $.get('/getEvents', function(data) {
        serverEvents = data
        console.log(serverEvents)

          }).fail(function(xhr, status, error) {
        console.error('Failed to get events from server error:', error);
      });
    var calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events : serverEvents,
    eventClick: function(info) {
         info.jsEvent.preventDefault(); // don't let the browser navigate
         console.log(info.event)
         $("#collapseInfo").collapse('hide')
         setTimeout(() => {    $("#infoInner").html(
            "<h4>name :"+info.event.extendedProps.hosts_name+"</h4><br>"+
            "<h4>phone :"+info.event.extendedProps.phone+"</h4><br>"+
            "<h4>more info :"+info.event.extendedProps.messege+"</h4><br>"+
            "<h4>email :"+info.event.extendedProps.email+"</h4><br>" 
 
         ) }, 200);
         setTimeout(() => { $("#collapseInfo").collapse('show') }, 500);
         }
    });
    calendar.render();
    $("#collapseInfo").collapse('show')
    $("#myform").submit(function(){
    // $("#submit").click(function(){
        form_name =  $("#form_name").val()
        start_date = $("#startDate").val()
        end_date =  $("#endDate").val()
        form_phone= $("#phone").val()
        form_messege=  $("#form_message").val()
        var subletData = {
                title : form_name + '\'s place',
                start : start_date,
                end : end_date,
                phone: form_phone,
                hosts_name: form_name,
                messege: form_messege, 
                email: localStorage.getItem('email'),
                backgroundColor : getRandomColor()
        }        
        console.log(subletData.eventColor)
        console.log( JSON.stringify(subletData))
        $.ajax({
            method: "POST",
            url: "/addEvent",
            data: JSON.stringify(subletData),
            contentType: "application/json; charset=utf-8",
            success: function(response){
                console.log(response); 
            },
            error: function (err) {
                alert("x")
         }
        });
        console.log(subletData)
        calendar.addEvent(subletData)    
        $('#myform')[0].reset();
        $('#added').collapse('show')
        
    })    
  });

  function collapseAll(){
    $('.collapse').collapse('hide')
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }