import { z } from 'zod'

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

const RoleSchema = z.enum([
    'RESEARCHER',
    'SECRETARY',
    'METHODOLOGIST',
    'SCIENTIST',
    'ADMIN',
])
export const ROLE = RoleSchema.Enum
export type RoleType = `${z.infer<typeof RoleSchema>}`

const StateSchema = z.enum([
    'NOT_CREATED',
    'DRAFT',
    'PUBLISHED',
    'METHODOLOGICAL_EVALUATION',
    'SCIENTIFIC_EVALUATION',
    'ACCEPTED',
    'ON_GOING',
])

export const STATE = StateSchema.Enum
export type StateType = `${z.infer<typeof StateSchema>}`

// Schema for Transitions between protocols
const ActionSchema = z.enum([
    'CREATE',
    'EDIT',
    'PUBLISH',
    'ASSIGN_TO_METHODOLOGIST',
    'ASSIGN_TO_SCIENTIFIC',
    'COMMENT',
    'ACCEPT', //This action is made by the secretary. Accept the protocol to be evalualuated by the VID committee
    'APPROVE', //This approval is made by the admin and approve the protocol and mark it as ON_GOING
])
export const ACTION = ActionSchema.Enum
export type ActionType = `${z.infer<typeof ActionSchema>}`

const AccessSchema = z.enum(['PROTOCOLS', 'USERS', 'REVIEWS', 'CONVOCATORIES'])
export const ACCESS = AccessSchema.Enum
export type AccessType = `${z.infer<typeof AccessSchema>}`

const ReviewTypeSchema = z.enum([
    'METHODOLOGICAL',
    'SCIENTIFIC_INTERNAL',
    'SCIENTIFIC_EXTERNAL',
])
export const REVIEW_TYPE = ReviewTypeSchema.Enum

const ReviewVerdictSchema = z.enum(['APPROVED', 'REJECTED', 'PENDING'])
export const REVIEW_VERDICT = ReviewVerdictSchema.Enum

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CONVOCATORY SCHEMA
/////////////////////////////////////////

export const ConvocatorySchema = z
    .object({
        id: z.string().optional(),
        createdAt: z.coerce.date().optional(),
        name: z.string(),
        from: z.coerce.date().min(new Date(-1), {
            message: 'La fecha no puede ser menor a la actual',
        }),
        to: z.coerce.date(),
        year: z
            .number({
                invalid_type_error: 'Este campo debe ser numérico',
            })
            .min(new Date().getFullYear(), {
                message: 'Debe ser igual o mayor al año actual',
            }),
    })
    .refine((data) => data.to > data.from, {
        message: 'No puede preceder a fecha desde',
        path: ['to'],
    })
export type Convocatory = z.infer<typeof ConvocatorySchema>
/////////////////////////////////////////
// PROTOCOL SCHEMA
/////////////////////////////////////////

export const ProtocolSchema = z.object({
    id: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    state: StateSchema,
    researcher: z.string(),
    sections: z.lazy(() => SectionsSchema),
    convocatoryId: z.string(),
})

// .optional() to export type to create a Form (from new object, has no assigned Id yet)
export type Protocol = z.infer<typeof ProtocolSchema>

/////////////////////////////////////////
// REVIEWS SCHEMA
/////////////////////////////////////////

export const ReviewSchema = z.object({
    id: z.string().optional(),
    type: ReviewTypeSchema,
    revised: z.boolean().default(false),
    verdict: ReviewVerdictSchema,
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    data: z.string(),
    protocolId: z.string(),
    reviewerId: z.string(),
})

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
    id: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    email: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    id_: z.string().nullable(),
    image: z.string().nullable(),
    lastLogin: z.coerce.date().nullable(),
    name: z.string().nullable(),
    password: z.string().nullable(),
    role: RoleSchema,
})

/////////////////////////////////////////
// PROTOCOL SECTIONS SCHEMA
/////////////////////////////////////////

export const SectionsSchema = z.object({
    bibliography: z.lazy(() => BibliographySchema),
    budget: z.lazy(() => BudgetSchema),
    description: z.lazy(() => DescriptionSchema),
    duration: z.lazy(() => DurationSchema),
    identification: z.lazy(() => IdentificationSchema),
    introduction: z.lazy(() => IntroductionSchema),
    methodology: z.lazy(() => MethodologySchema),
    publication: z.lazy(() => PublicationSchema),
})

export type Sections = z.infer<typeof SectionsSchema>

/////////////////////////////////////////
// PROTOCOL SECTIONS BIBLIOGRAPHY SCHEMA
/////////////////////////////////////////

export const BibliographySchema = z.object({
    chart: z
        .lazy(() =>
            z.object({
                author: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vació' }),
                title: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vació' }),
                year: z
                    .number({
                        invalid_type_error: 'Este campo debe ser numérico',
                    })
                    .max(new Date().getFullYear(), {
                        message: 'No puede ser mayor al año actual',
                    }),
            })
        )
        .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS BUDGET SCHEMA
/////////////////////////////////////////

export const BudgetSchema = z.object({
    expenses: z
        .lazy(() =>
            z.object({
                type: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
                data: z
                    .object({
                        detail: z.string().min(1, {
                            message: 'El campo no puede estar vacío',
                        }),
                        amount: z
                            .number({
                                invalid_type_error:
                                    'Este campo debe ser numérico',
                            })
                            .positive({ message: 'Debe ser mayor que cero' }),
                        year: z.string().min(1, {
                            message: 'El campo no puede estar vacío',
                        }),
                    })
                    .array(),
            })
        )
        .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS DESCRIPTION SCHEMA
/////////////////////////////////////////

export const DescriptionSchema = z.object({
    discipline: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    field: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    line: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    technical: z
        .string()
        .min(500, {
            message:
                'El resumen técnico debe contener entre 150 - 250 palabras',
        })
        .max(1000, {
            message:
                'El resumen técnico debe contener entre 150 - 250 palabras',
        }),
    objective: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    type: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    words: z.string().min(1, { message: 'El campo no puede estar vacío' }),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS DURATION SCHEMA
/////////////////////////////////////////

export const DurationSchema = z.object({
    duration: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    modality: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    chronogram: z
        .lazy(() =>
            z.object({
                semester: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
                data: z
                    .object({
                        task: z.string().min(1, { message: 'Cannot be empty' }),
                    })
                    .array(),
            })
        )
        .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS IDENTIFICATION SCHEMA
/////////////////////////////////////////

export const IdentificationSchema = z.object({
    assignment: z.string().optional(),
    career: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    sponsor: z.string().array(),
    title: z.string().min(6, { message: 'Debe tener al menos 6 caracteres' }),
    team: z
        .lazy(() =>
            z.object({
                hours: z
                    .number({
                        invalid_type_error: 'Este campo debe ser numérico',
                    })
                    .min(1, {
                        message: 'Debe ser un numero positivo',
                    })
                    .max(400, {
                        message: 'No se pueden asignar tantas horas',
                    }),
                last_name: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
                name: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
                role: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
            })
        )
        .array()
        .min(1, { message: 'Debe tener al menos un integrante' })
        .refine((value) => {
            //Al menos un integrante debe tener el rol de Director,
            const hasDirector = value.some(team => team.role === 'Director')
            console.log(hasDirector);

            if (!hasDirector) return false
            return true
        }, { message: 'Debe tener al menos un Director' })

})

/////////////////////////////////////////
// PROTOCOL SECTIONS INTRODUCTION SCHEMA
/////////////////////////////////////////

export const IntroductionSchema = z.object({
    justification: z
        .string()
        .min(1, { message: 'El campo no puede estar vacío' }),
    objectives: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    problem: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    state: z.string().min(1, { message: 'El campo no puede estar vacío' }),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS METHODOLOGY SCHEMA
/////////////////////////////////////////

export const MethodologySchema = z.object({
    analysis: z
        .string()
        .min(1, { message: 'El campo no puede estar vacío' })
        .nullable(),
    considerations: z
        .string()
        .min(1, { message: 'El campo no puede estar vacío' })
        .nullable(),
    design: z
        .string()
        .min(1, { message: 'El campo no puede estar vacío' })
        .nullable(),
    instruments: z
        .string()
        .min(1, { message: 'El campo no puede estar vacío' })
        .nullable(),
    participants: z
        .string()
        .min(1, { message: 'El campo no puede estar vacío' })
        .nullable(),
    place: z
        .string()
        .min(1, { message: 'El campo no puede estar vacío' })
        .nullable(),
    procedures: z
        .string()
        .min(1, { message: 'El campo no puede estar vacío' })
        .nullable(),
    detail: z
        .string()
        .min(1, { message: 'El campo no puede estar vacío' })
        .nullable(),
    type: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    humanAnimalOrDb: z.boolean().nullable(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS PUBLICATION SCHEMA
/////////////////////////////////////////

export const PublicationSchema = z.object({
    title: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    result: z.string().min(1, { message: 'El campo no puede estar vacío' }),
})
