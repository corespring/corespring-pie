import { assert, match, spy, stub } from 'sinon';
import { blue, green, grey } from 'material-ui/colors';

import { MenuItem } from 'material-ui/Menu'
import React from 'react';
import _ from 'lodash';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';

describe('feedback-menu', () => {

  let mod, FeedbackMenu, IconButton, IconMenu;

  beforeEach(() => {

    IconButton = spy(function (props) {
      return <div>IconButton</div>;
    });

    mod = proxyquire('../src/feedback-menu', {
      'material-ui/IconButton': {
        default: IconButton
      }
    });

    FeedbackMenu = mod.default;
    IconMenu = mod.IconMenu;
  });

  let mkWrapper = (opts = {}) => {
    opts = _.extend({}, opts);
    return shallow(<FeedbackMenu {...opts} />);
  }



  describe('aria-label', () => {

    let assert = (opts, expected) => {
      return () => {
        let w = mkWrapper(opts);
        let el = w.find(IconMenu);
        let be = el.prop('iconButtonElement');
        expect(be.props['aria-label']).to.eql(expected);
      }
    };

    it('sets disabled', assert({}, 'Feedback disabled'));
    it('sets custom', assert({ value: 'custom' }, 'Custom Feedback'));
    it('sets default', assert({ value: 'default' }, 'Default Feedback'));

  });

  describe('color', () => {
    let assert = (opts, expected) => {
      return () => {
        let w = mkWrapper(opts);
        let el = w.find(IconMenu);
        let be = el.prop('iconButtonElement');
        expect(be.props.children.props.color).to.eql(expected);
      }
    }

    it('sets blue for default', assert({ value: 'default' }, blue[500]));
    it('sets green for custom', assert({ value: 'custom' }, green[500]));
    it('sets grey for none', assert({ value: 'none' }, grey[500]));
  });

  describe('onChange', () => {
    let onChange, w;

    beforeEach(() => {
      onChange = stub();
      w = mkWrapper({ onChange });
    });

    it('returns none for No Feedback click', () => {
      w.find(MenuItem).at(0).simulate('click');
      assert.calledWith(onChange, 'none');
    });

    it('returns default for Default click', () => {
      w.find(MenuItem).at(1).simulate('click');
      assert.calledWith(onChange, 'default');
    });

    it('returns custom for Custom click', () => {
      w.find(MenuItem).at(2).simulate('click');
      assert.calledWith(onChange, 'custom');
    });
  });
});