import Head from 'next/head';
import React from 'react';

export default function Test() {




    if (process.browser) {
          const button1 = document.getElementById('left');
  const button2 = document.getElementById('right');

  button1.innerText = "sdfdfs";

  const login = () => netlifyIdentity.open('login');
  const signup = () => netlifyIdentity.open('signup');

  // by default, we want to add login and signup functionality
  button1.addEventListener('click', login);
  button2.addEventListener('click', signup);

  const updateUserInfo = (user) => {
    const container = document.querySelector('.user-info');

    // cloning the buttons removes existing event listeners
    const b1 = button1.cloneNode(true);
    const b2 = button2.cloneNode(true);

    // empty the user info div
    container.innerHTML = '';

    if (user) {
      b1.innerText = 'Log Out';
      b1.addEventListener('click', () => {
        netlifyIdentity.logout();
      });

      b2.innerText = 'Manage Subscription';
      b2.addEventListener('click', () => {
       // TODO handle subscription management
       fetch('/.netlify/functions/create-manage-link', {
         method: 'POST',
         headers: {
           Authorization: `Bearer ${user.token.access_token}`,
         },
       })
         .then((res) => res.json())
         .then((link) => {
           window.location.href = link;
         })
         .catch((err) => console.error(err));
      });
    } else {
      // if no one is logged in, show login/signup options
      b1.innerText = 'Log In';
      b1.addEventListener('click', login);

      b2.innerText = 'Sign Up';
      b2.addEventListener('click', signup);
    }

    // add the updated buttons back to the user info div
    container.appendChild(b1);
    container.appendChild(b2);
  };

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

return (

  <><Head>
<title>Next.js Starter!</title>
<link rel="icon" href="/favicon.ico" />
<script
type="text/javascript"
src="https://identity.netlify.com/v1/netlify-identity-widget.js">

</script>
</Head>
  
<h1>Sign Up for Premium Corgi Content</h1>

<div class="user-info">
<button id="left">Log In</button>
<button id="right">Sign Up</button>
</div>

<div class="corgi-content">
<div class="content">
<h2>Free Content</h2>
<div class="free"></div>
</div>
<div class="content">
<h2>Pro Content</h2>
<div class="pro"></div>
</div>
<div class="content">
<h2>Premium Content</h2>
<div class="premium"></div>
</div>
</div>

<template id="content">
<figure class="content-display">
<img />
<figcaption>
<a class="credit"></a>
</figcaption>
</figure>
</template></>

)




}