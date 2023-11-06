{let e=function(){let t=$("#new-post-form");t.submit(function(e){e.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:t.serialize(),success:function(e){var t=o(e.data.post);$("#posts-list-container>ul").prepend(t),s($(" .delete-post-button",t)),new PostComments(e.data.post._id),new ToggleLike($(" .toggle-like-button",t)),new Noty({theme:"relax",text:"Post published!",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){console.log(e.responseText)}})})},o=function(e){return $(`<li id="post-${e._id}">
                <p>
                    <!-- Here we are making sure that user is logged in and the user who is loggged in can see the delete button on his own posts only  -->
                    
                        <a class="delete-post-button"  href="/posts/destroy/${e._id}">Delete</a>
                    
                        ${e.content}
                        <br>
                        ${e.user.name}
                        <br>

                        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/id=${e._id}&type=Post" >
                            0 Likes
                        </a>
                </p>
            
                <div class="post-comments">
                
                        <form action="/comments/create" method="post">
                            <input type="text" name="comment" placeholder="Type your comments here.." required>
                            <input type="hidden" name="post" value="${e._id}">
                            <input type="submit" value="Add Comment">
                        </form>
                
            
                        <div class="post-comments-list">
                            <ul id="post-comments-${e.id}">
                                
                            </ul>
                        </div>
            
                </div>
            </li>
        `)},s=function(t){$(t).click(function(e){e.preventDefault(),$.ajax({type:"get",url:$(t).prop("href"),success:function(e){$("#post-"+e.data.post_id).remove(),new Noty({theme:"relax",text:"Post Deleted",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){console.log(e.responseText)}})})},t=function(){$("#posts-list-container>ul>li").each(function(){var e=$(this),t=$(" .delete-post-button",e),t=(s(t),e.prop("id").split("-")[1]);new PostComments(t)})};e(),t()}