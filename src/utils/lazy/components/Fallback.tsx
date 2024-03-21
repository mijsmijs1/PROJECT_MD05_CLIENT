import React from 'react'

export default function Fallback({ fallback }: { fallback: string | null }) {
    window.location.href = fallback ? fallback : "/"
    return (
        <div>Permission denied</div>
    )
}
