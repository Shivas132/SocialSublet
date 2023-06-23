

$(document).ready(function() {
    $("#submit").click(function(){
        email  =   $("#email").val();
        password  =   $("#password").val();
        $.ajax({
          method: "POST",
          url: "/RegiserToHome",
          data: { UserEmail: email, UserPassword: password },
          success: function(response){
            //if request if made successfully then the response represent the data
            if(response){
              localStorage.setItem("email", email);
              window.location.href = "/Home.html";
            }
            else{
              alert("Email invalid or allready exist ");
            }
        }
        });
        
    })
  });
  