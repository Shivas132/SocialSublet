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
      fixedWeekCount: false,
      initialView: 'dayGridMonth',
      events : serverEvents,
    eventClick: function(info) {
         info.jsEvent.preventDefault(); // don't let the browser navigate
         console.log(info.event)
         $("#collapseInfo").collapse('hide')
         setTimeout(() => {
          $("#cardAddress").html(info.event.extendedProps.address)
          $("#cardName").html(info.event.extendedProps.hosts_name)
          $("#cardPhone").html(info.event.extendedProps.phone)
          $("#cardEmail").html(info.event.extendedProps.email)
          $("#cardDate").html(changeDateFormat(info.event.start)+" - "+changeDateFormat(info.event.end))
          $("#cardInfo").html(info.event.extendedProps.messege)
           
         }, 200);
         setTimeout(() => { $("#collapseInfo").collapse('show') }, 500);
         }
    });
    calendar.render();
    // $("#collapseInfo").collapse('show')
    $("#myform").submit(function(){
    // $("#submit").click(function(){
        form_name =  $("#form_name").val()
        start_date = $("#startDate").val()
        end_date =  $("#endDate").val()
        form_phone= $("#phone").val()
        form_messege=  $("#form_message").val()
        form_address = $("#form_address").val()
        console.log(form_address)
        var subletData = {
                address : form_address,
                title : form_name + '\'s place',
                start : start_date,
                end : end_date,
                phone: form_phone,
                hosts_name: form_name,
                messege: form_messege, 
                email: localStorage.getItem('email'),
                backgroundColor : getRandomColor()
        }        
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
  
  function changeDateFormat(dateObj){
    day = dateObj.getDay()
    month = dateObj.getMonth()
    year = dateObj.getFullYear()
    return day+"/"+month+"/"+year
  }


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


  $('.carousel').carousel({
    interval: false,
  });