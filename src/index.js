import React from 'react';
// import { render } from 'react-dom';

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: { nodeValue: text, children: [] },
  }
}

function createElement(type, props, ...children ) {
  return {
    type,
    props: { ...props, children: children.map( child => typeof child === 'object' ? child : createTextElement(child)) },
  };
};

const isProperty = prop => prop !== 'children';

function render(element, container) {
  const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type);
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(prop => dom[prop] = element.props[prop]);

  container.appendChild(parent);

  element.props.children.forEach(child =>
    render(child, dom)
  );

};

const CustomReact = {
  render,
  createElement
}

/** @jsx CustomReact.createElement */
const element = (
  <div>
    <a href="https://google.com">link</a>
  </div>
); 

CustomReact.render(
  element,
  document.getElementById('root')
);