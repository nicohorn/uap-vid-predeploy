'use client'

import { Convocatory } from '@prisma/client'
import { useEffect, useMemo, useState } from 'react'

export function CurrentConvocatory({
    label,
    convocatory,
}: {
    label: string
    convocatory: Convocatory
}) {
    const date = useMemo(() => new Date(convocatory.to), [])

    const [today, setToday] = useState(new Date())
    useEffect(() => {
        setTimeout(() => {
            setToday(new Date())
        }, 60000)
    }, [today])

    const differenceInMilliseconds = useMemo(
        () => date.getTime() - today.getTime(),
        [today, date]
    )
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000)
    const differenceInMinutes = Math.floor(differenceInSeconds / 60)
    const differenceInHours = Math.floor(differenceInMinutes / 60)
    const differenceInDays = Math.floor(differenceInHours / 24)

    const remainingHours = differenceInHours % 24
    const remainingMinutes = differenceInMinutes % 60

    return (
        <div className="float-right flex flex-col scale-90">
            <span className="label">{label}</span>
            <div className="flex flex-col md:flex-row items-center">
                <div className="grid grid-cols-4 gap-1 place-items-stretch w-fit flex-shrink-0 opacity-80 font-light">
                    <div className="text-center bg-gray-400/10 rounded-lg">
                        <div className="mt-1  font-bold">
                            {differenceInDays}
                        </div>
                        <div className="text-[0.6rem] ">Días</div>
                    </div>
                    <div className="text-center bg-gray-400/10 rounded-lg">
                        <div className="mt-1 font-normal ">
                            {remainingHours}
                        </div>
                        <div className="text-[0.6rem] ">Horas</div>
                    </div>
                    <div className="text-center bg-gray-400/10 rounded-lg px-2">
                        <div className="mt-1  font-light">
                            {remainingMinutes}
                        </div>
                        <div className="text-[0.6rem] ">Minutos</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
