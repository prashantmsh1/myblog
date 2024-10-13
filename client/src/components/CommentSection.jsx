import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Textarea, Button, Alert } from "flowbite-react";
const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState("");
    const [error, setError] = useState(null);

    const handleComment = async (e) => {
        e.preventDefault();
        if (comments.length === 0 || comments.length > 200) return;
        try {
            const res = await fetch("/api/comment/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: comments,
                    postId,
                    userId: currentUser._id,
                }),
            });
            const data = await res.json();
            if (res.ok === true) {
                console.log(data);
                setComments("");
            }
            if (res.ok === false) {
                console.log(data);
            }
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };
    return (
        <div className="w-full max-w-3xl p-3 mx-auto">
            {currentUser ? (
                <div className="flex gap-x-2 ">
                    <p className="font-medium text-gray-500 ">Signed in as:</p>
                    <img
                        className="object-cover w-6 h-6 rounded-full "
                        src={currentUser.profilePicture}
                        alt=""
                    />
                    <Link
                        to={"/dashboard?tab=profile"}
                        className="font-medium text-blue-800 hover:underline ">
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div>
                    <p>SignIn to comment</p>
                    <Link to="/sign-in" className="text-blue-800">
                        SignIn
                    </Link>
                </div>
            )}{" "}
            {currentUser && (
                <form className="flex flex-col p-4 mt-2 border border-gray-300 rounded-xl gap-y-2">
                    <Textarea
                        disabled={comments.length >= 200}
                        id="comment"
                        placeholder="Leave a comment..."
                        required
                        rows={3}
                        maxLength={200}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                        <p>{200 - comments.length} characters remaining</p>
                        <div className="flex items-center justify-between gap-x-8 ">
                            {" "}
                            <Button
                                as={"div"}
                                onClick={() =>
                                    setComments((prev) => (prev = prev.substring(0, 199)))
                                }
                                color={"failure"}
                                className="bg-red-500 hover:outline outline-red-800 hover:bg-red-600 fit">
                                Reset
                            </Button>
                            <Button
                                onClick={handleComment}
                                outline
                                gradientDuoTone={"purpleToBlue"}
                                className="self-end text-center text-white w-fit ">
                                Comment
                            </Button>
                        </div>
                    </div>
                    {error && <Alert color={"failure"}>{error}</Alert>}
                </form>
            )}
        </div>
    );
};

export default CommentSection;
