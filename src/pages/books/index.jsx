import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Router from 'next/router'
import Button from '@/components/Button'
import ViewLink from '@/components/ViewLink'
import EditLink from '@/components/EditLink'
import { bookAPI } from '@/hooks/book'
import DeleteButton from '@/components/DeleteButton'
import Star from '@/components/Star'
import NotStar from '@/components/NotStar'
import NoteLink from "@/components/NoteLink"
import RatingLink from "@/components/RatingLink"
import FormDate from '@/components/FormaDate'
import toast, { Toaster } from 'react-hot-toast';

const Index = () => {
    const [books, setBooks] = useState([])
    const { destroy } = bookAPI()

    useEffect(() => {
        axios
            .get('/api/books')
            .then(res => {
                setBooks(res.data)
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }, [])

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

    function destroyItem(id) {
        if (confirm('¿Seguro que desea eliminar el libro?')) {
            destroy(id)
            setBooks([...books.filter((book) => book.id !== id)])
        }
    }

    const printPDF = async () => {
        const res = await axios.get('/api/books/generatebookpdf', { responseType: "blob"})
        const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
        window.open(url, '_blank')
    }

    const printPDFRaiting = async () => {
        const res = await axios.get('/api/books/generatebookpdfraiting', { responseType: "blob"})
        const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
        window.open(url, '_blank') 
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Libros
                </h2>
            }>
            <Head>
                <title>Laravel - Book</title>
            </Head>
            <Toaster />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div class="overflow-x-auto">
                                <div className="flex space-x-2 justify-start">
                                    <Button
                                        type="button"
                                        onClick={() => Router.push('/books/create', '/books/create')}>
                                        Nuevo Libro
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
                                    Imprimir PDF <br/> Raiting Libros
                                    </Button>
                                </div>
                                <table className="min-w-full">
                                    <thead className="border-b bg-gray-50">
                                        <tr>
                                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                                Libro
                                            </th>
                                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                                Lenguaje
                                            </th>
                                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                                Nº Páginas
                                            </th>
                                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4">
                                                Fecha Publicación
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
                                        {books?.map((book) => (
                                            <tr className="bg-white border-b" key={book.id}>
                                                <td className="text-sm text-gray-900 font-light px-6 py-4">
                                                    <h3>{book.title}</h3>
                                                    <p>{book.subtitle}</p>
                                                </td>
                                                <td className="text-sm text-gray-900 font-light px-6 py-4">
                                                    {book.language}
                                                </td>
                                                <td className="text-sm text-gray-900 font-light px-6 py-4">
                                                    {book.page}
                                                </td>
                                                <td className="text-sm text-gray-900 font-light px-6 py-4">
                                                    {/* { FormatDate(book.published)} */}
                                                    <FormDate data={book.published} />
                                                </td>
                                                <td className="text-sm text-gray-900 font-light px-6 py-4">
                                                    <ul className="flex justify-center">
                                                        {[...Array(averageStar(book.ratings))].map((star, index) => (
                                                            <Star key={index} className="w-4">
                                                            </Star>
                                                        ))}
                                                        {[...Array(5 - averageStar(book.ratings))].map((star, index) => (
                                                            <NotStar key={index} className="w-4">
                                                            </NotStar>
                                                        ))}
                                                        ({numberStar(book.ratings)})
                                                    </ul>
                                                </td>
                                                <td className="flex space-x-2 text-sm text-gray-900 font-light px-6 py-4">
                                                    <ViewLink href={{
                                                        pathname: `/books/show/[id]`, query: { id: book.id }
                                                    }} as={`/books/show/${book.id}`}>
                                                    </ViewLink>
                                                    <EditLink href={{
                                                        pathname: `/books/edit/[id]`, query: { id: book.id }
                                                    }} as={`/books/edit/${book.id}`}>
                                                    </EditLink>
                                                    <NoteLink href={{
                                                        pathname: `/books/[id]/notes`, query: { id: book.id }
                                                    }} as={`/books/${book.id}/notes`}>
                                                    </NoteLink>
                                                    <RatingLink href={{
                                                        pathname: `/books/[id]/ratings/create`, query: { id: book.id }
                                                    }} as={`/books/${book.id}/ratings/create`}>
                                                    </RatingLink>
                                                    <DeleteButton onClick={(e) => {
                                                        e.stopPropagation()
                                                        destroyItem(book.id)
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
            </div>
        </AppLayout>
    )
}
export default Index