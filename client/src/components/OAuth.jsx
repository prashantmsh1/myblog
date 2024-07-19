import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleAuth = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            const res = await signInWithPopup(auth, provider);
            const result = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: res.user.displayName,
                    email: res.user.email,
                    googlePhotoUrl: res.user.photoURL,
                }),
            });
            const data = await result.json();
            if (result.ok === true) {
                dispatch(signInSuccess(data));
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Button
            onClick={() => handleGoogleAuth()}
            outline
            className="w-full bg-gradient-to-r from-pink-500 to-yellow-500">
            <AiFillGoogleCircle className="mr-2 text-2xl " /> Continue with Google
        </Button>
    );
};
export default OAuth;
