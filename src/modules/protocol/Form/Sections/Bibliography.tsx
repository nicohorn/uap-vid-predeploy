'use client'
import { useProtocolContext } from 'utils/createContext'

import { motion } from 'framer-motion'
import Table from '@protocol/elements/Table'

export default function Bibliography() {
    const form = useProtocolContext()
    const path = 'sections.bibliography.'

    return (
        <motion.div
            animate={{ opacity: 1, x: 6 }}
            transition={{ duration: 0.7 }}
            className="opacity-0"
        >
            <div className="flex grow items-center">
                <span className=" ml-10 text-xl font-bold uppercase text-primary">
                    Bibliografía
                </span>
            </div>
            <div>
                <Table
                    path={path}
                    x="chart"
                    label="cuadro bibliográfico"
                    toMap={form.values.sections.bibliography.chart}
                    insertedItemFormat={{ author: '', title: '', year: '' }}
                    headers={[
                        {
                            x: 'author',
                            label: 'autor',
                        },
                        { x: 'title', label: 'titulo' },
                        { x: 'year', label: 'año' },
                    ]}
                />
            </div>
        </motion.div>
    )
}
