import { ActionType } from "./action-type";

export default interface Action {
    type: ActionType,
    payload?: any
}