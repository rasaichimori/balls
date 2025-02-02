export type EditMode = "edit" | "remove" | "addBall" | "addSeg";
export type UserAction =
  | "ball selected"
  | "segment selected"
  | "addingSeg"
  | "addingBall"
  | undefined;

export type SelectMode = "velocity" | "position";
