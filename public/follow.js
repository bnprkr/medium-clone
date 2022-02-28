const followButton = document.querySelector("button.follow-button");

followButton.addEventListener("click", async (event) => {
  console.log(event.target.classList);

  const followId = event.target.id;
  console.log(followId);

  try {
    const res = await fetch(`http://localhost:8080/api/users/${followId}/follow`, {
      method: 'GET',
    });

    console.log(res);

    const { following } = await res.json();

    console.log(following);

    if (following) {
      // delete follow
      // change classes

      console.log(followId);

      const deleteFollow = await fetch(`http://localhost:8080/api/users/${followId}/follow`, {
        method: 'DELETE'
      });

      if (deleteFollow.ok) {
        event.target.classList.remove("following");
        event.target.classList.add("not-following");
      } else {
        // error handle delete follow failed?
        console.log(deleteFollow);
      }
    } else {

      const addFollow = await fetch(`http://localhost:8080/api/users/${followId}/follow`, {
        method: 'POST'
      });

      if (addFollow.ok) {
        event.target.classList.remove("not-following");
        event.target.classList.add("following");
      } else {
        // error handle add follow failed?
        console.log(addFollow);
      }

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