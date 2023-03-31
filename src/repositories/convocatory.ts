import { cache } from 'react'
import { prisma } from 'utils/bd'

export const getAllConvocatories = cache(async () => {
    try {
        return await prisma.convocatory.findMany()
    } catch (e) {
        return null
    }
})
export const getCurrentConvocatory = cache(async () => {
    try {
        return await prisma.convocatory.findFirst({
            where: {
                year: {
                    equals: new Date().getFullYear(),
                },
            },
        })
    } catch (e) {
        return null
    }
})