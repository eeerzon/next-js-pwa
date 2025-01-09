import { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "Expand" : "Collapse"}
      </button>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <style jsx>{`
        .sidebar {
          width: ${collapsed ? "80px" : "250px"};
          transition: width 0.3s;
          background: #007bff;
          color: white;
          height: 100vh;
          padding: 10px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin: 15px 0;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
