import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar.jsx';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectStatus } from '../features/auth/authSlice';

// Components
import Loader from '../components/Loader';
import PaginationBar from '../components/PaginationBar';

import axios from 'axios';

function UserListPage(props) {
  let auth = useSelector(selectCurrentUser);
  let authStatus = useSelector(selectStatus);

  let [pageNumber, setPageNumber] = useState(1);
  let [maxQuota, setMaxQuota] = useState(0);
  let [usersPerPage, setUsersPerPage] = useState(0);
  let [users, setUsers] = useState([]);

  let [status, setStatus] = useState('idle');

  useEffect(() => {
    setStatus('loading');
    axios
      .get(`/api/user?page=${pageNumber}`)
      .then((response) => {
        let newUsers = response.data.docs;
        setUsers(newUsers);

        setMaxQuota(response.data.maxQuota);
        setUsersPerPage(response.data.usersPerPage);

        setStatus('fulfilled');
      })
      .catch((err) => {
        setStatus('rejected');
      });
  }, [pageNumber]);

  function displayUsers() {
    if (!(users.length > 0)) return;

    return users.map((user) => <div key={user._id}>{user.name}</div>);
  }

  return (
    <>
      <Navbar isLoggedIn={true} title="Homepage" />
      <div>
        {status !== 'fulfilled' ? <Loader /> : displayUsers()}
        <br />
        <br />
        {
          <PaginationBar
            currentPage={pageNumber}
            pagesForOneBlock={5}
            maxQuota={maxQuota}
            usersPerPage={usersPerPage}
            onPageChange={(value) => {
              setPageNumber(value);
            }}
          />
        }
      </div>
    </>
  );
}

export default UserListPage;
