import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Wrapper from "./components/Wrapper";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Uploads from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Messages from "./pages/Messages";
import ProductListing from "./pages/ProductListing";
import Account from "./pages/Account";
import NoMatch from "./pages/Nomatch";
import API from "./utils/API";
import UserContext from "./context/UserContext";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";
import ContentContainer from "./components/ContentContainer";

function App() {
  const [userData, setUserData] = useState({
    user: undefined,
    token: undefined,
  });

  const checkLoggedIn = async () => {
    let token = await localStorage.getItem("auth-token");

    if (token === null) {
      localStorage.setItem("auth-token", "");
    } else {
      try {
        const userRes = await API.getUser(token);
        setUserData({ token, user: userRes.data });
      } catch (err) {
        console.log("User must login");
      }
    }
  };

  const logout = () => {
    console.log("logout clicked");
    setUserData({ token: undefined, user: undefined });
    localStorage.setItem("auth-token", "");
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <BrowserRouter>
      <Wrapper>
        <Sidebar />
        <Main>
          {!userData.user ? (
            <Navbar user={userData} name="sending login" />
          ) : (
            <Navbar user={userData} onClick={logout} name="sending logout" />
          )}
          <ContentContainer>
            <UserContext.Provider value={{ userData, setUserData }}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/upload" component={Uploads} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/messages" component={Messages} />
                <Route exact path="/productlist" component={ProductListing} />
                <Route exact path="/account" component={Account} />
                <Route>
                  <NoMatch />
                </Route>
              </Switch>
            </UserContext.Provider>
          </ContentContainer>
          <Footer />
        </Main>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
