(function($) {

    var alertErrorDiv = $("#error-message-comments");

    //Comment
    $("#new-comment-form").submit(function(event) {
        event.preventDefault();

        var newComment = $("#comment").val();
        var newPhotoId = $("#photoId").val();
        
        if (newComment && newPhotoId) {
            var createComment = {
                method: "POST",
                url: "/api/comment",
                contentType: 'application/json',
                data: JSON.stringify({
                    comment: newComment,
                    photoId: newPhotoId
                })
            };
            
            $.ajax(createComment).then(function(responseMessage) {
                if(responseMessage){

                    alertErrorDiv.html('<div class=\"alert alert-success\" role=\"alert\">Successfuly commented</div>');
                    updateCommentList(newPhotoId);
                }
            }, function(responseError){
                //alert("Error in comment");
                alertErrorDiv.html('<div class=\"alert alert-danger\" role=\"alert\">Error while commenting</div>');
            });
        }else{
            //alert("missing newComment and newPhotoId");
            alertErrorDiv.html('<div class=\"alert alert-danger\" role=\"alert\">Empty comment</div>');
        }
    });

    function updateCommentList(photoId){
        var CommentList = document.getElementById('comment-list');
        jQuery(CommentList).html('');
        $(CommentList).empty();

        var allComReq = {
            method: "GET",
            url: "/api/comment?id="+photoId,
            contentType: 'application/json'
        };
        //alert("photoId = "+photoId);
        $.ajax(allComReq).then(function(responseT) {
            var li_item;
            //alert("responseT.trip_name = "+responseT.trip._id);
            $.each(responseT.trip.comments,function(i, item) {
                if(item.photoId == photoId){
                        li_item = document.createElement("li");
                        $(li_item).addClass('list-group-item');
                        li_item.innerHTML = "<span><strong>"
                                        + item.poster.firstName+"</strong><i>"
                                        + " says: </i>"
                                        + item.comment
                                        + "</span>";
                        CommentList.appendChild(li_item);
                }
            });
        });
    }

    //Refresh the page when the upload button is pressed
    $(document).on("click", ".upload-images-refresh", function(e){
        location.reload();
    });

    //Show Hide trips
    $(document).on("click", ".show-hide", function(e){
        //alert("bhlaa");
        var tid = $(this).data('shtId');
        //alert(tid);
    });


    //Update Caption
    $("#new-caption-form").submit(function(event) {
        event.preventDefault();

        var newCaption = $("#caption").val();
        var newPhotoId = $("#photoId").val();

        if (newCaption && newPhotoId) {
            var updateCaption = {
                method: "POST",
                url: "/api/caption",
                contentType: 'application/json',
                data: JSON.stringify({
                    caption: newCaption,
                    photoId: newPhotoId
                })
            };
            
            $.ajax(updateCaption).then(function(responseMessage) {
                if(responseMessage){
                    alertErrorDiv.html('<div class=\"alert alert-success\" role=\"alert\">Successfully updated caption</div>');
                    //updateCommentList(newPhotoId);
                    newCaption.val(responseMessage.updatedCaption);
                }
            }, function(responseError){
                alertErrorDiv.html('<div class=\"alert alert-danger\" role=\"alert\">Error while updating caption</div>');
            });
        }else{
            //alert("missing newComment and newPhotoId");
            alertErrorDiv.html('<div class=\"alert alert-danger\" role=\"alert\">Empty caption</div>');
        }
    });

})(window.jQuery);
