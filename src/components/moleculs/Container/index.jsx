import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  AnalyticsSVG,
  BrandSVG,
  GallerySVG,
  HomeSVG,
  LogoutSVG,
  PaymentsSVG,
  SantriSVG,
  SettingsSVG,
  TransactionsSVG,
} from "../../../assets/icons";
import { UserContext } from "../../../context/UserContext";
const Container = ({ children }) => {
  const { user } = useContext(UserContext);
  const {
    location: { pathname },
  } = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("ponpestoken");
  };

  return (
    <div className="flex w-full">
      <div className="bg-white min-h-screen">
        <div className="bg-white min-h-screen sticky top-0 flex flex-col justify-center items-center p-4 self-center">
          <Link to="/" className="flex justify-center items-center">
            <BrandSVG />
            <p className="pl-4 self-center text-xl font-bold">My Ponpes</p>
          </Link>
          <div className="relative h-4"></div>
          <div className="flex-1 flex flex-col py-4">
            {user.level === 0 ? (
              ""
            ) : (
              <Link
                to="/"
                className={`flex m-2 px-8 py-2 ${
                  pathname === "/" ? "bg-blue-600 text-white" : ""
                } rounded-lg`}
              >
                <HomeSVG />
                <p className="pl-4 self-center">Dashboard</p>
              </Link>
            )}
            {user.level > 1 ? (
              <Link
                to="/transactions"
                className={`flex m-2 px-8 py-2 ${
                  pathname.includes("transaction")
                    ? "bg-blue-600 text-white"
                    : ""
                } rounded-lg`}
              >
                <TransactionsSVG />
                <p className="pl-4 self-center">Transactions</p>
              </Link>
            ) : (
              ""
            )}
            {user.level === 1 ? (
              <Link
                to="/events"
                className={`flex m-2 px-8 py-2 ${
                  pathname.includes("event") ? "bg-blue-600 text-white" : ""
                } rounded-lg`}
              >
                <GallerySVG />
                <p className="pl-4 self-center">Events</p>
              </Link>
            ) : (
              ""
            )}
            {user.level === 0 ? (
              <>
                <Link
                  to="/analytics"
                  className={`flex m-2 px-8 py-2 ${
                    pathname.includes("analytic")
                      ? "bg-blue-600 text-white"
                      : ""
                  } rounded-lg`}
                >
                  <AnalyticsSVG />
                  <p className="pl-4 self-center">Analytics</p>
                </Link>
                <Link
                  to="/gallery"
                  className={`flex m-2 px-8 py-2 ${
                    pathname.includes("gallery") ? "bg-blue-600 text-white" : ""
                  } rounded-lg`}
                >
                  <GallerySVG />
                  <p className="pl-4 self-center">Gallery</p>
                </Link>
              </>
            ) : (
              ""
            )}
            {user.level !== 1 ? (
              <Link
                to="/payments"
                className={`flex m-2 px-8 py-2 ${
                  pathname.includes("payment") ? "bg-blue-600 text-white" : ""
                } rounded-lg`}
              >
                <PaymentsSVG />
                <p className="pl-4 self-center">Payments</p>
              </Link>
            ) : (
              ""
            )}
            {user.level > 1 ? (
              <Link
                to="/santri"
                className={`flex m-2 px-8 py-2 ${
                  pathname.includes("santri") ? "bg-blue-600 text-white" : ""
                } rounded-lg`}
              >
                <SantriSVG />
                <p className="pl-4 self-center">Santri</p>
              </Link>
            ) : (
              ""
            )}
            <div className="flex-1"></div>
            <a
              href="/"
              onClick={handleLogout}
              className="flex text-red-600 m-2 px-8 py-2 rounded-lg"
            >
              <LogoutSVG />
              <p className="pl-4 self-center">Logout</p>
            </a>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 w-full min-h-screen p-4 sm:p-12">
        {children}
      </div>
    </div>
  );
};

export default Container;
