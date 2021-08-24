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

function createDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(prop => dom[prop] = fiber.props[prop]);
  return dom;
};

let nextUnitOfWork = null;
let wipRoot = null

function render(element, container) {

  wipRoot = {
    dom: container,
    props: { children: [element]}
  };

  nextUnitOfWork = wipRoot;

};

function commitRoot() {

  commitWork(wipRoot);

  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function scheduleRenderWork(deadline) {
  let yieldWork = false;

  while (nextUnitOfWork && !yieldWork) {
    nextUnitOfWork = executeUnitOfWork(nextUnitOfWork);

    if (deadline.timeRemaining() < 1) yieldWork = true;
  }

  if (!nextUnitOfWork)  commitRoot(wipRoot);

  requestIdleCallback(scheduleRenderWork);
};

function executeUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const children = fiber.props.children;

  let prevSibling = null;

  children.forEach( (child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    newFiber.parent = fiber;
    prevSibling = newFiber;
  });

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {

    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

requestIdleCallback(scheduleRenderWork);

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