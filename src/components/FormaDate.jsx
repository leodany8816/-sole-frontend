const FormDate = ({ data }) => {
    const formatDate = () => {
        const date = new Date(data.replace(/-/g, '\/'));
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('es-MX', options);
    };

    return <span>{formatDate()}</span>;
};

export default FormDate;