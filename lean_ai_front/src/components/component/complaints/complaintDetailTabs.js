import React, { useState, useEffect } from 'react';

const ComplaintDetailTabs = ({ activeTab, setActiveTab, children }) => (
    <div className="border-b border-gray-200 mb-4 w-full">
      <nav className="-mb-px flex">
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            active: child.props.tabKey === activeTab,
            onClick: () => setActiveTab(child.props.tabKey),
          })
        )}
      </nav>
    </div>
  );
  
  export default ComplaintDetailTabs;
  