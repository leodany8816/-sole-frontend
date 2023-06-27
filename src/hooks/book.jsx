import axios from '@/lib/axios'
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router'

export const bookAPI = () => {
    const router = useRouter()

    const create = async (data, setErrors) => {
        setErrors([])
        axios
            .post('/api/books', data)
            .then(res => {
                toast.success(res.data.message)
                router.push('/books')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error('Error al crear el formulario, por favor de verificar')
            })
    }

    const edit = async (data, setErrors, id) => {
        setErrors([])
        axios
            .post(`/api/books/${id}`, data)
            .then(res => {
                toast.success(res.data.message)
                router.push('/books')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.success('Error al guardar el formulario')
            })
    }

    const destroy = async (id) => {
        axios
            .delete(`/api/books/${id}`)
            .then(res => {
                toast.success(res.data.message)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                toast.error('Error al eliminar el formulario')
            })
    }
    return {
        create,
        edit,
        destroy
    }
}