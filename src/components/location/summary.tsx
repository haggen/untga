import { Fragment } from "react";
import * as Definition from "~/components/definition";
import { Location, WithPopulation } from "~/lib/db";
import { fmt } from "~/lib/fmt";

type Props = Readonly<{ location: Location<WithPopulation> }>;

/**
 * Location summary.
 */
export function Summary({ location }: Props) {
  return (
    <Fragment>
      <p>{location.description || "No description available."}</p>

      <Definition.List>
        <Definition.Item label="Security">
          {fmt.location.security(location.security)}
        </Definition.Item>
        <Definition.Item label="Area">
          {fmt.location.area(location.area)}
        </Definition.Item>
        <Definition.Item label="Population">
          {fmt.location.population(location._count.characters)}
        </Definition.Item>
      </Definition.List>
    </Fragment>
  );
}
