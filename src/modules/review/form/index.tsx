'use client'
import { Button } from '@elements/Button'
import { useForm } from '@mantine/form'
import { useCallback } from 'react'
import { zodResolver } from '@mantine/form'
import { ReviewSchema } from '@utils/zod'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Review } from '@prisma/client'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'
import ReviewVerdictsDictionary from '@utils/dictionaries/ReviewVerdictsDictionary'
const Tiptap = dynamic(() => import('@elements/TipTap'))

export default function ReviewForm({ review }: { review: Review }) {
    const router = useRouter()
    const form = useForm<Review>({
        initialValues: review,
        validate: zodResolver(ReviewSchema),
        validateInputOnChange: true,
    })
    const notifications = useNotifications()

    const addReview = useCallback(async (comment: string) => {
        const res = await fetch(`/api/reviews/${review.id}`, {
            method: 'PUT',
            body: JSON.stringify(comment),
        })
        if (res.status == 200) {
            notifications.showNotification({
                title: 'Revision publicada',
                message: 'Tu revision fue correctamente publicada.',
                color: 'teal',
                icon: <Check />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
            form.reset()
            router.refresh()
        } else {
            notifications.showNotification({
                title: 'Ocurrió un error',
                message: 'Hubo un problema al publicar tu revision.',
                color: 'red',
                icon: <X />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
        }
        console.log(res)
    }, [])

    return (
        <form
            className="w-[27rem] p-2"
            onSubmit={form.onSubmit(
                (values) => console.log(values),
                (errors) => console.log(errors)
            )}
        >
            <label className="label">Comentario</label>
            <Tiptap {...form.getInputProps('data')} />
            {form.getInputProps('data').error ? (
                <p className=" pt-1 pl-3 text-xs text-gray-600 saturate-[80%]">
                    *{form.getInputProps('data').error}
                </p>
            ) : null}

            <RadioGroup
                {...form.getInputProps('verdict')}
                defaultValue="PENDING"
            >
                <RadioGroup.Label className="label">Veredicto</RadioGroup.Label>
                <div className="-space-y-px">
                    {Object.entries(ReviewVerdictsDictionary).map(
                        ([id, name], index) => (
                            <RadioGroup.Option
                                key={id}
                                value={id}
                                className={({ checked }) =>
                                    clsx(
                                        index === 0
                                            ? 'rounded-tl rounded-tr'
                                            : '',
                                        index ===
                                            Object.keys(
                                                ReviewVerdictsDictionary
                                            ).length -
                                                1
                                            ? 'rounded-bl rounded-br'
                                            : '',
                                        checked
                                            ? 'z-10 border-primary/30 bg-gray-50'
                                            : 'border-gray-200',
                                        'relative flex cursor-pointer items-baseline border px-5 py-2.5 focus:outline-none'
                                    )
                                }
                            >
                                {({ active, checked }) => (
                                    <>
                                        <span
                                            className={clsx(
                                                checked
                                                    ? 'border-transparent bg-primary'
                                                    : 'border-gray-300 bg-white',
                                                active
                                                    ? 'ring-2 ring-primary ring-offset-1'
                                                    : '',
                                                'flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border'
                                            )}
                                            aria-hidden="true"
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                        </span>
                                        <span className="ml-3 flex flex-col">
                                            <RadioGroup.Label
                                                as="span"
                                                className={clsx(
                                                    checked
                                                        ? 'font-medium text-gray-900'
                                                        : 'font-regular text-gray-700',
                                                    'block text-sm'
                                                )}
                                            >
                                                {name}
                                            </RadioGroup.Label>
                                            <RadioGroup.Description
                                                as="span"
                                                className={clsx(
                                                    checked
                                                        ? 'text-gray-700'
                                                        : 'text-gray-500',
                                                    'block text-xs'
                                                )}
                                            >
                                                {id === 'PENDING'
                                                    ? 'Enviar correcciones sin veredicto, esperar cambios para re-evaluar.'
                                                    : id === 'APPROVED'
                                                    ? 'Hacer devolución del proyecto como válido y apto para continuar el proceso.'
                                                    : 'Marcar proyecto como rechazado.'}
                                            </RadioGroup.Description>
                                        </span>
                                    </>
                                )}
                            </RadioGroup.Option>
                        )
                    )}
                </div>
            </RadioGroup>

            <Button type="submit" className="mt-2 ml-auto" intent="terciary">
                Comentar
            </Button>
        </form>
    )
}
