import React from 'react';

import Navbar from '../components/Navbar.jsx';

function Page404(props) {
  return (
    <>
      <Navbar isLoggedIn={true} title="Page not found" />
      <div>
        <h1>Hmmm. It seems what you were looking for isn't here</h1>
      </div>
    </>
  );
}

export default Page404;
