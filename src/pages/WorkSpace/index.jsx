import { Outlet } from "react-router-dom";
import Menu from "./Menu";

const outletStyle = {
  minHeight: 'calc(100vh - 71px)',
}

export default function Layout() {
  return (
    <div className="">
      <Menu />
      <div className="p-4 bg-light" style={outletStyle}>
        <div className="mx-lg-5 px-xl-5" >
          <Outlet />
        </div>
      </div>
    </div>
  );
}