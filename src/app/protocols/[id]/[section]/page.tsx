import { Heading } from '@layout/Heading'
import ProtocolForm from '@protocol/Form'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({
    params,
}: {
    params: { id: string; section: string }
}) {
    const protocol = await findProtocolById(params.id)
    const session = await getServerSession(authOptions)
    if (!protocol) redirect('/protocols')
    if (!canExecute('EDIT', session?.user?.role!, protocol?.state!))
        redirect('/protocols')

    return (
        <>
            <Heading
                title={
                    <span>
                        Protocolo:{' '}
                        <span className="font-light">
                            {protocol.sections.identification.title}
                        </span>
                    </span>
                }
            />
            <ProtocolForm
                protocol={protocol}
                currentSection={Number(params.section) ?? 0}
            />
        </>
    )
}
