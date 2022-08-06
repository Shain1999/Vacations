import AppState from "./app-state";
import Action from "./action";
import { ActionType } from "./action-type";

const defaultAppState = new AppState();
export function reduce(oldAppState: AppState = defaultAppState, action: Action): AppState {
    // Cloning the oldState (creating a copy)
    const newAppState = { ...oldAppState };
    switch (action.type) {
        // adding user credentials to redux
        case ActionType.Login:
            newAppState.userType = action.payload.userType;
            newAppState.userId = action.payload.userId;
            break;
        // deleting user credentials from redux
        case ActionType.LogOut:
            newAppState.userType = null;
            newAppState.userId = null;
            break;
        // fetching all vacations from redux
        case ActionType.GetAllVacations:
            newAppState.vacations = action.payload;
            break;
        // updating vacation data after user loged in
        case ActionType.enrichVacations:
            newAppState.vacations = action.payload;
            break;
        // updating vacations array with the new updated vacation
        case ActionType.updateVacation:
            debugger
            newAppState.vacations = newAppState.vacations.filter(vacation => vacation.id != action.payload.vacationId);
            newAppState.vacations = [...newAppState.vacations, action.payload.vacationData]
            break;
        // updating vacations array with the new followed vacation
        case ActionType.FollowVacation:
            newAppState.vacations = newAppState.vacations.filter(enrich => enrich.id != action.payload.id);
            newAppState.vacations = [action.payload, ...newAppState.vacations]
            break;
        // updating vacations array with the new unFollowed vacation
        case ActionType.unFollowVacation:
            newAppState.vacations = newAppState.vacations.filter(enrich => enrich.id != action.payload.id);
            newAppState.vacations.push(action.payload);
            break;
        // deleting vacation from the vacations array in redux
        case ActionType.DeleteVacation:
            newAppState.vacations = newAppState.vacations.filter(vacation => vacation.id != action.payload);
            break;
        // adding vacation to vacations array in redux
        case ActionType.AddVacation:
            newAppState.vacations = [...oldAppState.vacations, action.payload];
    }

    // After returning the new state, it's being published to all subscribers
    // Each component will render itself based on the new state
    return newAppState;
}