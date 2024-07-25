import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../firebase.js";
const DashProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = React.useState(null);
    const [imageFileUrl, setImageFileUrl] = React.useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = React.useState(0);
    const [imageFileUploadError, setImageFileUploadError] = React.useState(null);
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
                });
            }
        );
    };
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);
    console.log(imageFileUrl);

    return (
        <div className="w-full max-w-lg p-3 mx-auto text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <form className="flex flex-col justify-center w-full gap-y-4 ">
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
                    type="text"
                    id="username"
                    placeholder="username"
                    defaultValue={currentUser.username}></TextInput>
                <TextInput
                    type="email"
                    id="email"
                    placeholder="email"
                    defaultValue={currentUser.email}></TextInput>
                <TextInput type="password" id="password" placeholder="******"></TextInput>
                <Button type="submit" outline gradientDuoTone="purpleToBlue">
                    Update
                </Button>
            </form>
            <div className="flex justify-between text-red-500 cursor-pointer">
                <span>Delete Account</span>
                <span>Sign Out</span>
            </div>
        </div>
    );
};

export default DashProfile;
