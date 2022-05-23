const likeButton = document.querySelector("i.like-button");

likeButton.addEventListener("click", async (event) => {
  console.log(event.target.classList);

  const storyId = window.location.href.split('/')[5];
  console.log(window.location.href);
  console.log(storyId);

  const likes = document.querySelector(".story-likes > span");

  try {
    // const res = await fetch(`http://localhost:8080/api/stories/${storyId}/like`, {
    //   method: 'POST',
    // });

    const res = await fetch(`http://localhost:8080/api/stories/${storyId}/like`, {
      method: 'GET',
    });

    const { liked } = await res.json();

    console.log(liked);

    if (liked) {
      // if liked delete like
      const deleteLike = await fetch(`http://localhost:8080/api/stories/${storyId}/like`, {
        method: 'DELETE',
      });

      if (deleteLike) {
        event.target.classList.remove("liked");
        likes.innerHTML = parseInt(likes.innerHTML) - 1;
      } else {
        // error handle failed like delete?
      }

    } else {
      const addLike = await fetch(`http://localhost:8080/api/stories/${storyId}/like`, {
        method: 'POST',
      });

      if (addLike) {
        event.target.classList.add("liked");
        likes.innerHTML = parseInt(likes.innerHTML) + 1;
      }
    }

  } catch (e) {
    console.log(e);
  }
});