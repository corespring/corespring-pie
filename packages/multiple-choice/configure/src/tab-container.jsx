import React from 'react';

const TabContainer = props =>
  <div style={{ padding: 0 }}>
    {props.children}
  </div>;

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
