import {Dispatch} from "redux";
import {appActions} from "app/app.reducer";
import {BaseResponseType} from "common/types/common.types";

export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, isShowGlobalError: boolean = true) => {
    if (isShowGlobalError) {
        dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : "Some error occurred"}));

    }
    dispatch(appActions.setAppStatus({status: "failed"}));
};
