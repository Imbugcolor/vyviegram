import { EditData, GLOBALTYPES } from "../actions/globalTypes"
import { REPORTS_TYPES } from "../actions/reportAction";

const initialState = {
    post: null,
    loading: false,
    data: [],
    result: 0,
    total: 0,
    page: 1,
    filter: {
        sort: '',
        status: '',
    },
    firstLoad: false
}

const reportReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.REPORT_POST:
            return {
                ...state,
                post: action.payload
            };
        case REPORTS_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case REPORTS_TYPES.GET_REPORTS:
            return {
                ...state,
                data: action.payload.reports,
                total: action.payload.total,
                result: action.payload.result,
                page: action.payload.page,
                firstLoad: true
            };
        case REPORTS_TYPES.EXECUTE_REPORT:
            return {
                ...state,
                data: state.data.map(item => 
                    item.post_id && item.post_id._id === action.payload._id ?
                    {
                        ...item, 
                        status: 'EXECUTED'
                    } : item
                ),
            };
        case REPORTS_TYPES.REJECT_REPORT:
            return {
                ...state,
                data: EditData(state.data, action.payload._id, action.payload)
            };
        case REPORTS_TYPES.UPDATE_READ:
            return {
                ...state,
                data: state.data.map(item => 
                    item.isRead === false ?
                    {
                        ...item, 
                        isRead: true
                    } : item
                ),
            };
        case REPORTS_TYPES.SORT_REPORTS:
            return  {
                ...state,
                filter: {
                    ...state.filter,
                    sort: action.payload
                }
            };
        case REPORTS_TYPES.FILTER_STATUS_REPORTS:
            return  {
                ...state,
                filter: {
                    ...state.filter,
                    status: action.payload
                }
            };
        case REPORTS_TYPES.GET_FILTER_REPORTS:
            return {
                ...state,
                data: action.payload.reports, 
                result: action.payload.result,
                page:  action.payload.page
            }
        default:
            return state;
    }
}

export default reportReducer
