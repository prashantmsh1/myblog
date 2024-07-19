import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/OAuth";
const SignUp = () => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData((formData) => ({ ...formData, [e.target.id]: e.target.value.trim() }));
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            setLoading(false);
            if (res.ok === false) {
                setError(data.message);
                return;
            }
            if (res.ok === true) {
                navigate("/sign-in");
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError("error");
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
                            <Label>Your Username</Label>
                            <TextInput
                                id="username"
                                onChange={handleChange}
                                type="text"
                                placeholder="Username"
                            />
                        </div>
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
                                placeholder="Password"
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
                                "Sign Up"
                            )}
                        </Button>
                        <OAuth />
                    </form>
                    <div className="flex gap-2 mt-5 text-sm ">
                        <span>Have an account?</span>
                        <Link to="/sign-in" className="text-blue-500 ">
                            Sign In
                        </Link>
                    </div>
                    {error && (
                        <Alert onDismiss={() => setError(false)} className="mt-5 " color="failure">
                            {error}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignUp;
