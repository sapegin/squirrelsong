import React from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Li = styled.li<{ isOvernight: boolean }>`
  && {
    list-style: none;
    counter-increment: steps-counter;
    position: relative;
    padding: 0 0 0 1.1rem;
    margin-bottom: ${(p) =>
      p.isOvernight ? p.theme.space.xl : p.theme.space.m};
  }
`;

/*
 * Once upon a time...
 */

interface VampireProps {
  location: string;
  birthDate: number;
  deathDate: number;
  weaknesses: string[];
}

class Vampire {
  location: string;
  birthDate: number;
  deathDate: number;
  weaknesses: string[];

  constructor(props: VampireProps) {
    this.location = props.location;
    this.birthDate = props.birthDate;
    this.deathDate = props.deathDate;
    this.weaknesses = props.weaknesses;
  }

  get age(): number {
    return this.calcAge();
  }

  calcAge(): number {
    return this.deathDate - this.birthDate;
  }
}

// ...there was a guy named Vlad

const Dracula: VampireProps = new Vampire({
  location: 'Transylvania',
  birthDate: 1428,
  deathDate: 1476,
  weaknesses: ['Sunlight', 'Garlic'],
});
