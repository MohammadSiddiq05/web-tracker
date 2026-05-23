import { AnalyticsType } from '@/configs/type'
import React from 'react'

type Props = {
   label : string,
   value : string|undefined|number|null
}
const CountItem = ({label , value} : Props) => {
    return (
        <div>
            <div>
                <h2>{label}</h2>
                <h2 className='font-bold text-4xl'>{value}</h2>
            </div>
        </div>
    )
}

export default CountItem