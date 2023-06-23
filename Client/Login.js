

$(document).ready(function() {
 
  $("#submit").click(function(){
      email  =   $("#email").val();
      password  =   $("#password").val();
      console.log(email , password);
      $.ajax({
        method: "POST",
        url: "/Home",
        data: { UserEmail: email, UserPassword: password },
        success: function(response){
          //if request if made successfully then the response represent the data
          if(response){
            console.log(window.location); 
            localStorage.setItem("email", email);
            window.location.href = "/Home.html";
          }
          else{
            alert("Wrong password or email");
          }
          

      }
      });
      
  })
});


