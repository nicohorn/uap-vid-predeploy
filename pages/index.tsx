import type { ReactElement } from 'react'
import Layout from '../components/Layout'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Form } from '../components/Protocol/Form'

export default function Page() {
    return (
        <>
            {' '}
            <div className="text-primary -translate-y-8 text-4xl font-bold">
                Inicio
            </div>
            <div className="-translate-y-8 p-10">
                <div className="text-primary font-bold">
                    <a href="/protocol/p">Nuevo proyecto de investigación</a>
                </div>
            </div>
        </>
    )
}

// ! If need use for custom per page layout
// Page.getLayout = function getLayout(page: ReactElement) {
//     return <NestedLayout>{page}</NestedLayout>
// }
