import styled from 'styled-components';

import UsersIcon from '../assets/icons/users.svg';
import ProfileIcon from '../assets/icons/profile.svg';
import HomeIcon from '../assets/icons/home.svg';
import LogoutIcon from '../assets/icons/logout.svg';

let Wrapper = styled.div`
  background-color: hsl(204, 86%, 46%);
  height: 4rem;
  width: 100%;

  position: fixed;
  top: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;

  z-index: 60;
`;

let Spacer = styled.div`
  height: 4rem;
`;

let Logo = styled.h1`
  font-size: 2.5rem;

  background-color: white;
  border-radius: 5px;

  @media only screen and (max-width: 450px) {
    font-size: 1.5rem;
  }
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

let LogoutButton = styled.img`
  height: 2.8rem;
  padding: 0 0.5rem;

  border-radius: 5px;

  background-color: white;

  &:hover {
    background-color: hsl(0, 0%, 90%);

    cursor: pointer;
  }

  @media only screen and (max-width: 450px) {
    height: 1.5rem;
  }
`;

let NavigationIcon = styled.img`
  height: 2.2rem;
  padding: 0 0.5rem;

  border-radius: 5px;

  &:hover {
    background-color: hsl(204, 86%, 42%);

    cursor: pointer;
  }
`;

let Tooltipped = styled.span`
  position: relative;

  &::after {
    content: '';
    opacity: 0;
    transition: opacity 0.1s ease-out;
  }

  &:hover::after {
    content: ${(props) => `"${props.text}"` || '"default tooltip"'};

    opacity: 1;

    position: absolute;
    bottom: -1.8rem;
    left: 50%;
    transform: translateX(-50%);

    display: grid;
    place-items: center;

    padding: 0.3rem 0.5rem;
    width: max-content;

    background-color: #dadada;
    color: black;
    border-radius: 5px;
  }
`;

function Navbar({ isLoggedIn, title }) {
  return (
    <>
      <Wrapper>
        <Logo>🧑📕</Logo>
        {isLoggedIn && (
          <>
            <NavigationBox>
              <div>
                <a href="/">
                  <Tooltipped text="Home">
                    <NavigationIcon src={HomeIcon} alt="Home" />
                  </Tooltipped>
                </a>
                <a href="/users">
                  <Tooltipped text="Users">
                    <NavigationIcon src={UsersIcon} alt="Users" />
                  </Tooltipped>
                </a>
                <a href="/profile">
                  <Tooltipped text="Profile">
                    <NavigationIcon src={ProfileIcon} alt="Profile" />
                  </Tooltipped>
                </a>
              </div>
              <PageTitle>{title}</PageTitle>
            </NavigationBox>
            <a href="/api/auth/logout">
              <Tooltipped text="Logout">
                <LogoutButton src={LogoutIcon} />
              </Tooltipped>
            </a>
          </>
        )}
      </Wrapper>
      <Spacer />
    </>
  );
}

export default Navbar;
