import { useSelector } from 'react-redux';
import Notfound from '../components/Notfound'

const AdminRouter = ({component: Component}) => {
    const { auth } = useSelector(state => state)
    
    return auth.user && auth.user.role === 'admin' ? <Component /> : <Notfound />
}

export default AdminRouter