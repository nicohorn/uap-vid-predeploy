import React, { useEffect } from 'react'
import ItemView from '../../components/Atomic/ProtocolItemView'
import { GetServerSideProps } from 'next'
import { Input, Protocol, Section } from '../../config/types'

export default function projects({ protocols }: any) {
    return (
        <div className="transition-all duration-200">
            <div className="-translate-y-12 text-4xl font-bold text-primary">
                Lista de proyectos de investigación
            </div>
            <div className="mx-auto mb-20 flex max-w-[1280px] flex-col justify-center px-20 py-10">
                {protocols.map((item: Protocol) => (
                    <div key={item._id} className="mt-5">
                        {/* Se busca del protocolo solo la primera seccion, que tiene los datos de identirficacion */}
                        {item.data && item.data[0] ? (
                            <ItemView
                                dateOfCreation={item.createdAt}
                                identification={item.data[0]}
                                _id={item._id}
                            ></ItemView>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const string = `${process.env.NEXTURL}/api/protocol/`
    const data = await fetch(string).then((res) => res.json())
    const protocols = data
        .map((p: Protocol) => {
            return p.data[0].data.every((x: Input) => x.value) ? p : null
        })
        .filter(Boolean)
    return {
        props: { protocols: protocols },
    }
}