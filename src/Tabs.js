import React from "react";
import { useNavigate } from 'react-router-dom';

const Tabs = ({ activeTab, onHeaderClick }) => {
  const navigate = useNavigate();
  const tabs = ["Home","Features", "Services", "WorkWithUs"];
  
  return (
    <ul className="home-header-icons">
      {tabs.map((header, index) => (
        <li
          key={index}
          className={activeTab === header ? "active" : ""}
          onClick={() => {
            onHeaderClick(header); 
          }}
        >
          {header}
        </li>
      ))}
    </ul>
  );
};

export default Tabs;
