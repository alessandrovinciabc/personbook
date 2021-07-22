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

let ArrowButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  width: 3rem;

  border-radius: 2px;
  padding: 0.4rem 0.6rem;
  margin: 3px;

  font-size: 1.4rem;
  font-weight: bold;

  transition: 0.1s all;
`;

function PaginationBar({
  pagesForOneBlock,
  currentPage,
  maxQuota,
  usersPerPage,
  onPageChange,
}) {
  let output, lastPage, startingPage;
  output = [];
  let groupNumber = Math.ceil(currentPage / pagesForOneBlock);
  lastPage = groupNumber * pagesForOneBlock;
  startingPage = lastPage - pagesForOneBlock + 1;

  let totalPages = Math.ceil(maxQuota / usersPerPage);

  for (let i = startingPage; i <= lastPage; ++i) {
    let shouldBeSkipped = i > totalPages;
    if (shouldBeSkipped) break;

    output.push(
      <PageButton
        key={i}
        disabled={currentPage === i}
        onClick={() => onPageChange(i)}
      >
        {i}
      </PageButton>
    );
  }
  return (
    <>
      <ArrowButton
        onClick={() => {
          let nextPage = startingPage - 1;
          if (nextPage > totalPages) return;
          onPageChange(nextPage);
        }}
        disabled={startingPage - 1 <= 0}
      >
        &lt;
      </ArrowButton>
      {output}
      <ArrowButton
        onClick={() => {
          let nextPage = lastPage + 1;
          onPageChange(nextPage);
        }}
        disabled={lastPage + 1 > totalPages}
      >
        &gt;
      </ArrowButton>
    </>
  );
}

export default PaginationBar;
