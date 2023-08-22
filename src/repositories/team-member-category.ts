import { prisma } from '../utils/bd'
import type { RoleType, StateType } from '@utils/zod'
import { ROLE } from '@utils/zod'
import type { Protocol } from '@prisma/client'
import { cache } from 'react'

const createCategory = async (data: Protocol) => {
    try {
        const protocol = await prisma.protocol.create({
            data,
        })
        return protocol
    } catch (e) {
        return new Error('Error en la query createProtocol')
    }
}

export { createCategory }
