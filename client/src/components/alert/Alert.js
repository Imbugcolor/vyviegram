import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Loading from './Loading'
import { useNotifications } from 'reapop'

function Notify() {
    const { alert } = useSelector(state => state)

    const { notify } = useNotifications();

    useEffect(() => {
      alert.error && 
            notify({
              title: 'Oh no!',
              message: alert.error,
              status: 'error'
            })
      alert.success && 
            notify({
              title: alert.success,
              status: 'success'
            })
    }, [notify, alert])

  return (
    <div>
       {alert.loading && <Loading />}
    </div>
  )
}

export default Notify
