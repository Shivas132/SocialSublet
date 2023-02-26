$(document).ready(function(){
    
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
                console.log(window.location); 
                window.location.href = "/UserEvent.html";
              }
              else{
                alert("Wrong password or email");
              }
              
          }
          });
    });
    });
    
    