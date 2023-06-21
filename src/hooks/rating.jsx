import axios from '@/lib/axios'
import toast, { ToastBar, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router'

export const ratingAPI = () => {
    const router = useRouter()

    const createAuthor = async ({ setErrors, ...props }) => {
        setErrors([])
        axios
            .post('/api/authors/ratings', props)
            .then(res => {
                toast.success(res.data.message)
                router.push('/authors')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error("Error al crear la puntuación")
                addToast('Error al crear el Formulario', { appearance: 'error', autoDismiss: true })
            })
    }

    const editAuthor = async ({ setErrors, ...props }, id) => {
        setErrors([])
        axios
            .put(`/api/authors/ratings/${id}`, props)
            .then(res => {
                toast.success(res.data.message)
                router.push('/authors')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error('Error al editar el puntuaje')
            })
    }

    // const createBook = async ({ setErrors, ...props }) => {
    //     setErrors([])
    //     axios
    //         .post('/api/books/ratings', props)
    //         .then(res => {
    //             addToast(res.data.message, { appearance: 'success', autoDismiss: true })
    //             router.push('/books')
    //         })
    //         .catch(error => {
    //             if (error.response.status !== 422) throw error
    //             setErrors(Object.values(error.response.data.errors).flat())
    //             addToast('Error al crear el Formulario', { appearance: 'error', autoDismiss: true })
    //         })
    // }

    // const editBook = async ({ setErrors, ...props }, id) => {
    //     setErrors([])
    //     axios
    //         .put(`/api/books/ratings/${id}`, props)
    //         .then(res => {
    //             addToast(res.data.message, { appearance: 'success', autoDismiss: true })
    //             router.push('/books')
    //         })
    //         .catch(error => {
    //             if (error.response.status !== 422) throw error
    //             setErrors(Object.values(error.response.data.errors).flat())
    //             addToast('Error al editar el Formulario', { appearance: 'error', autoDismiss: true })
    //         })
    // }

    return {
        createAuthor,
        editAuthor,
        // createBook,
        // editBook,
    }
}