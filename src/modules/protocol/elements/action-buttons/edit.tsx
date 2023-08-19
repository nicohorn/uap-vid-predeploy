'use client'
import { buttonStyle } from '@elements/button/styles'
import type { Review, User } from '@prisma/client'
import { canExecute } from '@utils/scopes'
import type { StateType } from '@utils/zod'
import { ACTION } from '@utils/zod'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Edit } from 'tabler-icons-react'

type ActionButtonTypes = {
    user: User
    researcherId: string
    state: StateType
    id: string
    reviews: Review[]
}

export default function EditButton(props: ActionButtonTypes) {
    const path = usePathname()

    if (path?.split('/')[3]) return <></>
    if (
        !canExecute(
            props.user.id === props.researcherId
                ? ACTION.EDIT_BY_OWNER
                : ACTION.EDIT,
            props.user.role,
            props.state
        ) ||
        (props.reviews.length > 2 &&
            props.reviews.every((r) => r.verdict === 'APPROVED'))
    )
        return <></>
    return (
        <Link
            href={`/protocols/${props.id}/0`}
            className={buttonStyle('secondary')}
            passHref
        >
            <Edit className="h-5 text-current" />
            Editar
        </Link>
    )
}
