const loadSubscriptionContent = async (user) => {
const token = user ? await netlifyIdentity.currentUser().jwt(true) : false;

['free', 'pro', 'premium'].forEach((type) => {
fetch('/.netlify/functions/get-protected-content', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ type }),
})
  .then((res) => res.json())
  .then((data) => {
    const photos = data.src;
    console.log(data);
    const template = document.querySelector('#content');
    const container = document.querySelector(`.${type}`);

    // remove any existing content from the content containers
    const oldContent = container.querySelector('.content-display');
    if (oldContent) {
      container.removeChild(oldContent);
    }

    const content = template.content.cloneNode(true);

    const img = content.querySelector('img');
    img.src = data.src;
    img.alt = data.alt;

    const credit = content.querySelector('.credit');
    credit.href = data.creditLink;
    credit.innerText = `Credit: ${data.credit}`;

    const caption = content.querySelector('figcaption');
    caption.innerText = data.message;
    caption.appendChild(credit);

    container.appendChild(content);
  });
});
};

const handleUserStateChange = (user) => {
updateUserInfo(user);
loadSubscriptionContent(user);
};

netlifyIdentity.on('init', handleUserStateChange);
netlifyIdentity.on('login', handleUserStateChange);
netlifyIdentity.on('logout', handleUserStateChange);
}