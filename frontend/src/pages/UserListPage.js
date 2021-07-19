import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar.jsx';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectStatus } from '../features/auth/authSlice';

// Components
import Loader from '../components/Loader';

import axios from 'axios';

function UserListPage(props) {
  let auth = useSelector(selectCurrentUser);
  let authStatus = useSelector(selectStatus);

  let [pageNumber, setPageNumber] = useState(1);
  let [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`/api/user?page=${pageNumber}`).then((response) => {
      let newUsers = response.data;
      setUsers(newUsers);
    });
  }, [pageNumber]);

  function generatePageButtons(nOfPages) {
    let output, lastPage, startingPage;
    output = [];
    let groupNumber = Math.trunc(pageNumber / (nOfPages + 1)) + 1;
    lastPage = groupNumber * nOfPages;
    startingPage = lastPage - nOfPages + 1;
    for (let i = startingPage; i <= lastPage; ++i) {
      output.push(
        <a href onClick={() => setPageNumber(i)}>
          {i}
        </a>
      );
    }
    return output;
  }

  function displayUsers() {
    if (!(users.length > 0)) return;

    return users.map((user) => <div>{user._id}</div>);
  }

  return (
    <>
      <Navbar isLoggedIn={true} title="Homepage" />
      <div>
        {displayUsers()}
        <br />
        <br />
        {generatePageButtons(5)}
      </div>
    </>
  );
}

export default UserListPage;
