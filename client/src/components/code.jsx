import { useEffect } from "react";
import { api } from "../api/api";
import { useParams } from "react-router-dom"

const Code = () => {
    const { shortCode } = useParams()
    useEffect(() => {
        console.log(shortCode)
        const getUrl = api.get(`/${shortCode}`)
            .then((resp) => {
                console.log(resp.data.data.originalUrl);


                window.location.replace(resp.data.data.originalUrl);
            }).catch((e) => {
                console.log(e)
            })
    }, [])
    return (
        <h1>
            redirecting...
        </h1>
    )
}

export default Code;
