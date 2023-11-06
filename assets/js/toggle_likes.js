class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike()
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data){
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount,data.data.deleted);
                if(data.data.deleted == true){
                    likesCount -= 1;
                }
                else{
                    likesCount += 1;
                }


                $(self).attr('data-likes', likesCount)
                $(self).html(`${likesCount} Likes`)
            })
            .fail(function(error){
                console.log("Error in the request")
            })
        })
    }
}