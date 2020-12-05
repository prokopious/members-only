import Gallery from 'react-photo-gallery';

export default function page3() {


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

return (
  <>
  
  <Gallery images={photos} />
  
  </>
)

}
