import { Outlet } from "@remix-run/react";

export default function Blocks() {
  return (
    <>
      <h1>Blocks Layout</h1>
      <Outlet />
    </>
  );
}