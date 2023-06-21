import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "@/lib/axios";
import PreviousLink from "@/components/PreviousLink";
import EditLink from '@/components/EditLink';
import DeleteButton from '@/components/DeleteButton';
import Button from '@/components/Button';
import toast, { Toaster } from 'react-hot-toast';
import { noteAPI } from '@/hooks/note'

const Index = () => {
    const { destroyAuthor } = noteAPI()
    const [notes, setNotes] = useState([])
    const [author_id, setAuthorId] = useState('')
    const [full_name, setFullName] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (router.isReady) {
            axios
                .get(`/api/authors/${router.query.id}/notes`)
                //.get(`/api/authors/19/notes`)
                .then(res => {
                    setNotes(res.data.notes)
                    setAuthorId(res.data.author.id)
                    setFullName(res.data.author.full_name)
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

    function destroyItem(id) {
        if (confirm('¿Seguro que desea eliminar la nota?')) {
            destroyAuthor(id)
            setNotes([...notes.filter((note) => note.id !== id)])
        }
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Notas de autor: {full_name}
                </h2>
            }>
                <Toaster/>
            <Head>
                <title>Laravel - Author</title>
            </Head>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex space-x-2 justify-start">
                                <Button
                                    type="button"
                                    onClick={() => router.push('/authors/[id]/notes/create', `/authors/${author_id}/notes/create`)}>
                                    Nueva Nota de autor
                                </Button>
                            </div>
                            <table className="min-w-full">
                                <tbody>
                                    {notes?.map((note) => (
                                        <tr className="bg-white border-b" key={note.id}>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4">
                                                <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">Fecha: ({FormatDate(note.writing_date)})</h5>
                                                {note.description}
                                            </td>
                                            <td className="flex space-x-2 text-sm text-gray-900 font-light px-6 py-4">
                                                <EditLink href={{
                                                    pathname: `/authors/[id]/notes/edit/[idNote]`, query: { id: router.query.id, idNote: note.id }
                                                }} as={`/authors/${router.query.id}/notes/edit/${note.id}`}>
                                                </EditLink>
                                                <DeleteButton onClick={(e) => {
                                                    e.stopPropagation()
                                                    destroyItem(note.id)
                                                }}>
                                                </DeleteButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end ">
                                <PreviousLink href="/authors"></PreviousLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout >
    )

}

export default Index