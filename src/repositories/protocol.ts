import { prisma } from '../utils/bd'
import type { RoleType, StateType } from '@utils/zod'
import { ROLE } from '@utils/zod'
import type { Protocol } from '@prisma/client'
import { cache } from 'react'
import { getAcademicUnitsByUserId } from './academic-unit'
import { orderByQuery } from '@utils/query-helper/orderBy'
import { Prisma } from '@prisma/client'

const findProtocolByIdWithResearcher = cache(
    async (id: string) =>
        await prisma.protocol.findUnique({
            where: {
                id,
            },
            include: {
                researcher: { select: { id: true, name: true, email: true } },
                convocatory: { select: { id: true, name: true } },
            },
        })
)
const findProtocolById = cache(
    async (id: string) =>
        await prisma.protocol.findUnique({
            where: {
                id,
            },
        })
)

const getResearcherEmailByProtocolId = cache(async (id: string) => {
    try {
        return await prisma.protocol.findUnique({
            select: {
                researcher: {
                    select: {
                        email: true,
                    },
                },
            },
            where: {
                id,
            },
        })
    } catch (e) {
        return null
    }
})

const updateProtocolById = async (id: string, data: Protocol) =>
    await prisma.protocol.update({
        where: {
            id,
        },
        data,
    })

const updateProtocolStateById = async (id: string, state: StateType) => {
    try {
        const protocol = await prisma.protocol.update({
            where: {
                id,
            },
            data: {
                state: state,
            },
        })
        return protocol
    } catch (e) {
        return null
    }
}

const createProtocol = async (data: Protocol) => {
    try {
        const protocol = await prisma.protocol.create({
            data,
        })
        return protocol
    } catch (e) {
        return null
    }
}

const getAllProtocols = cache(async () => {
    try {
        return await prisma.protocol.findMany()
    } catch (e) {
        return null
    }
})

const getProtocolsByRol = cache(
    async (
        role: RoleType,
        id: string,
        {
            records = '5',
            page = '1',
            search,
            sort,
            order,
            filter,
            values,
        }: { [key: string]: string }
    ) => {
        if (!id) throw Error('No ID passed')

        // Pagination reusable
        const [skip, take] = [
            Number(records) * (Number(page) - 1),
            Number(records),
        ]
        // Select model reusable
        const select = {
            id: true,
            state: true,
            createdAt: true,
            convocatory: { select: { id: true, name: true, year: true } },
            researcher: {
                select: { id: true, name: true, role: true, email: true },
            },
            reviews: {
                select: {
                    id: true,
                    updatedAt: true,
                    type: true,
                    verdict: true,
                    reviewer: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                            email: true,
                        },
                    },
                },
            },
            sections: {
                select: {
                    identification: true,
                    duration: { select: { modality: true, duration: true } },
                },
            },
        }

        // orderBy reusable using the helper function
        const orderBy =
            order && sort ? orderByQuery(sort, order) : { createdAt: 'desc' }

        // Search reusable
        const whereSearch = search
            ? {
                  OR: [
                      {
                          sections: {
                              is: {
                                  identification: {
                                      is: {
                                          title: {
                                              contains: search,
                                              mode: Prisma.QueryMode
                                                  .insensitive,
                                          },
                                      },
                                  },
                              },
                          },
                      },
                      {
                          sections: {
                              is: {
                                  duration: {
                                      is: {
                                          modality: {
                                              contains: search,
                                              mode: Prisma.QueryMode
                                                  .insensitive,
                                          },
                                      },
                                  },
                              },
                          },
                      },
                      { researcher: { name: { contains: search } } },
                  ],
              }
            : {}
        // filter reusable
        const whereFilter =
            filter && values ? { [filter]: { in: values.split('-') } } : {}

        const queryBuilder = async () => {
            const query = {
                [ROLE.RESEARCHER]: prisma.$transaction([
                    prisma.protocol.count({
                        where: {
                            AND: [
                                // According to business logic
                                { researcherId: id },
                                // According to table features (search, filter)
                                whereSearch,
                                whereFilter,
                            ],
                            NOT: { state: 'DELETED' },
                        },
                    }),
                    prisma.protocol.findMany({
                        skip,
                        take,
                        select,
                        orderBy,
                        where: {
                            AND: [
                                // According to business logic
                                { researcherId: id },
                                // According to table features (search, filter)
                                whereSearch,
                                whereFilter,
                            ],
                            NOT: { state: 'DELETED' },
                        },
                    }),
                ]),
                [ROLE.METHODOLOGIST]: prisma.$transaction([
                    prisma.protocol.count({
                        where: {
                            AND: [
                                {
                                    // Business logic
                                    OR: [
                                        {
                                            researcherId: id,
                                        },
                                        {
                                            reviews: {
                                                some: { reviewerId: id },
                                            },
                                        },
                                    ],
                                },
                                // Table feature
                                whereSearch,
                                whereFilter,
                            ],
                            NOT: { state: 'DELETED' },
                        },
                    }),
                    prisma.protocol.findMany({
                        skip,
                        take,
                        select,
                        orderBy,
                        where: {
                            AND: [
                                {
                                    // Business logic
                                    OR: [
                                        {
                                            researcherId: id,
                                        },
                                        {
                                            reviews: {
                                                some: { reviewerId: id },
                                            },
                                        },
                                    ],
                                },
                                // Table feature
                                whereSearch,
                                whereFilter,
                            ],
                            NOT: { state: 'DELETED' },
                        },
                    }),
                ]),
                [ROLE.SCIENTIST]: prisma.$transaction([
                    prisma.protocol.count({
                        where: {
                            AND: [
                                // Business logic
                                {
                                    reviews: {
                                        some: { reviewerId: id },
                                    },
                                },
                                whereSearch,
                                whereFilter,
                            ],

                            NOT: { state: 'DELETED' },
                        },
                    }),
                    prisma.protocol.findMany({
                        skip,
                        take,
                        select,
                        orderBy,
                        where: {
                            AND: [
                                // Business logic
                                {
                                    reviews: {
                                        some: { reviewerId: id },
                                    },
                                },
                                whereSearch,
                                whereFilter,
                            ],

                            NOT: { state: 'DELETED' },
                        },
                    }),
                ]),
                [ROLE.ADMIN]: prisma.$transaction([
                    prisma.protocol.count({
                        where: {
                            AND: [whereSearch, whereFilter],
                        },
                    }),
                    prisma.protocol.findMany({
                        skip,
                        take,
                        select,
                        where: {
                            AND: [whereSearch, whereFilter],
                        },
                        orderBy,
                    }),
                ]),
            }

            if (role === ROLE.SECRETARY) {
                const academicUnits = await getAcademicUnitsByUserId(id)
                return prisma.$transaction([
                    prisma.protocol.count({
                        where: {
                            AND: [
                                // Business logic
                                {
                                    OR: [
                                        {
                                            researcherId: id,
                                        },
                                        {
                                            sections: {
                                                is: {
                                                    identification: {
                                                        is: {
                                                            sponsor: {
                                                                hasSome:
                                                                    academicUnits?.map(
                                                                        (e) =>
                                                                            e.name
                                                                    ),
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                                whereSearch,
                                whereFilter,
                            ],

                            NOT: { state: 'DELETED' },
                        },
                    }),
                    prisma.protocol.findMany({
                        skip,
                        take,
                        select,
                        orderBy,
                        where: {
                            AND: [
                                // Business logic
                                {
                                    OR: [
                                        {
                                            researcherId: id,
                                        },
                                        {
                                            sections: {
                                                is: {
                                                    identification: {
                                                        is: {
                                                            sponsor: {
                                                                hasSome:
                                                                    academicUnits?.map(
                                                                        (e) =>
                                                                            e.name
                                                                    ),
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                                whereSearch,
                                whereFilter,
                            ],

                            NOT: { state: 'DELETED' },
                        },
                    }),
                ])
            }
            return query[role]
        }

        try {
            return await queryBuilder()
        } catch (error) {
            return []
        }
    }
)

export {
    findProtocolById,
    findProtocolByIdWithResearcher,
    updateProtocolById,
    createProtocol,
    getAllProtocols,
    updateProtocolStateById,
    getProtocolsByRol,
    getResearcherEmailByProtocolId,
}
