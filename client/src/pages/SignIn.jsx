import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { singInStart, signInFailure, signInSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const SignIn = () => {
    const [formData, setFormData] = useState({});

    const { loading, error: errorMessage, currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData((formData) => ({ ...formData, [e.target.id]: e.target.value.trim() }));
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            return dispatch(signInFailure("All fields are required"));
        }

        try {
            dispatch(singInStart());
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok === false) {
                dispatch(signInFailure(data.message));
            }
            if (res.ok === true) {
                dispatch(signInSuccess(data));
                navigate("/");
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className="min-h-screen mt-20 ">
            <div className="flex flex-col max-w-3xl gap-5 p-3 mx-auto md:flex-row ">
                <div className="flex-1 ">
                    <Link
                        to="/"
                        className="self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white">
                        <span className="px-2 py-1 text-white rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Prashant's{" "}
                        </span>
                        Blog
                    </Link>
                    <p className="mt-5 text-sm ">
                        This is a demo blog website. You can sign up to create a new account.
                    </p>
                </div>
                <div className="flex-1">
                    <form className="space-y-4 ">
                        <div>
                            <Label>Your Email</Label>
                            <TextInput
                                id="email"
                                onChange={handleChange}
                                type="email"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <Label>Your Password</Label>
                            <TextInput
                                id="password"
                                onChange={handleChange}
                                type="password"
                                placeholder="********"
                            />
                        </div>
                        <Button
                            onClick={handleSubmit}
                            className="w-full "
                            gradientDuoTone="purpleToPink"
                            disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner />
                                    <span className="ml-4 ">Loading</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                    <div className="flex gap-2 mt-5 text-sm ">
                        <span>Don't have an account?</span>
                        <Link to="/sign-up/" className="text-blue-500 ">
                            Sign Up
                        </Link>
                    </div>
                    {errorMessage && (
                        <Alert
                            onDismiss={() => dispatch(signInFailure(null))}
                            className="mt-5 "
                            color="failure">
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignIn;
