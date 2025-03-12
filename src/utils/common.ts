import { Dispatch } from "umi";

export interface UmiComponentProps {
  history?: History;
  dispatch: Dispatch<any>;
}