import { useEffect, useState } from "react";
import { authorAPI } from "@/hooks/author";
import axios from "@/lib/axios"
import Head from 'next/head'
import Router from "next/router";
import Button from "@/components/Button";
import AppLayout from "@/components/Layouts/AppLayout";
import toast, { Toaster } from 'react-hot-toast';
import ViewLink from '@/components/ViewLink';
import EditLink from "@/components/EditLink";
import DeleteButton from "@/components/DeleteButton";
import ProfileLink from "../ProfileLink";
import NoteLink from "@/components/NoteLink";
import Star from "@/components/Star"
import NotStar from "@/components/NotStar";
import RatingLink from "@/components/RatingLink";
import FormDate from "@/components/FormaDate";

const Index = () => {
    const { destroy } = authorAPI()
    const [authors, setAuthors] = useState([])

    useEffect(() => {
        axios
            .get('/api/authors')
            .then(res => {
                //console.table(res.data);
                setAuthors(res.data)
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }, [])

    function destroyItem(id) {
        if (confirm('Seguro que deseas eleminar el registro?')) {
            destroy(id)
            setAuthors([...authors.filter((author) => author.id !== id)])
        }
    }

    /**
     * Esta funcion se convertio en un componente 
     * 
    function FormDate(data) {
        const date = new Date(data.replace(/-/g, '\/'))
        const option = { year: "numeric", month: "2-digit", day: "2-digit" }
        return date.toLocaleDateString('es-MX', option)
    }
    */

    function averageStar(ratings) {
        let average = 0
        let count = 0
        ratings?.map((rating) => (
            average = average + parseInt(rating.number_star),
            count = count + 1
        ))
        if (count > 0) {
            return parseInt(average / count)
        }
        else {
            return parseInt(0)
        }
    }

    function numberStar(ratings) {
        let count = 0
        ratings?.map((rating) => (
            count = count + 1
        ))
        return parseInt(count)
    }

    const printPDF = async () => {
        const res = await axios.get('/api/authors/generateAutorPDF', { responseType: "blob"})
        const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
        window.open(url, '_blank')
    } 

        //PDF Autor con raiting
    const printPDFRaiting = async () => {
        const res = await axios.get('/api/authors/generateAutorPDFRaiting', { responseType: "blob"})
        const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
        window.open(url, '_blank') 
    }

    const exportExcel = async () => {
        const res = await axios.get(`/api/authors/generateExcel`, { responseType: "blob"})
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'Autores.xlsx')
        document.body.appendChild(link)
        link.click()
    }

    const exportExcelRaiting = async () => {
        const res = await axios.get(`/api/authors/generateExcelRaitings`, { responseType: "blob"})
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'AutoresRaitings.xlsx')
        document.body.appendChild(link)
        link.click()
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Autores
                </h2>
            }>
            <Head>
                <title>Autores</title>
            </Head>
            <div className="py-12">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div class="overflow-x-auto">
                            <Toaster />
                            <div className="flex space-x-2 justify-start">
                                <Button
                                    type="button"
                                    onClick={() => Router.push('/authors/create', '/authors/create')}>
                                    Nuevo Autor
                                </Button>

                                <Button
                                className="bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    printPDF()
                                }}>
                                Imprimir en PDF
                                </Button>
                                <Button
                                className="bg-black-600 hover:bg-black-700 focus:bg-black-700 active:bg-black-800"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    printPDFRaiting()
                                }}>
                                Imprimir PDF <br/> Raiting Autores
                                </Button>
                                <Button
                                className="bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800"
                                onClick={(e) => {
                                    e.stopPropagation()
                                        exportExcel()
                                    }}>
                                    Exportar a Excel <br/> Autores
                                    </Button>
                                    <Button
                                    className="bg-black-600 bg-black-600 hover:bg-black-700 focus:bg-black-700 active:bg-black-800"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                            exportExcelRaiting()
                                        }}>
                                        Exportar a Excel <br/> Libros Raiting
                                        </Button>
                            </div>
                            <table className="min-w-full">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                            Author
                                        </th>
                                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                            Fecha nacimiento
                                        </th>
                                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                            Pais
                                        </th>
                                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                            Puntuación
                                        </th>
                                        <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {authors?.map((author) => (
                                        <tr className="bg-white border-b" key={author.id}>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4">
                                                {author.full_name}
                                            </td>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4">
                                                {/* {FormDate(author.birth_date)} */}
                                                <FormDate data={author.birth_date} />
                                            </td>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4">
                                                {author.country}
                                            </td>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4">
                                                <ul className="flex justify-center">
                                                    {[...Array(averageStar(author.ratings))].map((star, index) => (
                                                        <Star key={index} className="w-4">
                                                        </Star>
                                                    ))}
                                                    {[...Array(5 - averageStar(author.ratings))].map((star, index) => (
                                                        <NotStar key={index} className="w-4">
                                                        </NotStar>
                                                    ))}
                                                    ({numberStar(author.ratings)})
                                                </ul>
                                            </td>
                                            <td className="flex space-x-2 text-sm text-gray-900 font-light px-6 py-4">
                                                <ViewLink href={{
                                                    pathname: '/authors/show/[id]', query: {
                                                        id:
                                                            author.id
                                                    }
                                                }} as={`/authors/show/${author.id}`}>
                                                </ViewLink>
                                                <EditLink href={{
                                                    pathname: `/authors/edit/[id]`, query: {
                                                        id:
                                                            author.id
                                                    }
                                                }} as={`/authors/edit/${author.id}`}>
                                                </EditLink>
                                                <ProfileLink href={{
                                                    pathname: `/authors/[id]/profile/create`,
                                                    query: { id: author.id }
                                                }} as={`/authors/${author.id}/profile/create`}>
                                                </ProfileLink>
                                                <NoteLink href={{
                                                    pathname: `/authors/[id]/notes`, query: {
                                                        id:
                                                            author.id
                                                    }
                                                }} as={`/authors/${author.id}/notes`}>
                                                </NoteLink>
                                                <RatingLink href={{ pathname: `/authors/[id]/ratings/create`, query: { id: author.id }
                                                }} as={`/authors/${author.id}/ratings/create`}>
                                                </RatingLink>
                                                <DeleteButton onClick={(e) => {
                                                    e.stopPropagation()
                                                    destroyItem(author.id)
                                                }}>
                                                </DeleteButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
export default Index