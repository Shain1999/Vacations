import IVacation from "../components/models/IVacation";

export default class AppState {
    public vacations: IVacation[] = [];
    public userType: string = null;
    public userId: number = 0;
    public enrichVacationsArray: IVacation[];
    public followedVacationsId: number[] = [];

}