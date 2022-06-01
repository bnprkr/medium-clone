// get add comment button
// add click listener
// on click get comment text
// if not empty create comment in db with current user and comment text
// create html of comment and prepend to comments-list
// make sure comments are displayed in reverse chronological order..


const addCommentButton = document.querySelector(".comment-submit>input");

addCommentButton.addEventListener('click', async (event) => {
  // get comment text
  const textRaw = document.querySelector(".comment-form .comment-text>textarea").value;

  if (textRaw) {
    const textParas = textRaw.split('\n');
    let textFinal = '';

    textParas.forEach(para => {
      if (para) {
        textFinal += `
          <p>${para}</p>
        `;
      }
    });

    // add comment to db
    // create api route for this..

    // create comment container
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment-box");
    // create author container, add author, add to comment container
    const authorDiv = document.createElement("div");
    authorDiv.classList.add("comment-author");
    const author = document.createTextNode(`${username}`);
    authorDiv.appendChild(author);
    commentDiv.appendChild(authorDiv);
    // create comment text container, add each paragraph
    const commentTextDiv = document.createElement("div");
    commentTextDiv.classList.add("comment-text");

    textRaw.split('\n').forEach(para => {
      const element = document.createElement("p");
      const text = document.createTextNode(`${para}`);
      element.appendChild(text);
      commentTextDiv.appendChild(element);
    })

    commentDiv.appendChild(commentTextDiv);

    // prepend new comment to list
    const commentsList = document.querySelector(".comments>.comments-list");
    commentsList.prepend(commentDiv);
  }
});


const likeButton = document.querySelector("i.like-button");

likeButton.addEventListener("click", async (event) => {

  const storyId = window.location.href.split('/')[5];

  const likes = document.querySelector(".story-likes > span");

  try {
    const res = await fetch(`http://localhost:8080/api/stories/${storyId}/like`, {
      method: 'GET',
    });

    const { liked } = await res.json();

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