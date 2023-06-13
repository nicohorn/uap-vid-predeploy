import Link from 'next/link'
import { Button } from '@elements/button'
import { getAllUsers, totalUserRecords } from '@repositories/user'
import { PageHeading } from '@layout/page-heading'
import { UserPlus } from 'tabler-icons-react'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { canAccess } from '@utils/scopes'
import { redirect } from 'next/navigation'
import UserTable from '@user/user-table'
import Pagination from '@elements/pagination'

export default async function UserList({
    searchParams,
}: {
    searchParams?: { [key: string]: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) return
    if (!canAccess('USERS', session.user.role)) redirect('/protocols')
    const shownRecords = 5
    const users = await getAllUsers(
        shownRecords,
        Number(searchParams?.page) || 1
    )
    const userCount = await totalUserRecords()

    return (
        <>
            <PageHeading title="Lista de usuarios" />
            <div className="flex flex-row-reverse">
                <Link href={'/users/new'} passHref>
                    <Button intent="secondary">
                        <UserPlus className="h-5" />
                        <span className="ml-3"> Nuevo usuario</span>
                    </Button>
                </Link>
            </div>

            <UserTable users={users!} />
            <Pagination
                url="/users"
                pageParams={Number(searchParams?.page) || 1}
                count={userCount!}
                shownRecords={shownRecords}
            />
        </>
    )
}
