import React from 'react';
import styled from 'styled-components';
import { Stack, Heading, IconCoffee } from '.';
import { name, icon } from './Hola.css';

const hello = () => console.log('hello');
const varUrl = window.location.href
  .replace(/^\s*(.*)/, '$1')
  .concat('\u1111z\n');

const Li = styled.li`
  && {
    list-style: none;
    counter-increment: steps-counter;
    position: relative;
    padding: 0 0 0 1.1rem;
    margin-bottom: ${(p) =>
      p.isOvernight ? p.theme.space.xl : p.theme.space.m};
  }
`;

// From https://vscodethemes.com/
const btn = document.getElementById('btn');
let count = 0;

function render() {
  if (btn) {
    btn.innerText = `Count ${count}`;
  }
}

btn.addEventListener('click', () => {
  // Count from 1 to 10
  if (count < 10) {
    count += 1;
    render();
  }
});

/*
 * Once upon a time...
 */
class Vampire {
  constructor(props) {
    this.location = props.location;
    this.birthDate = props.birthDate;
    this.deathDate = props.deathDate;
    this.weaknesses = props.weaknesses;
  }

  get age() {
    return this.calcAge();
  }

  calcAge() {
    return this.deathDate - this.birthDate;
  }
}

// ...there was a guy named Vlad
const Dracula = new Vampire({
  location: 'Transylvania',
  birthDate: 1428,
  deathDate: 1476,
  weaknesses: ['Sunlight', 'Garlic'],
});

export function Hola({ children }) {
  return (
    <Heading level={1}>
      <Stack
        as="span"
        display="inline-flex"
        direction="row"
        gap="s"
        alignItems="baseline"
      >
        <span className={name}>{children}</span>
        <span>
          <IconCoffee className={icon} />
        </span>
      </Stack>
    </Heading>
  );
}
