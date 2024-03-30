import { useEffect, useState } from "react"
import Form from "../components/Form"
import { databases } from "../appwrite";
import Post from "../components/Post";
import Swal from "sweetalert2"
import { Toast } from "../core";
import { SiAppwrite } from "react-icons/si";

const Home = () => {

  const [posts, setPosts]: any = useState([])
  const [isLoading, setIsLoading]: any = useState(false)
  const [fetchData, setFetchData]: any = useState(false)

  useEffect(() => {
    getPosts()
  }, [])

  useEffect(() => {
    getPosts()
  }, [fetchData])

  const getPosts = async () => {

    setIsLoading(true)

    const promise = databases.listDocuments(
      '6607d9ea9c0f45a3bfbb', // database id
      '6607d9fbef5f51d4c2d2', // collection id
    )

    promise.then(function (resp: any) {
      setPosts(resp.documents.reverse())
    }, function (error: any) {
      console.log(error);
    });

    setIsLoading(false)

  }

  const delPost = async (id: any) => {

    if (!id) return

    Swal.fire({
      title: 'Delete post ?',
      showCancelButton: true,
      cancelButtonColor: "#333",
      confirmButtonText: 'Delete',
      confirmButtonColor: "#333",
      showLoaderOnConfirm: true,
      preConfirm: async () => {

        const promise = databases.deleteDocument(
          '6607d9ea9c0f45a3bfbb', // database id
          '6607d9fbef5f51d4c2d2', // collection id
          id // documentId
        );

        promise.then(
          function () {
            Toast.fire({
              title: "Post deleted",
            });
            getPosts()
          },
          function (error) {
            console.log(error);
            Toast.fire({
              title: "Can't delete post",
            });
          });

      }
    });

  }

  const editPost = async (e: any, id: any) => {

    if (!id) return;

    let toEditTitle = e.target.parentNode.parentNode.querySelector(".title").innerText
    let toEditText = e.target.parentNode.parentNode.querySelector(".text").innerText

    Swal.fire({
      title: 'Edit Post',
      html: `
        <input type="text" minLength="${1}" maxLength="${20}" id="editTitle" class="swal2-input" placeholder="Post Title" value="${toEditTitle}" required>
        <textarea id="editText" minLength="${1}" maxLength="${1000}" class="swal2-input text" placeholder="Post Text" required>${toEditText}</textarea>
      `,
      showCancelButton: true,
      cancelButtonColor: "#333",
      confirmButtonText: 'Update',
      confirmButtonColor: "#333",
      preConfirm: async () => {

        const editedTitleElement = document.getElementById('editTitle')! as HTMLInputElement;
        const editedTextElement = document.getElementById('editText')! as HTMLInputElement;

        const editedTitle = editedTitleElement.value
        const editedText = editedTextElement.value

        if (!editedTitle.trim() || !editedText.trim()) {
          Swal.showValidationMessage('Title and text are required');
          setTimeout(() => {
            Swal.resetValidationMessage();
          }, 1500)
          return false;
        }

        const promise = databases.updateDocument(
          '6607d9ea9c0f45a3bfbb', // database id
          '6607d9fbef5f51d4c2d2', // collection id
          id, // documentId
          {
            title: editedTitle,
            text: editedText,
          }
        );

        promise.then(function () {

          Toast.fire({
            title: "Post updated",
          });
          getPosts()

        }, function (error) {

          console.log(error); // Failure
          Toast.fire({
            title: "Can't update post",
          });

        });

      }
    });

  }

  return (
    <>
      <h2 className="heading"><SiAppwrite id="icon" /><span>Appwrite</span>CRUD</h2>
      <Form fetchData={fetchData} setFetchData={setFetchData} />
      {
        isLoading ? <div className="screen"><span className="loader"></span></div> :
          posts.length < 1 ? <div className="screen"><h2>No Post Found...</h2></div> :
            <div className="postCont">
              {posts.map((post: any) => (
                <Post
                  title={post?.title}
                  text={post?.text}
                  slug={post?.slug}
                  id={post?.$id}
                  delPost={delPost}
                  editPost={editPost}
                />
              ))}
            </div>
      }
    </>
  )
}

export default Home