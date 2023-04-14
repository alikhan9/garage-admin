import React from 'react'

const DoubleDivFlex = ({name, value}) => {
    return (
        <div className='flex border-slate-600 justify-between border-b-2 font-light text-slate-300'>
            <div className='py-2'>{name}</div>
            <div className='py-2 font-bold'>{value}</div>
        </div>
    )
}

export default DoubleDivFlex