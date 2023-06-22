import axios from '@/lib/axios'
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router'

export const genreAPI = () => {
    const router = useRouter()

    const create = ({ setErrors, ...props }) => {
        setErrors([])
        axios
            .post('/api/genres', props)
            .then(res => {
                toast.success(res.data.message)
                router.push('/genres')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error('Error al crear el genero')
            })
    }

    const edit = async ({ setErrors, ...props }, id) => {
        setErrors([])
        axios
            .put(`/api/genres/${id}`, props)
            .then(res => {
                toast.success(res.data.message)
                router.push('/genres')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error('Error al editar el genero')
            })
    }

    const destroy = async (id) => {
        axios
            .delete(`/api/genres/${id}`)
            .then(res => {
                toast.success(res.data.message)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                toast.error('Error al eliminar el genero')
            })
    }

    return {
        create,
        edit,
        destroy
    }
}