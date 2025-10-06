import React, { useState } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Stack, Heading, IconCoffee } from '.';
import { name, icon } from './Hola.css';

const hello = () => console.log('hello');
const varUrl = window.location.href
  .replace(/^hello\s*(.*)world/, '$1')
  .concat('\u1111z\n');

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

const someString = 'There was a squirrel named Squeaky';
const someTemplateLiteral = `There was a squirrel named ${name}`;

const someObject = {
  hello,
  varUrl,
  adios: '42',
};

class Squirrel {
  private name: string;
  private obj: Record<string, string> = {
    hello,
    varUrl,
    adios: '42',
  };

  public constructor(name: string, obj: Record<string, string> = {}) {
    this.name = name;
    this.obj = obj;
  }

  public greet() {
    console.log(`Hola, ${this.name}`);
  }

  public get adios() {
    return this.obj.adios;
  }
  public set adios(value: string) {
    this.obj.adios = value;
  }
}

// Greet the squirrel!
const sqrl = new Squirrel('Squeaky');

// From https://vscodethemes.com/
const btn = document.getElementById('btn');
let count = 0;

function render() {
  if (btn) {
    btn.innerText = `Count ${count}`;
  }
}

btn?.addEventListener('click', () => {
  // Count from 1 to 10
  if (count < 10) {
    count += 1;
    render();
  }
});

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
          <IconCoffee className={icon} size={{ width: 12, height: 16 }} />
        </span>
      </Stack>
    </Heading>
  );
}

interface Tweet {
  id: string;
  username: string;
  html: string;
}

function Tweets() {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [tweets, setTweets] = useState<Tweet>([]);

  const handleLoadTweets = () => {
    setLoading(true);
    getTweets()
      .then((tweets) => {
        setTweets(tweets);
        setLoading(false);
        setError(false);
      })
      .catch(() => {
        setTweets([]);
        setLoading(false);
        setError(true);
      });
  };

  if (isLoading) {
    return <p>Loading…</p>;
  }

  if (isError) {
    return <p>Something went wrong!</p>;
  }

  if (tweets.length === 0) {
    return <button onClick={handleLoadTweets}>Load tweets</button>;
  }

  return (
    <ul>
      {tweets.map(({ id, username, html }) => (
        <li key={id}>
          {html} by {username}
        </li>
      ))}
    </ul>
  );
}
