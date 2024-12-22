import React, { useState } from 'react'
import "./enterprise.css"

const Enterprise = () => {
    const [seatQuantity, setSeatQuantity] = useState(0)
    const [row, setRow] = useState("")
    const [location, setLocation] = useState("")
    const [night, setNight] = useState(0)
    const [month, setMonth] = useState(0)

    return (
        <>
        <div>Enterprise</div>
        <div>Enterprise</div>
        <div>Enterprise</div>
        <div>Hi Avery</div>
        </>
    )
}

export default Enterprise