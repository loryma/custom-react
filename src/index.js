import React from 'react';
import { render } from 'react-dom';

const element = React.createElement(
  'h1',
  { title: 'foo'},
  'Hello',
);

// const element = {
//   type: 'h1',
//   props: {
//     title: 'foo',
//     children: 'Hello',
//   },
// };

const container = document.getElementById('root');

const node = document.createElement(element.type);
node['title'] = element.props.title;
const text = document.createTextNode('');
text['nodeValue'] = element.props.children;
node.appendChild(text);
container.appendChild(node);

// render(
//   element,
//   container,
// );