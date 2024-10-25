import { logout } from "@/lib/features/auth";

export const handleUnauthorizedMiddleware = (state) => (next) => (action) => {
    //console.log(action);
    if (action.type.endsWith('rejected') && (action.status === 401 || action.payload === 401 || action.payload?.status === 401)) {
        state.dispatch(logout())
    }
    return next(action);
}
