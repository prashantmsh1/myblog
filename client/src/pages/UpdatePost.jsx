import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import { useState } from "react";

import "react-quill/dist/quill.snow.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdatePost = () => {
    const [value, setValue] = useState("");
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();
    const { postId } = useParams();
    const { currentUser } = useSelector((state) => state.user);

    const getPost = async () => {
        try {
            const res = await fetch(`/api/post/getposts?postId=${postId}`);
            const data = await res.json();
            if (res.ok === true) {
                setPublishError(null);
                setFormData(data.posts[0]);
                setValue(data.posts[0].content);
            }
            if (res.ok === false) {
                setPublishError(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getPost();
    }, [postId]);
    const handleUploadImage = () => {
        try {
            if (!file) {
                setImageUploadError("Please select an image to upload");
                return;
            }
            const storage = getStorage();
            const fileName = Date.now() + "-" + file.name;
            const storageRef = ref(storage, `blogimages/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    setImageUploadProgress(progress.toFixed(0));
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                    }
                },
                (error) => {
                    console.error(error);
                    setImageUploadError("An error occurred while uploading the image");
                    setImageUploadProgress(null);
                },
                () => {
                    console.log("Upload is completed");

                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        console.log("File available at", downloadURL);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            console.error(error);
            setImageUploadError("An error occurred while uploading the image");
            setImageUploadProgress(null);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(
                "/api/post/updatepost/" + formData._id + "/" + currentUser._id,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );
            const data = await res.json();
            console.log(data);
            if (res.ok === false) {
                setPublishError(data.message);
            }
            if (res.ok === true) {
                setPublishError(null);
                navigate("/post/" + data.slug);
            }
        } catch (error) {
            console.error(error);
            setPublishError("An error occurred while publishing the post");
        }
    };
    return (
        <div className="max-w-3xl min-h-screen p-3 mx-auto ">
            <h1 className="text-3xl font-semibold text-center my7">Update this Post</h1>
            <form className="flex flex-col gap-4 mt-8 ">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <TextInput
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        type="text "
                        placeholder="none"
                        required
                        id="title"
                        className="flex-1"
                        value={formData.title}
                    />
                    <Select
                        onChange={(e) => {
                            setFormData({ ...formData, category: e.target.value });
                        }}
                        value={formData.category}>
                        <option value="uncategorized">Select a Category</option>
                        <option value="javascript">JavaScript</option>
                        <option value="react">React.js </option>
                        <option value="nextjs">Next.js</option>
                    </Select>
                </div>
                <div className="flex items-center justify-between gap-4 p-3 border-4 border-teal-500 border-dotted">
                    <FileInput
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                        onClick={handleUploadImage}
                        type="button"
                        gradientDuoTone="purpleToPink"
                        size="sm"
                        outline>
                        {imageUploadProgress ? (
                            <div className="flex items-center gap-2 h-[14px] ">
                                <CircularProgressbar
                                    className="w-4 h-4"
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress}%`}
                                />
                                <span>Uploading...</span>
                            </div>
                        ) : (
                            "Upload Image"
                        )}
                    </Button>
                </div>
                {imageUploadError && (
                    <Alert
                        type="error"
                        onDismiss={() => {
                            setImageUploadError(null);
                        }}
                        color="red"
                        className="mt-4">
                        {imageUploadError}
                    </Alert>
                )}
                {formData.images && (
                    <img
                        src={formData.images[0]}
                        alt="Uploaded Image"
                        className="object-cover w-full max-h-64"
                    />
                )}
                <ReactQuill
                    onChange={(value) => {
                        setValue(value);
                        setFormData({ ...formData, content: value });
                    }}
                    value={formData.content}
                    required
                    theme="snow"
                />
                <Button
                    type="button"
                    onClick={handleSubmit}
                    gradientDuoTone="purpleToPink"
                    size="lg">
                    Update
                </Button>
                {publishError && (
                    <Alert
                        type="error"
                        onDismiss={() => {
                            setPublishError(null);
                        }}
                        color="red"
                        className="mt-4">
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    );
};

export default UpdatePost;
