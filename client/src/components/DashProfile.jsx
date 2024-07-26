import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../firebase.js";
import {
    updateStart,
    updateFailure,
    updateSuccess,
    deleteUserStart,
    deleteUserFailure,
    deleteUserSuccess,
    signoutSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
const DashProfile = () => {
    const { currentUser, error } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = React.useState(null);
    const [imageFileUrl, setImageFileUrl] = React.useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = React.useState(0);
    const [imageFileUploadError, setImageFileUploadError] = React.useState(null);
    const [formData, setFormData] = React.useState({});
    const [imageFileUploading, setImageFileUploading] = React.useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = React.useState(null);

    const [showDelete, setShowDelete] = React.useState(false);
    const dispatch = useDispatch();
    const filePickerRef = useRef();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageFile(file);
            setImageFileUrl(imageUrl);
        }
    };
    const uploadImage = async () => {
        setImageFileUploadError(null);
        setImageFileUploading(true);
        console.log("uploading image");
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, `profilePictures/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
                console.log("Upload is " + progress + "% done");
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
                console.log(error + "could not upload image");
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setImageFileUploading(false);
                });
            }
        );
    };
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const handleFormSubmit = async (e) => {
        console.log(formData);
        e.preventDefault();
        if (Object.keys(formData).length === 0) {
            return;
        }
        if (imageFileUploading) {
            setImageFileUploadError("Image is still uploading");
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok === false) {
                dispatch(updateFailure(data.message));
            }
            if (res.ok === true) {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User updated successfully");
            }
        } catch (error) {
            console.error(error);
            dispatch(updateFailure(error.message));
        }
    };
    const handleDelete = async () => {
        setShowDelete(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok === false) {
                dispatch(deleteUserFailure(data.message));
            }
            if (res.ok === true) {
                dispatch(deleteUserSuccess());
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };
    const handleSignOut = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (res.ok === true) {
                dispatch(signoutSuccess());
            }
            if (res.ok === false) {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    console.log(imageFileUrl);

    return (
        <div className="w-full max-w-lg p-3 mx-auto text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <form
                onSubmit={handleFormSubmit}
                className="flex flex-col justify-center w-full gap-y-4 ">
                <input
                    type="file"
                    className="hidden mt-4 "
                    onChange={handleImageChange}
                    accept="image/*"
                    ref={filePickerRef}
                />
                <div
                    className="relative flex items-center self-center justify-center object-cover w-32 h-32 mt-8 overflow-hidden rounded-full cursor-pointer "
                    onClick={() => filePickerRef.current.click()}>
                    {imageFileUploadProgress > 0 && imageFileUploadProgress != 100 && (
                        <div className="absolute z-10 w-32 h-32">
                            <CircularProgressbar
                                value={imageFileUploadProgress}
                                text={`${imageFileUploadProgress}%`}
                            />
                        </div>
                    )}
                    <img
                        src={imageFileUrl ? imageFileUrl : currentUser.profilePicture}
                        alt="user"
                        className={` w-32 h-32 border-8 border-gray-100 rounded-full ${
                            imageFileUploadProgress > 0 && imageFileUploadProgress < 100
                                ? "opacity-60"
                                : ""
                        } `}
                    />
                </div>
                {imageFileUploadError && (
                    <Alert color="success" onDismiss={() => setImageFileUploadError(null)}>
                        <span className="font-medium">{imageFileUploadError}</span>
                    </Alert>
                )}
                <TextInput
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    type="text"
                    id="username"
                    placeholder="username"
                    defaultValue={currentUser.username}></TextInput>
                <TextInput
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    type="email"
                    id="email"
                    placeholder="email"
                    defaultValue={currentUser.email}></TextInput>
                <TextInput
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    type="password"
                    id="password"
                    placeholder="******"></TextInput>
                <Button onClick={(e) => handleFormSubmit(e)} outline gradientDuoTone="purpleToBlue">
                    Update
                </Button>
            </form>
            <div className="flex justify-between text-red-500 cursor-pointer">
                <span onClick={() => setShowDelete(true)}>Delete Account</span>
                <span onClick={() => handleSignOut()}>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert
                    color="success"
                    className="mt-2 "
                    onDismiss={() => setUpdateUserSuccess(null)}>
                    <span className="font-medium">{updateUserSuccess}</span>
                </Alert>
            )}
            {error && (
                <Alert color="failure" className="mt-2 ">
                    <span className="font-medium">{updateUserSuccess}</span>
                </Alert>
            )}
            <Modal show={showDelete} onClose={() => setShowDelete(false)}>
                <Modal.Header></Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-4 ">
                        <HiOutlineExclamationCircle className="self-center text-4xl text-red-500" />
                        <h1 className="text-xl font-semibold ">
                            Are you sure you want to delete your account?
                        </h1>
                        <div className="flex justify-center gap-4 ">
                            <Button outline onClick={() => setShowDelete(false)} color="failure">
                                Cancel
                            </Button>
                            <Button onClick={() => handleDelete()} color="failure">
                                Delete
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashProfile;
