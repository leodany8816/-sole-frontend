import axios from '@/lib/axios'
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router'

export const noteAPI = () => {
    const router = useRouter()

    const createAuthor = async ({ setErrors, ...props }) => {
        setErrors([])
        axios
            .post('/api/authors/notes', props)
            .then(res => {
                toast.success('Nota guardada correctamente')
                router.push(`/authors/${props.author.id}/notes`)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error('Error al crear la nota')
            })
    }

    const editAuthor = async ({ setErrors, ...props }, id) => {
        setErrors([])
        axios
            .put(`/api/authors/notes/${id}`, props)
            .then(res => {
                toast.success(res.data.message)
                router.push(`/authors/${props.author.id}/notes`)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error('Error al edita el formulario')
            })
    }

    const destroyAuthor = async (id) => {
        axios
            .delete(`/api/authors/notes/${id}`)
            .then(res => {
                toast.success(res.data.message)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error('Error al eliminar la nota');
            })
    }

    const createBook = async ({ setErrors, ...props }) => {
        setErrors([])
        axios
            .post('/api/books/notes', props)
            .then(res => {
                toast.success(res.data.message)
                router.push(`/books/${props.book.id}/notes`)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error('Error al crear la nota')
            })
    }

    const editBook = async ({ setErrors, ...props }, id) => {
        setErrors([])
        axios
            .put(`/api/books/notes/${id}`, props)
            .then(res => {
                toast.success(res.data.message)
                router.push(`/books/${props.book.id}/notes`)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error('Error al editar la nota')
            })
    }

    const destroyBook = async (id) => {
        axios
            .delete(`/api/books/notes/${id}`)
            .then(res => {
                toast.success(res.data.message);
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                toast.error('Error al eliminar la nota')
            })
    }

    return {
        createAuthor,
        editAuthor,
        destroyAuthor,
        createBook,
        editBook,
        destroyBook
    }
}