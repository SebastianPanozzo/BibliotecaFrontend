import { Outlet } from "react-router-dom";
import Menu from "./Menu";

const outletStyle = {
  minHeight: 'calc(100vh - 71px)',
}

export default function Layout() {
  return (
    <div className="">
      <Menu />
      <div className="p-4" style={outletStyle}>
        <Outlet />
      </div>
    </div>
  );
}