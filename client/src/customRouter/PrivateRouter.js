import { Navigate } from "react-router-dom";

const PrivateRouter = ({component: Component}) => {
    const firstLogin = localStorage.getItem('firstLogin');
    return firstLogin ? <Component/> : <Navigate to="/" />
}
export default PrivateRouter