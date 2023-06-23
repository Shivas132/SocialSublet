$(document).ready(async function() {
    var serverEvents = NaN
    await $.get('/getEvents', function(data) {
        serverEvents = data
        // console.log("serverEvents -- > " ,serverEvents)
          }).fail(function(xhr, status, error) {
        // console.error('Failed to get events from server error:', error);
        alert('Failed to get events from server error:', error);
      });
    var calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
      fixedWeekCount: false,
      initialView: 'dayGridMonth',
      events : serverEvents,
      aspectRatio: setRatio(),

    eventClick: function(info) {
         info.jsEvent.preventDefault();
         gallery = $("#gallery");
         gallery.html("");
         collapseAll()         
         counter = 0;
         setTimeout(() => {
          $("#cardAddress").html(info.event.extendedProps.address)
          $("#cardName").html(info.event.extendedProps.hosts_name)
          $("#cardPhone").html(info.event.extendedProps.phone)
          $("#cardEmail").html(info.event.extendedProps.email)
          $("#cardDate").html(changeDateFormat(info.event.start)+" - "+changeDateFormat(info.event.end))
          $("#cardInfo").html(info.event.extendedProps.messege)
          info.event.extendedProps.imagesArray.forEach((image ) => {
            if(counter == 0){
              gallery.append("<div class=\"carousel-item active\"> <img id=\"img_gallery\" class=\"d-block w-100\" src= \"" + image.img_url + "\"> </div>");
              counter++;
            }
            else {
              gallery.append("<div class=\"carousel-item \"> <img id=\"img_gallery\" class=\"d-block w-100\" src= \"" + image.img_url+ "\" alt = \"apparment images\"> </div>");
            }

          });
          if(counter==0){gallery.hide()}
          else{gallery.show()}
        }, 500);
        setTimeout(() => { $("#collapseInfo").collapse('show') }, 400);
        window.scrollTo(0, 0);
        }
    });
    calendar.render();

    $("#myform").submit(async function(e)    
    {
      e.preventDefault()
      var input = $('#file')[0];
      var files = input.files;
      counter = 0;
      const formData = new FormData();
      Array.from(files).forEach(function(file) {       
        formData.append('user-file' + counter, file, 'user-file'+ counter+'.jpg')
        counter=counter+1;
      });
        form_name =  $("#form_name").val()
        start_date = $("#startDate").val()
        end_date =  $("#endDate").val()
        form_phone= $("#phone").val()
        form_messege=  $("#form_message").val()
        form_address = $("#form_address").val()


        current_date = new Date();
        startDateChecker = new Date(start_date)
        endDateChecker = new Date(end_date)
        if(startDateChecker.getTime() >= endDateChecker.getTime()){
          alert("start date cant be equal or after the end date")
          return
        }
        if(startDateChecker.getTime() < current_date.getTime()){
          alert("start date cant be before today")
          return
        }

        formData.append('address', form_address)
        formData.append('title', form_name + '\'s place')
        formData.append('start', start_date)
        formData.append('end',end_date)
        formData.append('phone',form_phone)
        formData.append('hosts_name',form_name)
        formData.append('messege',form_messege)
        formData.append('email',localStorage.getItem('email'))
        formData.append('backgroundColor', getRandomColor())
        
        fetch("/addEvent", {
            method : "POST",
            body : formData
        })
        .then((data)=> console.log(data))
        .then(collapseAll())
        .then($("#added").collapse('show'))
        .then(setTimeout(() => {location.reload();}, 1500))
      })

      $(function() {
        $( "#startDate" ).datepicker({
            dateFormat: "yy-mm-dd"
        });
     });
      $(function() {
          $("#endDate" ).datepicker({
              dateFormat: "yy-mm-dd"
          });
      });   
      $("#userEvents").click(function(){
        email = localStorage.getItem("email");
        console.log("email = " ,email);
        $.ajax({
            method: "POST",
            url: "/getUserProfile",
            data: { email: email},
            success: function(response){
              //if request if made successfully then the response represent the data
              if(response){
                window.open("/UserEvent.html",'_blank');
              }
              else{
                alert("Wrong password or email");
              }   
          }
          });
    });
  });
  
  function showAdded(){
    $("#added").collapse('show')
  }
  // function changeDateFormat(dateObj){
  //   day = dateObj.getDate()
  //   month = dateObj.getMonth() +1
  //   year = dateObj.getFullYear()
  //   return day+"/"+month+"/"+year
  // }


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

  function setRatio(){
    if (window.mobileCheck()){
      return 1
    }
    else{
      return 1.5
    }
  }

  window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };