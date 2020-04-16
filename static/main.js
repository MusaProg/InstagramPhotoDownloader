$(document).ready(function(){

    function wrongLink(){
        console.log("this one");
        var link = $("#inputURL");
        link.css({"backgroundColor": "#57273d"});
        setTimeout(function(){
            var link = $("#inputURL");
            link.css({"background": "white"});
        }, 1000);
    }
       
    function check(){
        var link = $("#inputURL").val();
        var re = /^.*instagram.com\/.+$/;
        if (!re.test(link)) return false;
        return true;
    }
    
    function submit(){
        if (!check())
        {
            wrongLink();
            return;
        }
        var link = $("#inputURL").val();
        $.ajax({
            url: '/get_image?link=' + link,
            type: 'GET',
            success: function (success) {
                if (success == "value_error")
                {
                    alert("Не удалось получить данные по данному url. Пожалуйста, проверьте его корректность.");
                }
                else if (success == "unknown_error")
                {
                    alert("Неизвестная ошибка. Данные не получены.");
                }
                else
                {
                    document.getElementById("_hide").style.display = "block";
                    document.getElementById("_block").style.display = "none";
                    document.getElementById("image").src = "data:image/JPG;base64," + success;
                }
            }
        });
    }
    
    $("#button").click(function(event){
        event.preventDefault();
        submit();
        });

    $("#_hide").click(function(event){
        document.getElementById("_hide").style.display = "none";
        document.getElementById("_block").style.display = "block";
        document.getElementById("image").src = "";
    });

    $("#downloadButton").click(function(event){
        event.preventDefault();
        event.stopPropagation();
        var link = document.createElement('a');
        link.href = document.getElementById("image").src;
        link.download = 'Download.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        $.ajax({
            url: '/download_confirmation',
            type: 'GET',
            success: function (success) {}
        });
        
    });
});