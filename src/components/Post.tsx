import moment from "moment"
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";

const Post = ({ title, text, slug, id, delPost, editPost }: any) => {

    return (
        <>
            <div className="post">
                <p className="time">{moment(+slug).fromNow()}</p>
                <p className="title">{title}</p>
                <p className="text">{text}</p>
                <div className="buttonCont">
                    <button
                        onClick={() => delPost(id)}
                    ><MdDelete /> Delete</button>
                    <button
                        onClick={(e) => editPost(e, id)}
                    ><RiPencilFill /> Edit</button>
                </div>
            </div>
        </>
    )
}

export default Post