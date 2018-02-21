import { assert, match, spy, stub } from 'sinon';

import React from 'react';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';

describe('multi-lang-input', () => {

  let mod, MultiLangInput;

  beforeEach(() => {
    mod = proxyquire('../src/multi-lang-input', {});
    MultiLangInput = mod.MultiLangInput;
  });

  let mkWrapper = (opts = {}) => {
    opts = _.extend({
      value: [
        { lang: 'en-US', value: 'hi' },
        { lang: 'es-ES', value: 'ola' },
      ],
      lang: 'en-US',
      textFieldLabel: 'label',
      classes: {
        root: 'root'
      }
    }, opts);
    return shallow(<MultiLangInput {...opts} />);
  }

  describe('render', () => {

    let assert = (opts, prop, expected) => {
      return () => {
        let w = mkWrapper(opts);
        let el = w.find(TextField);
        expect(el.prop(prop)).to.eql(expected);
      }
    };

    describe('value', () => {
      it('set to hi', assert({}, 'value', 'hi'));
      it('set to ola', assert({ lang: 'es-ES' }, 'value', 'ola'));
      it('set to empty for unknown lang', assert({ lang: 'unknown' }, 'value', ''));
    });

    describe('name', () => {
      it('set to hi', assert({}, 'value', 'hi'));
      it('set to ola', assert({ lang: 'es-ES' }, 'value', 'ola'));
    });

  });

  describe('onChange', () => {
    let onChange;
    beforeEach(() => {
      onChange = stub();
    });

    it('calls onChange callback', () => {
      let w = mkWrapper({ onChange })
      let tf = w.find(TextField);
      tf.prop('onChange')({
        target: {
          value: 'hi'
        }
      });
      assert.calledWith(onChange, 'hi', 'en-US');
    });
  });

});