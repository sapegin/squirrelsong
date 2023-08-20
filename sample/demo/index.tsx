import React, { type ReactNode } from 'react';
import styled from 'styled-components';
import { Stack, Text, Heading } from './components';

const Name = styled.span`
  font-size: calc(2.6rem + 4rem);
  color: ${(props) => props.theme.color.primary};
`;

type Props = {
  children: ReactNode;
};

/** Squirrelsong Light Color Theme */
export function Squirrelsong({ children }: Props) {
  return (
    <Heading level={1}>
      <Stack
        as="span"
        display="inline-flex"
        direction="row"
        gap="s"
        alignItems="baseline"
      >
        <Name>{children}</Name>
        <Text variant="small">© Squeaky {new Date().getFullYear()}</Text>
      </Stack>
    </Heading>
  );
}
