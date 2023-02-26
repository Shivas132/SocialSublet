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
    var $cardStartDate = $("<h2>", { text: card.start });
    var $cardEndDate = $("<h2>", { text: card.end });
    var $cardDeleteButton = $("<button >", {id:"delete" ,  text: "delete" , "data-card-index": index_card });
    var $index = $("<p>", { text: index_card });
    index_card = index_card+1;

    
    $card.append($index,$cardTitle, $cardDescription , $cardStartDate, $cardEndDate , $cardDeleteButton);
    $cardsContainer.append($card);
    
  });


  // Handle click event for card buttons
  $(document).on("click", "#delete", function () {
    const cardIndex = $(this).data("card-index");
    const card = userEvents[cardIndex];
    handleCardClick(card);
  });

  // Function to handle card click
  function handleCardClick(card) {
    email = localStorage.getItem("email");
    console.log(card);
    $.ajax({
      method: "POST",
      url: "/deleteEvent",
      data: { email:email , startDate: card.start, endDate: card.end },
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
  }
});

