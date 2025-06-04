import { Fragment } from "react";
import * as Definition from "~/components/definition";
import { Item, WithSpec } from "~/db";
import { fmt } from "~/lib/fmt";
import { tag } from "~/lib/tag";

type Props = Readonly<{ item: Item<WithSpec> }>;

/**
 * Item summary.
 */
export function Summary({ item }: Props) {
  return (
    <Fragment>
      <p>{item.spec.description}</p>

      <Definition.List>
        {item.spec.tags.includes(tag.Craftable) ? (
          <Definition.Item label="Quality">
            {fmt.item.quality(item.quality)}
          </Definition.Item>
        ) : null}
        {item.spec.tags.includes(tag.Breakable) ? (
          <Definition.Item label="Durability">
            {fmt.item.durability(item.durability)}
          </Definition.Item>
        ) : null}
        {item.spec.tags.includes(tag.Stackable) ? (
          <Definition.Item label="Amount">
            {fmt.item.amount(item.amount)}
          </Definition.Item>
        ) : null}
      </Definition.List>
    </Fragment>
  );
}
