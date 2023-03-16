import { StatusError } from "../types/StatusError";

export const logError = (err: any) => console.log(err);
export const startString = () => {
    console.log('--------------------------------------------------------------------------START-------------------------------------------------------------------------');
    for (let i = 0; i < 3; i++)
    console.log('--------------------------------------------------------------------------------------------------------------------------------------------------------');
};

export function handleError (err: any): StatusError {
    let statusErr: StatusError = err;
    if (!err.statusCode)
        statusErr.statusCode = 500;
    return statusErr;
}
