import axios from "axios";
import jwtDecode from "jwt-decode";
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
const Login = lazy(() => import("../pages/Login"));
const Admin = lazy(() => import("../pages/Admin"));
const AdminTrans = lazy(() => import("../pages/Admin/AdminTrans"));
const AdminPayment = lazy(() => import("../pages/Admin/AdminPayment"));
const AdminSantri = lazy(() => import("../pages/Admin/AdminSantri"));
const SantriAnalytic = lazy(() => import("../pages/Santri/SantriAnalytic"));
const SantriGallery = lazy(() => import("../pages/Santri/SantriGallery"));
const SantriPayment = lazy(() => import("../pages/Santri/SantriPayment"));
const Level = lazy(() => import("../pages/Level"));
const LevelEvent = lazy(() => import("../pages/Level/LevelEvent"));

const Routes = () => {
  const [user, setUser] = useState({ token: null, level: -1 });
  const [darkMode, setDarkMode] = useState(null);

  const checkUser = () => {
    const token = localStorage.getItem("ponpestoken");
    const theme = localStorage.getItem("ponpestheme");
    if (token) {
      const data = jwtDecode(token);
      if (data.username && data.password && data.level > -1) {
        axios
          .post(data.level < 2 ? "santri/login" : "admin/login", {
            username: data.username,
            password: data.password,
          })
          .then((res) => {
            setUser({
              token: res.data.data.token,
              level: res.data.data.level,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    if (theme) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <BrowserRouter>
          <Switch>
            {user.level > -1 ? (
              user.level > 1 ? (
                <>
                  <Suspense fallback={<div>Loading ... </div>}>
                    <Route exact path="/" component={Admin} />
                  </Suspense>
                  <Suspense fallback={<div>Loading ... </div>}>
                    <Route path="/transactions" component={AdminTrans} />
                  </Suspense>
                  <Suspense fallback={<div>Loading ... </div>}>
                    <Route path="/payments" component={AdminPayment} />
                  </Suspense>
                  <Suspense fallback={<div>Loading ... </div>}>
                    <Route path="/santri" component={AdminSantri} />
                  </Suspense>
                </>
              ) : user.level > 0 ? (
                <>
                  <Suspense fallback={<div>Loading ...</div>}>
                    <Route exact path="/" component={Level} />
                  </Suspense>
                  <Suspense fallback={<div>Loading ...</div>}>
                    <Route path="/events" component={LevelEvent} />
                  </Suspense>
                </>
              ) : (
                <>
                  <Suspense fallback={<div>Loading ...</div>}>
                    <Route path="/analytics" component={SantriAnalytic} />
                  </Suspense>
                  <Suspense fallback={<div>Loading ...</div>}>
                    <Route path="/gallery" component={SantriGallery} />
                  </Suspense>
                  <Suspense fallback={<div>Loading ...</div>}>
                    <Route path="/payments" component={SantriPayment} />
                  </Suspense>
                </>
              )
            ) : (
              <Suspense fallback={<div>Loading ... </div>}>
                <Route path="/" component={Login} />
              </Suspense>
            )}
            <Route path="*">
              <div>Not Found</div>
            </Route>
          </Switch>
        </BrowserRouter>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};

export default Routes;
