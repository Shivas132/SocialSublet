$(document).ready( async function(){
  console.log("helllo");
  email = localStorage.getItem("email");
$("#Useremail").html(email)
  userEvents=[];



await $.post('/getUserEvents', {email:email},function(data) {
  userEvents = data
    }).fail(function(xhr, status, error) {
  console.error('Failed to get events from server error:', error);
});

  console.log("user events = "  ,userEvents); 
  index_card = 0;
  var $cardsContainer = $("#Events");
  userEvents.forEach(card => {
    console.log("element = " , card);
    var $card = $("<div>", { class: "card" });
    var $cardTitle = $("<h2>", { text: card.title });
    var $cardDescription = $("<p>", { text: card.messege });
    var $cardDate = $("<h2>", { text: changeDateFormat(card.start) +" - " + changeDateFormat(card.end) });

    var $cardDeleteButton = $("<button >", {id:"delete" ,  text: "delete" , "data-card-index": index_card });
    // var $index = $("<p>", { text: index_card });
    index_card = index_card+1;

    
    $card.append($cardTitle, $cardDescription , $cardDate , $cardDeleteButton);
    $cardsContainer.append($card);
    
  });


  // Handle click event for card buttons
  $(document).on("click", "#delete", function () {
    const cardIndex = $(this).data("card-index");
    const card = userEvents[cardIndex];
    email = localStorage.getItem("email");
    $.ajax({
      method: "POST",
      url: "/deleteEvent",
      data: { id : card.id },
      success: function(response){
        //if request if made successfully then the response represent the data
        if(response){
          location.reload();
        }
        else{
          alert("delete failed , reload and try again");
        }
    }
    });
  });
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
});

function changeDateFormat(dateObj){
  dateObj = new Date(dateObj)
  day = dateObj.getDate()
  month = dateObj.getMonth() +1
  year = dateObj.getFullYear()
  return day+"/"+month+"/"+year
}

