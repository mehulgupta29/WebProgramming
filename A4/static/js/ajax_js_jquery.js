(function($) {

    var alertDiv = $('div#alert-div');
    var movieHeader = $('h3#movie-header');

    function updateAllMoviesList(){
        var MoviesList = document.getElementById('movies-list');
        jQuery(MoviesList).html('');
        $(MoviesList).empty();
        var allMovReq = {
            method: "GET",
            url: "/api/movies",
            contentType: 'application/json'
        };

        $.ajax(allMovReq).then(function(responseMessage) {
            var li_item;
            movieHeader.html("All Movies");
            $.each(responseMessage,function(i, item) {
                li_item = document.createElement("li");
                $(li_item).addClass('list-group-item');
                li_item.innerHTML = "<h3 class=\"movie-type\" data-movietype=\"allMovies\"><strong>"
                                    + item.title+"</strong></h3>"
                                    + "<br/>"+ "Ratings: <span><label for=\"dec-"+item._id+"\" class=\"sr-only\">decrement</label><button id=\"dec-"+item._id+"\" data-id=\""+item._id+"\" data-title=\""+item.title+"\" class=\"dec \"><span class=\"glyphicon glyphicon-minus\"></span></button> &nbsp;&nbsp; <span class=\""+item._id+"\" data-rating=\""+item.rating+"\" data-id=\""+item._id+"\">"
                                    + item.rating+"</span> &nbsp;&nbsp; <label for=\"inc-"+item._id+"\" class=\"sr-only\">increment</label><button id=\"inc-"+item._id+"\" data-id=\""+item._id+"\" data-title=\""+item.title+"\" class=\"inc \"> <span class=\"glyphicon glyphicon-plus\"></span> </button>"
                                    + "<label for=\"del-"+item._id+"\" class=\"sr-only\">delete</label><button id=\"del-"+item._id+"\" class=\"del pull-right\" data-id=\""+item._id+"\">Delete</button>"+"</span>";
                MoviesList.appendChild(li_item);
            });
        });
    }

    function updateBestMoviesList(){
        var MoviesList = document.getElementById('movies-list');
        jQuery(MoviesList).html('');
        var popularMovReq = {
            method: "GET",
            url: "/api/movies/best",
            contentType: 'application/json'
        };

        $.ajax(popularMovReq).then(function(responseMessage) {
            var li_item;
            movieHeader.html("Best / Popular Movies");
            $.each(responseMessage,function(i, item) {
                li_item = document.createElement("li");
                $(li_item).addClass('list-group-item');
                li_item.innerHTML = "<h3 class=\"movie-type\" data-movietype=\"bestMovies\"><strong>"
                                    + item.title+"</strong></h3>"
                                    + "<br/>"+ "Ratings:  <span><label for=\"decc-"+item._id+"\" class=\"sr-only\">decrement</label><button id=\"decc-"+item._id+"\" data-id=\""+item._id+"\" data-title=\""+item.title+"\" class=\"dec \"><span class=\"glyphicon glyphicon-minus\"></span></button> &nbsp;&nbsp; <span class=\""+item._id+"\" data-rating=\""+item.rating+"\" data-id=\""+item._id+"\">"
                                    + item.rating+"</span> &nbsp;&nbsp; <label for=\"incc-"+item._id+"\"\" class=\"sr-only\">increment</label><button id=\"incc-"+item._id+"\" data-id=\""+item._id+"\" data-title=\""+item.title+"\" class=\"inc \"> <span class=\"glyphicon glyphicon-plus\"></span> </button>"
                                    + "<label for=\"dell-"+item._id+"\" class=\"sr-only\">delete</label><button id=\"dell-"+item._id+"\" class=\"del pull-right\" data-id=\""+item._id+"\">Delete</button>"+"</span>";
                
                MoviesList.appendChild(li_item);
            });
        });
    }

    updateAllMoviesList();

    $(document).on("click", "#best-movies-link", function(e){
        console.log('a best-movies-link clicked');
        alertDiv.html('<div class=\"alert alert-success\" role=\"alert\">Best Movies Link Clicked</div>');
        updateBestMoviesList();
    });

    $(document).on("click", "#all-movies-link", function(e){
        console.log('a all-movies-link clicked');
        alertDiv.html('<div class=\"alert alert-success\" role=\"alert\">All Movies Link Clicked</div>');
        updateAllMoviesList();
    });


    $("#new-movie-form").submit(function(event) {
        event.preventDefault();

        var newTitle = $("#new-movie-title").val();
        var newRating = $("#new-movie-rating").val();

        if (newTitle && newRating) {
            var createMovie = {
                method: "POST",
                url: "/api/movies",
                contentType: 'application/json',
                data: JSON.stringify({
                    title: newTitle,
                    rating: newRating
                })
            };
            
            $.ajax(createMovie).then(function(responseMessage) {
                if(responseMessage){
                    alertDiv.html('<div class=\"alert alert-success\" role=\"alert\">Movie Created</div>');
                    updateAllMoviesList();
                }
            }, function(responseError){
                alertDiv.html('<div class=\"alert alert-danger\" role=\"alert\">Error while Creating Movie</div>');
            });
        }else{
            alertDiv.html('<div class=\"alert alert-danger\" role=\"alert\">Error while Creating Movie</div>');
        }
    });


    $(document).on("click", ".del", function(e){
        console.log('button clicked -- ' + $(this).data('id'));

        var deleteMovie = {
            method: "DELETE",
            url: "/api/movies/" + $(this).data('id'),
            contentType: 'application/json'
        };

        $.ajax(deleteMovie).then(function(responseMessage) {
            var li_item;
            if(responseMessage){
                alertDiv.html('<div class=\"alert alert-success\" role=\"alert\">Movie Deleted</div>');
                var movieType = $("h3.movie-type").data('movietype');
                
                if(movieType === "allMovies"){
                    updateAllMoviesList();    
                }else if(movieType === "bestMovies"){
                    updateBestMoviesList();
                }
            }
        }, function(responseError){
            alertDiv.html('<div class=\"alert alert-danger\" role=\"alert\">Error while Deleting Movie</div>');
        });
    });

    $(document).on("click", ".dec", function(e){
        var id = $(this).data('id');
        var title = $(this).data('title');
        var rat = $("span."+id).data('rating');

        var decrementRating = {
            method: "PUT",
            url: "/api/movies/" + $(this).data('id'),
            contentType: 'application/json',
            data: JSON.stringify({
                title: title,
                rating: rat-1
            })
        };

        $.ajax(decrementRating).then(function(responseMovie) {
            if(responseMovie){
                $("span."+id).data('rating', responseMovie.rating);
                $("span."+id).html(responseMovie.rating);
                alertDiv.html('<div class=\"alert alert-success\" role=\"alert\">Rating Decremented</div>');
                
                var movieType = $("h3.movie-type").data('movietype');
                if(responseMovie.rating < 3 && movieType === "bestMovies"){
                   updateBestMoviesList(); 
                }
            }
        }, function(responseError){
            alertDiv.html('<div class=\"alert alert-danger\" role=\"alert\">You have provided an invalid rating</div>');
        });

    });



    $(document).on("click", ".inc", function(e){
        var id = $(this).data('id');
        var title = $(this).data('title');
        var rat = $("span."+id).data('rating');
        
        var incrementRating = {
            method: "PUT",
            url: "/api/movies/" + $(this).data('id'),
            contentType: 'application/json',
            data: JSON.stringify({
                title: title,
                rating: rat+1
            })
        };

        $.ajax(incrementRating).then(function(responseMovie) {
            if(responseMovie){
                $("span."+id).data('rating', responseMovie.rating);
                $("span."+id).html(responseMovie.rating);
                alertDiv.html('<div class=\"alert alert-success\" role=\"alert\">Rating Incremented</div>');
            }
        }, function(responseError){
            alertDiv.html('<div class=\"alert alert-danger\" role=\"alert\">You have provided an invalid rating</div>');
        });
    });

})(window.jQuery);
