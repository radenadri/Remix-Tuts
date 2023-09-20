import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import ThemeContext from "~/contexts/ThemeContext";
import { useContext } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeChange = () => {
    const isCurrentDark = localStorage.getItem('theme') === 'dark';
    setTheme(isCurrentDark ? 'light' : 'dark');
    localStorage.setItem('theme', isCurrentDark ? 'light' : 'dark');
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 style={{
        color: theme === 'dark' ? "red" : "black",
      }}>Welcome to Remix</h1>
      <button onClick={() => handleThemeChange()}>
        Toggle {theme === 'dark' ? 'Light' : 'Dark'}
      </button>
      <ul>
        <li>
          <Link to="/products?view=lists">Product Lists</Link>
        </li>
        <li>
          <Link to="/products?view=tables">Product Tables</Link>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
