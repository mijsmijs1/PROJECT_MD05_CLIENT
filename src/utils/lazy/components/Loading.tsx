import React from 'react'
import LoadingImg from "./loading.png"

export default function Loading() {
    return (
        <div className='loading_container'>
            <img
                className='loading_icon'
                src={LoadingImg}
            ></img>
        </div>
    )
}
