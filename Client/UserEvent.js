$(document).ready( async function(){
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
  if (userEvents.length == 0){
    $cardsContainer.html("<h3>you have no sublets ongoing...</h3>")
  }
  else{
  userEvents.forEach(card => {
    var $card = $("<div>", { class: "card p-4" });
    var $cardTitle = $("<h2>", { text: card.title });
    var $cardDescription = $("<p>", { text: card.messege });
    var $cardDate = $("<h2>", { text: changeDateFormat(card.start) +" - " + changeDateFormat(card.end) });

    var $cardDeleteButton = $("<button >", {id:"delete" ,  text: "delete" , "data-card-index": index_card });
    index_card = index_card+1;

    
    $card.append($cardTitle, $cardDescription , $cardDate , $cardDeleteButton);
    $cardsContainer.append($card);
  
  });
}


  // Handle click event for card buttons
  $(document).on("click", "#delete", function () {
    $(this).prop('disabled', true);
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
          alert("deleted!")
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
  console.log("Itai = ",dateObj)
  dateObj = new Date(dateObj)
  console.log("Itai = ",dateObj)

  console.log(dateObj)
  day = dateObj.getDate()
  month = dateObj.getMonth() +1
  year = dateObj.getFullYear()
  return day+"/"+month+"/"+year
}

