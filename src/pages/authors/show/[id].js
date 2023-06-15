import AppLayout from '@/components/Layouts/AppLayout'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import PreviousLink from '@/components/PreviousLink'

const Show = () => {
    const router = useRouter()
    const [full_name, setFullName] = useState('')
    const [birth_date, setBirthDate] = useState('')
    const [country, setCountry] = useState('')
    useEffect(() => {
        if (router.isReady) {
            axios
                .get(`/api/authors/${router.query.id}`)
                .then(res => {
                    setFullName(res.data.author.full_name)
                    setBirthDate(FormatDate(res.data.author.birth_date))
                    setCountry(res.data.author.country)
                })
                .catch(error => {
                    if (error.response.status !== 409) throw error
                })
        }
    }, [router.isReady])

    function FormatDate(data) {
        const date = new Date(data.replace(/-/g, '\/'))
        const options = { year: "numeric", month: "2-digit", day: "2-digit" }
        return date.toLocaleDateString('es-MX', options)
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Ver Autor
                </h2>
            }>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between py-3">
                                <div>
                                    <h3><strong>{full_name}</strong></h3>
                                    <p><strong>Fecha Nacimiento:</strong> {birth_date}</p>
                                    <p><strong>País:</strong> {country}</p>
                                    <div className="flex justify-end ">
                                        <PreviousLink href="/authors"></PreviousLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </AppLayout >
    )
}

export default Show