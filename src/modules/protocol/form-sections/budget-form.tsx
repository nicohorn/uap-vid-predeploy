'use client'
import { useProtocolContext } from 'utils/createContext'
import { motion } from 'framer-motion'
import InfoTooltip from '@protocol/elements/tooltip'
import SectionTitle from '@protocol/elements/form-section-title'
import { InputList } from '@protocol/elements/inputs/input-list'

export function BudgetForm() {
    const form = useProtocolContext()
    const path = 'sections.budget.'

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
        >
            <SectionTitle title="Presupuesto de gastos directos" />
            <>
                <Info />
                <InputList
                    path={path + 'expenses'}
                    label="gastos"
                    newLeafItemValue={{
                        detail: '',
                        amount: 0,
                        year: '',
                    }}
                    preprocessKey="type"
                    headers={[
                        { x: 'detail', label: 'detalle', class: 'flex-grow' },
                        {
                            x: 'amount',
                            label: 'monto',
                            currency: true,
                        },
                        {
                            x: 'year',
                            label: 'año',
                            options: years(
                                form.values.sections.duration.duration
                            ),
                        },
                    ]}
                    footer={<div className='flex gap-2 py-4 ml-auto w-fit text-xl mr-4'><p className='text-gray-400'>Total: </p> ${form.values.sections.budget.expenses.reduce((acc, val) => {
                        return (
                            acc +
                            val.data.reduce((prev, curr) => {
                                
                                if(isNaN(curr.amount)) curr.amount = 0
                                else curr.amount
                                return prev + curr.amount;
                            }, 0) 
                        )
                    }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</div>}
                />
                
            </>
        </motion.div>
    )
}

const Info = () => (
    <InfoTooltip>
        Debe detallar todos los insumos y sus costos. Aquellos insumos que
        fueren adquiridos a través del presupuesto asignado por la UAP, una vez
        concluido el proyecto, deberán ser entregados en la VID para que esta
        defina el destino que se les dará.
        <p>
            Recuerde que, al solicitar reintegros por gastos directos de
            investigación, se aprobarán solo aquellos que figuren en el
            presupuesto que presente en este protocolo, por lo que se solicita
            que detalle de manera exhaustiva los rubros que considere
            pertinentes, por ejemplo: insumos de laboratorio, libros,
            fotocopias, materiales de impresión, correo postal, artículos de
            librería, papelería, viajes, test, traducciones, publicación, etc.
        </p>{' '}
        <p>
            Para tener derecho al reembolso de cualquier otro gasto que no esté
            contemplado dentro del presupuesto original, deberá presentar la
            solicitud al secretario de investigación de la unidad académica para
            que este gestione la autorización de la Vicerrectoría de
            Investigación y Desarrollo. Si el investigador efectuara el gasto
            sin contar con dicha autorización, no podrá exigir su reembolso.
        </p>
    </InfoTooltip>
)

const years = (v: string) => {
    const yearQuantity = Number(v.substring(0, 2)) / 12
    const currentYear = new Date().getFullYear()
    const years: string[] = [String(currentYear)]
    for (let i = 0; i < yearQuantity; i++) {
        years.push(String(currentYear + i + 1))
    }
    return years
}
