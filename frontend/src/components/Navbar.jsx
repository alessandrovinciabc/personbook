import styled from 'styled-components';

let Wrapper = styled.div`
  background-color: hsl(204, 86%, 46%);
  height: 4rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;

  & > a {
    text-decoration: none;
    font-size: 1.4rem;

    background-color: white;
    color: hsl(0, 0%, 7%);

    width: max-content;
    height: fit-content;
    padding: 0.7rem;
    border-radius: 5px;

    display: grid;
    place-items: center;
  }

  & > a:hover {
    background-color: hsl(0, 0%, 90%);
  }
`;

let Logo = styled.h1`
  font-size: 2.5rem;

  background-color: white;
  border-radius: 5px;
`;

let NavigationBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

let PageTitle = styled.h2`
  font-size: 1rem;
  font-weight: bold;
  color: white;
`;

function Navbar({ isLoggedIn, title }) {
  return (
    <Wrapper>
      <Logo>🧑📕</Logo>
      {isLoggedIn && (
        <>
          <NavigationBox>
            <div>home, users, profile</div>
            <PageTitle>{title}</PageTitle>
          </NavigationBox>
          <a href="/api/auth/logout">Logout</a>
        </>
      )}
    </Wrapper>
  );
}

export default Navbar;
