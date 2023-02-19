$(document).ready(function() {

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
    // $("#submit").click(function(){
    //     var newEvent={
    //         title : $("#form_name").val(),
    //         start :$("#startDate").val(),
    //         end : $("#endDate").val()
    //     }
    //     console.log(newEvent)
    //     calendar.addEvent(newEvent)
        
    // })
        // var fileInput = $('#photoUpload')[0];
        // var file = fileInput.files[0];
        // // Create a FileReader to read the file
        // var reader = new FileReader();
        // reader.onload = function(e) {
        // // Create an image element with the uploaded photo
        // var image = $('<img>', {
        //     src: e.target.result,
        //     class: 'img-fluid',
        //     style: 'max-width: 100%; max-height: 100%;'

        //     });
        //     // Add the image to the photo gallery
        //     $('#photoGallery').append($('<div>', {class: 'col-md-4'}).append(image));
        // };
        // reader.readAsDataURL(file);

});