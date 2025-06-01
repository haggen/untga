import { Fragment } from "react";
import * as Definition from "~/components/definition";
import { Character, WithLocation } from "~/db";
import { fmt } from "~/lib/fmt";

type Props = Readonly<{ character: Character<WithLocation> }>;

/**
 * Character summary. Includes bio and public information.
 */
export function Summary({ character }: Props) {
  return (
    <Fragment>
      <p>{character.description || "No bio provided."}</p>

      <Definition.List>
        <Definition.Item label="Age">
          {fmt.character.age(character.createdAt)}
        </Definition.Item>
        <Definition.Item label="Location">
          {character.location.name}
        </Definition.Item>
        <Definition.Item label="Status">
          {fmt.character.status(character.status)}
        </Definition.Item>
      </Definition.List>
    </Fragment>
  );
}
