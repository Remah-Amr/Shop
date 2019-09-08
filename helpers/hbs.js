module.exports = {
    // no products go to /admin/products even products belong to user  , but more security if attaker write url to acces i prevent anyone to acces these buttons 
    editAndDelete: function(userId,loggedUserId,productId,csrfToken){
        // console.log(userId,loggedUserId,productId);
        if(userId.toString() === loggedUserId.toString()){ // when compare between to ids must conver to String
            return `<a href="/admin/edit-product/${productId}?edit=true" class="btn">Edit</a>
            <form action="/admin/delete-product" method="POST">
            <button type="submit"  class="btn">Delete</button>
            <input type="hidden" name="productId" value="${productId}"> 
            <input type="hidden" value='${csrfToken}' name='_csrf'>
            </form>`;
        }
        return '';
    }
}