import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar.jsx';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectStatus } from '../features/auth/authSlice';

// Components
import Loader from '../components/Loader';

import axios from 'axios';

import styled from 'styled-components';

let PageButton = styled.button`
  background: none;
  border: none;

  border-radius: 2px;
  padding: 0.4rem 0.6rem;
  margin: 3px;
  font-size: 1rem;

  background-color: rgba(0, 0, 0, 0.1);

  box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);

  transition: 0.1s all;

  &:hover {
    background-color: hsl(204, 86%, 46%);
    cursor: pointer;
  }

  &:disabled {
    background-color: hsl(204, 86%, 46%);
    color: white;
  }
`;

function UserListPage(props) {
  let auth = useSelector(selectCurrentUser);
  let authStatus = useSelector(selectStatus);

  let [pageNumber, setPageNumber] = useState(1);
  let [maxQuota, setMaxQuota] = useState(0);
  let [remainingQuota, setRemainingQuota] = useState(0);
  let [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`/api/user?page=${pageNumber}`).then((response) => {
      let newUsers = response.data.docs;
      setUsers(newUsers);

      setMaxQuota(response.data.maxQuota);
      setRemainingQuota(response.data.remainingQuota);
    });
  }, [pageNumber]);

  function generatePageButtons(nOfPages) {
    let output, lastPage, startingPage;
    output = [];
    let groupNumber = Math.ceil(pageNumber / nOfPages);
    lastPage = groupNumber * nOfPages;
    startingPage = lastPage - nOfPages + 1;

    let totalPages = Math.ceil(maxQuota / (maxQuota - remainingQuota));

    for (let i = startingPage; i <= lastPage; ++i) {
      let shouldBeSkipped = i > totalPages;
      if (shouldBeSkipped) break;

      output.push(
        <PageButton
          disabled={pageNumber === i}
          onClick={() => setPageNumber(i)}
        >
          {i}
        </PageButton>
      );
    }
    return (
      <>
        <button
          onClick={() => {
            let nextPage = startingPage - 1;
            if (nextPage > totalPages) return;
            setPageNumber(nextPage);
          }}
          disabled={startingPage - 1 <= 0}
        >
          &lt;
        </button>
        {output}
        <button
          onClick={() => {
            let nextPage = lastPage + 1;
            setPageNumber(nextPage);
          }}
          disabled={lastPage + 1 > totalPages}
        >
          &gt;
        </button>
      </>
    );
  }

  function displayUsers() {
    if (!(users.length > 0)) return;

    return users.map((user) => <div>{user.name}</div>);
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
