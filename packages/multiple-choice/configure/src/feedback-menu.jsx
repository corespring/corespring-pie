import Menu, { MenuItem } from 'material-ui/Menu';
import { blue, green, grey } from 'material-ui/colors';

import ActionFeedback from 'material-ui-icons/Feedback';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import React from 'react';

export class IconMenu extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      anchorEl: undefined,
      open: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }


  handleClick(event) {
    this.setState({ open: true, anchorEl: event.currentTarget });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <div onClick={this.handleClick}>
          {this.props.iconButtonElement}
        </div>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >{this.props.children.map((c, index) => <div key={index} onClick={this.handleRequestClose}>{c}</div>)}
        </Menu>
      </div>
    );
  }
}
IconMenu.propTypes = {
  iconButtonElement: PropTypes.any
}


export default function FeedbackMenu(props) {

  const { value, onChange } = props;

  const iconColor = value === 'custom' ?
    green[500] :
    (value === 'default' ? blue[500] : grey[500]);

  const tooltip = value === 'custom' ?
    'Custom Feedback' :
    (value === 'default' ? 'Default Feedback' : 'Feedback disabled');

  const icon = <IconButton
    aria-label={tooltip}>
    <ActionFeedback color={iconColor} />
  </IconButton>;

  const chooseFeedback = (t) => {
    return () => {
      onChange(t);
    }
  }

  return <IconMenu
    iconButtonElement={icon}>
    <MenuItem onClick={chooseFeedback('none')}>No Feedback</MenuItem>
    <MenuItem onClick={chooseFeedback('default')}>Default</MenuItem>
    <MenuItem onClick={chooseFeedback('custom')}>Custom</MenuItem>
  </IconMenu>
}    
