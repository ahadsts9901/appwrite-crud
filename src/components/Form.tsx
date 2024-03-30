import "../App.css";

import { useRef, useState } from "react"
import { ID, databases } from "../appwrite";

const Form = ({setFetchData, fetchData}:any) => {

    const titleRef: any = useRef()
    const textRef: any = useRef()

    const [errorMessage, setErrorMessage]: any = useState(null)
    const [successMessage, setSuccessMessage]: any = useState(null)
    const [isLoading, setIsLoading]: any = useState(null)

    const create = async (e: any) => {

        e.preventDefault()

        if (
            !textRef?.current?.value || textRef?.current?.value.trim() === "" ||
            !titleRef?.current?.value || titleRef?.current?.value.trim() === ""
        ) {
            setErrorMessage("title and text are required")
            setTimeout(() => {
                setErrorMessage(null)
            }, 1500)
            return;
        }

        try {

            setIsLoading(true)

            const promise = databases.createDocument(
                '6607d9ea9c0f45a3bfbb', // database id
                '6607d9fbef5f51d4c2d2', // collection id
                ID.unique(),
                {
                    title: titleRef.current.value,
                    text: textRef.current.value,
                    slug: `${new Date().getTime()}`,
                }
            );

            promise.then(function () {
                setIsLoading(false)
                setErrorMessage(null)
                setSuccessMessage("post done")
                setTimeout(() => {
                    setSuccessMessage(null)
                }, 1500)
                e.target.reset()
                setFetchData(!fetchData)
            }, function (error) {
                console.log(error);
                setIsLoading(false)
                setSuccessMessage(null)
                setErrorMessage("error in posting")
                setTimeout(() => {
                    setErrorMessage(null)
                }, 1500)
            });

        } catch (error) {
            console.log(error);
            setIsLoading(false)
            setSuccessMessage(null)
            setErrorMessage("error in posting")
            setTimeout(() => {
                setErrorMessage(null)
            }, 1500)
        }

    }

    return (
        <>
            {
                errorMessage && <p className="errorMessage">{errorMessage}</p>
            }
            {
                successMessage && <p className="successMessage">{successMessage}</p>
            }
            <form onSubmit={create}>
                <input minLength={1} maxLength={20} ref={titleRef} type="text" placeholder="Enter Title..." />
                <textarea minLength={1} maxLength={1000} placeholder="Enter Text..." ref={textRef}></textarea>
                <button type="submit">
                    {
                        isLoading && <span className="loader"></span>
                    }
                    {
                        isLoading ? "Processing" : "Post"
                    }
                </button>
            </form>
        </>
    )
}

export default Form