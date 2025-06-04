// import { Action } from "~/db";
// import { Emitter } from "~/lib/emitter";
// import { tag } from "~/lib/tag";

// export const handlers = new Emitter()
//   .on(
//     [tag.Unequip],
//     async ({
//       characterId,
//       itemId,
//     }: {
//       characterId: number;
//       itemId: number;
//     }) => {}
//   )
//   .on(
//     [tag.Discard],
//     async ({
//       characterId,
//       itemId,
//     }: {
//       characterId: number;
//       itemId: number;
//     }) => {}
//   )
//   .on(
//     [tag.Resting],
//     async ({
//       characterId,
//       itemId,
//     }: {
//       characterId: number;
//       itemId: number;
//     }) => {}
//   )
//   .on([tag.Resting, tag.Tick], async (action: Action) => {})
//   .on(
//     [tag.Travel],
//     async ({
//       characterId,
//       destinationId,
//     }: {
//       characterId: number;
//       destinationId: number;
//     }) => {}
//   )
//   .on([tag.Travel, tag.Tick], async (action: Action) => {});
