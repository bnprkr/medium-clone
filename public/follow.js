const followButtons = document.querySelectorAll("button.follow-button");

followButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    const followId = event.target.parentNode.parentNode.id;
  
    try {
      const res = await fetch(`http://localhost:8080/api/users/${followId}/follow`, {
        method: 'GET',
      });
  
      const { following } = await res.json();
  
      if (following) {
        // if following delete follow
        const deleteFollow = await fetch(`http://localhost:8080/api/users/${followId}/follow`, {
          method: 'DELETE'
        });
  
        if (deleteFollow.ok) {
          event.target.classList.remove("following");
          event.target.classList.add("not-following");
          event.target.textContent = "Follow";

          // move node to not following container
          const followNode = event.target.parentNode.parentNode;
          const notFollowing = document.querySelector(".not-following-box-container");
          notFollowing.prepend(followNode);
  
        } else {
          // error handle delete follow failed?
          console.log(deleteFollow);
        }
      } else {
        // if not following add follow
        const addFollow = await fetch(`http://localhost:8080/api/users/${followId}/follow`, {
          method: 'POST'
        });
  
        if (addFollow.ok) {
          event.target.classList.remove("not-following");
          event.target.classList.add("following");
          event.target.textContent = "Unfollow";

          // move node to following container
          const followNode = event.target.parentNode.parentNode;
          const following = document.querySelector(".following-box-container");
          following.prepend(followNode);
  
        } else {
          // error handle add follow failed?
          console.log(addFollow);
        }
  
      }
  
    } catch (e) {
      console.log(e);
    }
  
  });
});
