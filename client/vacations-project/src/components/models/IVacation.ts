export default interface IVacation{
    id:number;
    destination:string;
    isFollowed ?: number;
    amountOfFollowers ?:number;
    price:number;
    imgUrl:string;
    startDate:string;
    endDate:string;

}