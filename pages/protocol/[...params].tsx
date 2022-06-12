import { ReactElement, useEffect, useRef, useState } from 'react'
import { Fragment } from 'react'
import { Popover } from '@headlessui/react'
import { Form } from '../../components/Protocol/Form'
import { Protocol, Section } from '../../config/types'
import Stepper from '../../components/Protocol/Stepper'
import { Button } from '../../components/Atomic/Button'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'


export default function ProtocolPage({
    section,
    protocolId,
    protocolLength
}: {
    section: Section,
    protocolId: number,
    protocolLength: number
}) {
    const router = useRouter()
    const [savedEvent, setSavedEvent] = useState(false)

    useEffect(() => {
      setTimeout(() => {
        console.log('setTimeout');
        
        setSavedEvent(false)
      }, 3000)
    }, [savedEvent])
    
    const updateSection = async (section:Section) => {
        console.log(section);
        
        const res = await fetch(`/api/section/${protocolId}/${section?.sectionId}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(section),
        })
        setSavedEvent(true)
    }
    return (
        <>
            <div className="-translate-y-8 text-4xl font-bold text-primary">
                Protocolo de investigación
            </div>{' '}
            <div className="flex h-full -translate-y-8 flex-col">
                <Stepper protocolLength={protocolLength} currentSection={section?.sectionId} />
                <Form section={section} updateSection={updateSection} />
                <div className="flex w-full justify-between px-8">
                    <Button
                        disabled={section?.sectionId === 1}
                        onClick={() => {
                            router.push(`/protocol/${protocolId}/${section?.sectionId - 1}`)
                        }}
                        className="h-8 w-8"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <Button
                        onClick={() =>
                            router.push(`/protocol/${protocolId}/${section?.sectionId + 1}`)
                        }
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useDebouncedValue } from '@mantine/hooks'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    console.log('params', ctx.params?.params);
    const [protocolId, sectionId] = ctx.params?.params as string[]

    const string = `${process.env.NEXTURL}/api/section/${protocolId}/${sectionId}`
    console.log(string);

    const data = await fetch(string).then((res) => res.json())
    console.log('*******FUNCIONA ESTO?*********', data);

    return {
        props: { ...data, protocolId }
    }
}
