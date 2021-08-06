import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar.jsx';

// Components
import Loader from '../components/Loader';
import PaginationBar from '../components/PaginationBar';
import UsersList from '../components/UsersList.jsx';

import axios from 'axios';

function UserListPage(props) {
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

  return (
    <>
      <Navbar isLoggedIn={true} title="Homepage" />
      <div>
        {status !== 'fulfilled' ? <Loader /> : <UsersList users={users} />}
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
