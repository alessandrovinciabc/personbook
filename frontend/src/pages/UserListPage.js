import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar.jsx';

// Components
import Loader from '../components/Loader';
import PaginationBar from '../components/PaginationBar';
import UsersList from '../components/UsersList.jsx';

import axios from 'axios';

import styled from 'styled-components';

let Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

let UsersContainer = styled.div`
  width: 100%;
  max-width: 360px;
`;

let SpacedDiv = styled.div`
  margin: 1rem 0;
`;

let CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

let PageHeader = styled.div`
  margin: 2rem 0 1rem 0;

  font-weight: bold;
  font-size: 1.5rem;
`;

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
      .then(response => {
        let newUsers = response.data.docs;
        setUsers(newUsers);

        setMaxQuota(response.data.maxQuota);
        setUsersPerPage(response.data.usersPerPage);

        setStatus('fulfilled');
      })
      .catch(err => {
        setStatus('rejected');
      });
  }, [pageNumber]);

  return (
    <>
      <Navbar isLoggedIn={true} title="Homepage" />
      <Container>
        {status !== 'fulfilled' ? (
          <Loader />
        ) : (
          <UsersContainer>
            <SpacedDiv>
              <CenteredDiv>
                <PageHeader>Users</PageHeader>
              </CenteredDiv>
              <UsersList users={users} />
              <CenteredDiv>
                <PaginationBar
                  currentPage={pageNumber}
                  pagesForOneBlock={5}
                  maxQuota={maxQuota}
                  usersPerPage={usersPerPage}
                  onPageChange={value => {
                    setPageNumber(value);
                  }}
                />
              </CenteredDiv>
            </SpacedDiv>
          </UsersContainer>
        )}
      </Container>
    </>
  );
}

export default UserListPage;
