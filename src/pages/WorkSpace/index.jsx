import { Outlet } from "react-router-dom";
import Menu from "./Menu";

export default function Layout() {
  return (
    <div className="">
      <Menu />
      <div className="bg-body-tertiary vh-100">
        <Outlet />
      </div>
    </div>
  );
}