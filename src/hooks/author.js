import axios from "@/lib/axios";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/router";
import { async } from "rxjs";

export const authorAPI = () => {
    const notify = () => toast.success("Sucess!");
    const router = useRouter()

    const create = async (data, setErrors) => {
        setErrors([])
        axios
            .post('/api/authors', data)
            .then(res => {
                toast.success(res.data.message);
                router.push('/authors')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                console.log(error.response.data.errors.full_name)
                if (error.response.data.errors.full_name)
                    toast.error('El Autor ya esta registrado')
                if (error.response.data.errors.birth_date)
                    toast.error(error.response.data.errors.birth_date)
                if (error.response.data.errors.country)
                    toast.error(error.response.data.errors.country);
                // addToast('Error al crear el Formulario', { appearance: 'error', autoDismiss: true })
            })
    }

    // const edit = async ({ setErrors, data }, id) => {
    //     setErrors([])
    //     axios
    //         .post(`/api/authors/${id}`, data)
    //         .then(res => {
    //             // addToast(res.data.message)
    //             toast.success(res.data.message);
    //             router.push('/authors')
    //         })
    //         .catch(error => {
    //             if (error.response.status !== 422) throw error
    //             setErrors(Object.values(error.response.data.errors).flat())
    //             console.log(error.response.data.errors.full_name)
    //             if (error.response.data.errors.full_name)
    //                 toast.error('El Autor ya esta registrado')
    //             if (error.response.data.errors.birth_date)
    //                 toast.error(error.response.data.errors.birth_date)
    //             if (error.response.data.errors.country)
    //                 toast.error(error.response.data.errors.country);
    //             // addToast('Error al crear el Formulario', { appearance: 'error', autoDismiss: true })
    //         })
    // }
    const edit = async (data, setErrors, id) => {
        setErrors([])
        axios
            .post(`/api/authors/${id}`, data)
            .then(res => {
                toast.success(res.data.message);
                router.push('/authors')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error(error.response.data.message);
            })
    }

    const destroy = async (id) => {
        axios
            .delete(`/api/authors/${id}`)
            .then(res => {
                toast.success(res.data.message);
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                toast.error(error.response.data.message)
            })
    }

    const createProfile = async ({ setErrors, ...props }) => {
        setErrors([])
        axios
            .post(`/api/profiles`, props)
            .then(res => {
                toast.success(res.data.message)
                router.push(`/authors`)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                toast.error("Error al crear el Formulario");
            })
    }

    const editProfile = async ({ setErrors, ...props }, id) => {
        setErrors([])
        axios
            .put(`/api/profiles/${id}`, props)
            .then(res => {
                toast.error(res.data.message)
                router.push('/authors')
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                toast.error(error.response.data.message)
            })
    }
    return {
        create,
        edit,
        destroy,
        createProfile,
        editProfile
    }
}