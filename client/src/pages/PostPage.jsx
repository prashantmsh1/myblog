import { Button, Spinner } from "flowbite-react";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
const PostPage = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [post, setPost] = React.useState(null);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
            const data = await res.json();
            if (res.ok === true) {
                setPost(data.posts[0]);
                setLoading(false);
                setError(false);
            }
            if (res.ok === false) {
                setError(true);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setError(true);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPost();
    }, [postSlug]);
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen ">
                <Spinner size="xl" />
            </div>
        );
    }
    return (
        <main className="flex flex-col h-screen max-w-6xl p-3 mx-auto ">
            <h1 className="max-w-2xl p-3 mx-auto mt-10 font-serif text-3xl text-center lg:text-4xl">
                {post && post.title}
            </h1>
            <Link className="self-center " to={`/search?category=${post && post.category}`}>
                <Button color="gray" pill size="xs">
                    {post && post.category}
                </Button>
            </Link>
            <img
                className="w-full max-h-[600px] object-cover h-auto max-w-2xl mx-auto mt-10"
                src={post && post.images[0]}
                alt={post && post.title}
            />
            <div className="flex items-center justify-between w-full max-w-2xl p-3 mx-auto text-xs border-b border-slate-300">
                <span>{post && new Date(post.updatedAt).toLocaleDateString()}</span>
                <span className="italic ">
                    {post && (post.content.length / 1000).toFixed(0)} mins read
                </span>
            </div>
            <div
                className="w-full max-w-2xl p-3 mx-auto post-content"
                dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
        </main>
    );
};

export default PostPage;
