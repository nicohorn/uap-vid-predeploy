'use client'
import { useProtocolContext } from 'utils/createContext'
import full from 'config/careers.json'
import { motion } from 'framer-motion'
import Input from '@protocol/elements/form/Input'
import Select from '@protocol/elements/form/Select'
import List from '@protocol/elements/form/List'
import InfoTooltip from '@protocol/elements/form/InfoTooltip'
import MultipleSelect from '@protocol/elements/form/MultipleSelect'
import SectionTitle from '@protocol/elements/form/SectionTitle'

const careers = full.map((x) => x.career)
// conditional
const assignments = (v: any) =>
    full
        .filter((x) => x.career === v)
        .map((x) => x.assignment)
        .flat()

const sponsors = [
    'Facultad de Ciencias Económicas y de la Administración - FACEA',
    'Facultad de Ciencias de la Salud - FCS',
    'Facultad de Humanidades, Educación y Ciencias Sociales - FHECIS',
    'Facultad de Teología - FT',
    'Consejo Nacional de Investigaciones Científicas y Técnicas - CONICET',
    'Centro Interdisciplinario de Investigaciones en Ciencias de la Salud y del Comportamiento - CIICSAC',
    'Escuela de Graduados - EG',
]

export default function Identification() {
    const form = useProtocolContext()
    const path = 'sections.identification.'

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
        >
            <SectionTitle title="Identificación" />
            <>
                <Input path={path + 'title'} label="titulo" />
                <Select
                    path={path + 'career'}
                    options={careers}
                    label="carrera"
                    conditionalCleanup={() =>
                        (form.values.sections.identification.assignment = '')
                    }
                />
                <AssignmentInfo />
                <Select
                    path={path + 'assignment'}
                    label="materia"
                    options={assignments(
                        form.values.sections.identification.career
                    )}
                />
                <TeamInfo />
                <List
                    path={path + 'team'}
                    label="miembros de equipo"
                    toMap={form.values.sections.identification.team}
                    insertedItemFormat={{ role: '', name: '', hours: '' }}
                    headers={[
                        {
                            x: 'role',
                            label: 'rol',
                            options: [
                                'Director',
                                'Codirector',
                                'Investigador UAP',
                                'Investigador Externo UAP',
                                'Técnico Asistente',
                                'Técnico Asociado',
                                'Técnico Principal',
                                'Profesional Adjunto',
                                'Profesional Principal',
                                'Becario CONICET',
                            ],
                        },
                        {
                            x: 'last_name',
                            label: 'apellido',
                            class: 'flex-grow',
                        },
                        { x: 'name', label: 'nombre', class: 'flex-grow' },
                        {
                            x: 'hours',
                            label: 'horas',
                            class: 'flex-shrink w-32 text-right',
                        },
                    ]}
                />
                <MultipleSelect
                    path={path + 'sponsor'}
                    label="ente patrocinante"
                    options={sponsors}
                />
            </>
        </motion.div>
    )
}

const TeamInfo = () => (
    <InfoTooltip>
        <p>
            <b>Codirector:</b> En el caso de un proyecto tesis de posgrado,
            agregar el nombre del director o consejero.
        </p>
        <p>
            {' '}
            <b>Investigadores externos UAP:</b> Colaboradores adhonorem{' '}
        </p>
        <p>
            {' '}
            <b>Técnico y Profesionales:</b> Después de que el proyecto sea
            aprobado y asignados los técnicos y los profesionales becados,
            deberá adjuntar un archivo para justificar la participación y
            detallar exhaustivamente las actividades que llevará a cabo cada
            uno, junto con: Conocimientos previos requeridos. Datos personales:
            apellido y nombre, tipo y número de documento, dirección de correo
            electrónico y dirección postal. Estudios: cantidad de asignaturas
            regularizadas y aprobadas de la carrera en curso o título de las
            carreras de grado o posgrado terminadas. Cursos realizados. Becas
            obtenidas anteriormente. Idiomas: con qué idiomas puede trabajar y
            con qué nivel en cada caso. Carta escrita por el postulante en la
            que fundamente la solicitud de la beca.
        </p>
    </InfoTooltip>
)

const AssignmentInfo = () => (
    <InfoTooltip>
        <p>
            <b>Materia:</b> La materia debe estar relacionada al a
            investigación, sino, dejar en blanco.
        </p>
    </InfoTooltip>
)
