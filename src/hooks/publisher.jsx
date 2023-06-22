import axios from '@/lib/axios'
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router'

export const publisherAPI = () => {
    const router = useRouter()

    const create = async ({ setErrors, ...props }) => {
        setErrors([])
        axios
            .post('/api/publishers', props)
            .then(res => {
                toast.success(res.data.message)
                router.push('/publishers')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error('Existen error en el formulario, por favor de revisar')
            })
    }

    const edit = async ({ setErrors, ...props }, id) => {
        setErrors([])
        axios
            .put(`/api/publishers/${id}`, props)
            .then(res => {
                toast.success(res.data.message)
                router.push('/publishers')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast('Existen errors en el formulario')
            })
    }

    const destroy = async (id) => {
        axios
            .delete(`/api/publishers/${id}`)
            .then(res => {
                toast.success(res.data.message)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                toast.error('Error al eliminar la editorial')
            })
    }

    return {
        create,
        edit,
        destroy
    }
}