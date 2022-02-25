const likeButton = document.querySelector("button.like-button");

likeButton.addEventListener("click", async (event) => {
  console.log(event.target.classList);

  const storyId = window.location.href.split('/')[5];
  console.log(window.location.href);
  console.log(storyId);

  const likes = document.querySelector(".story-likes > span");
  const numLikes = parseInt(likes.innerHTML);

  try {
    const res = await fetch(`http://localhost:8080/api/stories/${storyId}/like`, {
      method: 'POST',
    });

    if (res.ok) {
      likes.innerHTML = numLikes + 1;
      event.target.classList.add("liked");
    }

  } catch (e) {
    console.log(e);
  }


  // if liked:
  // delete like
  // remove liked from class list

  // if not liked:
  // add like
  // add liked to class list

  // don't trust class list as can be altered by user!

  // get liked status.. 




});