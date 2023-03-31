'use client'
import { ProtocolProvider, useProtocol } from 'utils/createContext'
import { Check, ChevronLeft, ChevronRight, X } from 'tabler-icons-react'
import { useNotifications } from '@mantine/notifications'
import { Button } from '@elements/button'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { zodResolver } from '@mantine/form'
import { Protocol as ProtocolZod, ProtocolSchema } from '@utils/zod'
import { Protocol } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { SegmentedControl } from '@mantine/core'
import { motion } from 'framer-motion'
import {
    IdentificationForm,
    DurationForm,
    BudgetForm,
    DescriptionForm,
    IntroductionForm,
    MethodologyForm,
    PublicationForm,
    BibliographyForm,
} from '@protocol/form-sections'

const sectionMapper: { [key: number]: JSX.Element } = {
    0: <IdentificationForm />,
    1: <DurationForm />,
    2: <BudgetForm />,
    3: <DescriptionForm />,
    4: <IntroductionForm />,
    5: <MethodologyForm />,
    6: <PublicationForm />,
    7: <BibliographyForm />,
}

export default function ProtocolForm({ protocol }: { protocol: ProtocolZod }) {
    const router = useRouter()
    const path = usePathname()
    const [section, setSection] = useState(path?.split('/')[3])
    const notifications = useNotifications()
    const [isPending, startTransition] = useTransition()

    const form = useProtocol({
        initialValues:
            path?.split('/')[2] === 'new' &&
            localStorage.getItem('temp-protocol')
                ? JSON.parse(localStorage.getItem('temp-protocol')!)
                : protocol,
        validate: zodResolver(ProtocolSchema),
        validateInputOnChange: true,
    })

    useEffect(() => {
        // Validate if not existing path goes to section 0
        if (
            !['0', '1', '2', '3', '4', '5', '6', '7'].includes(
                path?.split('/')[3]!
            )
        )
            router.push('/protocols/' + path?.split('/')[2] + '/0')
    }, [path])

    const upsertProtocol = useCallback(async (protocol: ProtocolZod) => {
        // flow for protocols that don't have ID
        if (!protocol.id) {
            const res = await fetch(`/api/protocol`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(protocol),
            })
            const { id }: Protocol = await res.json()

            if (res.status === 200) {
                notifications.showNotification({
                    title: 'Protocolo creado',
                    message: 'El protocolo ha sido creado con éxito',
                    color: 'teal',
                    icon: <Check />,
                    radius: 0,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
            }
            return router.push(`/protocols/${id}/${section}`)
        }
        const res = await fetch(`/api/protocol/${protocol.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(protocol),
        })

        if (res.status === 200) {
            notifications.showNotification({
                title: 'Protocolo guardado',
                message: 'El protocolo ha sido guardado con éxito',
                color: 'teal',
                icon: <Check />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
            startTransition(() => {
                router.refresh()
            })
        }
    }, [])

    return (
        <ProtocolProvider form={form}>
            <form
                onBlur={() => {
                    path?.split('/')[2] === 'new' &&
                    typeof window !== 'undefined'
                        ? localStorage.setItem(
                              'temp-protocol',
                              JSON.stringify(form.values)
                          )
                        : null
                }}
                onSubmit={(e) => {
                    e.preventDefault()
                    // Enforce validity only on first section to Save
                    if (!form.isValid('sections.identification')) {
                        notifications.showNotification({
                            title: 'No se pudo guardar',
                            message:
                                'Debes completar la sección "Identificación" para poder guardar un borrador',
                            color: 'red',
                            icon: <X />,
                            radius: 0,
                            style: {
                                marginBottom: '.8rem',
                            },
                        })
                        return form.validate()
                    }
                    typeof window !== 'undefined'
                        ? localStorage.removeItem('temp-protocol')
                        : null
                    upsertProtocol(form.values)
                }}
                className="w-full px-4"
            >
                <motion.div
                    initial={{ opacity: 0, y: -7 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="mx-auto my-6 w-fit max-w-full overflow-auto py-2"
                >
                    <SegmentedControl
                        value={section}
                        onChange={setSection}
                        data={[
                            { label: 'Identificación', value: '0' },
                            { label: 'Duración', value: '1' },
                            { label: 'Presupuesto', value: '2' },
                            { label: 'Descripción', value: '3' },
                            { label: 'Introducción', value: '4' },
                            { label: 'Metodología', value: '5' },
                            { label: 'Publicación', value: '6' },
                            { label: 'Bibliografía', value: '7' },
                        ]}
                        classNames={{
                            root: 'bg-gray-50 border rounded',
                            label: 'uppercase text-xs px-2 py-1 font-light',
                            indicator: 'bg-primary font-semibold',
                        }}
                        color="blue"
                        transitionDuration={300}
                    />
                </motion.div>

                {sectionMapper[Number(section)]}

                <div className="mb-8 mt-12 flex w-full justify-between">
                    <Button
                        type="button"
                        intent="secondary"
                        disabled={section === '0'}
                        onClick={() =>
                            setSection((p) => (Number(p) - 1).toString())
                        }
                    >
                        <ChevronLeft className="h-5" />
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            intent="secondary"
                            disabled={isPending}
                        >
                            Guardar
                        </Button>
                    </div>
                    <Button
                        type="button"
                        intent="secondary"
                        disabled={section === '7'}
                        onClick={() =>
                            setSection((p) => (Number(p) + 1).toString())
                        }
                    >
                        <ChevronRight className="h-5" />
                    </Button>
                </div>
            </form>
        </ProtocolProvider>
    )
}