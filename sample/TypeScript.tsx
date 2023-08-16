import React from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Stack, Heading, IconCoffee } from '.';
import { name, icon } from './Hola.css';

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

type Props = {
  children: ReactNode;
};

export function Hola({ children }: Props) {
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
