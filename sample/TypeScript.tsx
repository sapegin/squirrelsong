import type { ReactNode } from "react";
import { Stack, Heading, IconCoffee } from ".";
import { name, icon } from "./Hola.css";

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
