import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
const CreatePost = () => {
    const [value, setValue] = useState("");
    return (
        <div className="max-w-3xl min-h-screen p-3 mx-auto ">
            <h1 className="text-3xl font-semibold text-center my7">Create a Post</h1>
            <form className="flex flex-col gap-4 mt-8 ">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <TextInput
                        type="text "
                        placeholder="none"
                        required
                        id="title"
                        className="flex-1"
                    />
                    <Select>
                        <option value="none">Select a Category</option>
                        <option value="react">JavaScript</option>
                        <option value="vue">React.js </option>
                        <option value="angular">Next.js</option>
                    </Select>
                </div>
                <div className="flex items-center justify-between gap-4 p-3 border-4 border-teal-500 border-dotted">
                    <FileInput type="file" id="image" accept="image/*" />
                    <Button type="button" gradientDuoTone="purpleToPink" size="sm" outline>
                        Upload Image
                    </Button>
                </div>
                <ReactQuill required theme="snow" value={value} onChange={setValue} />
                <Button type="submit" gradientDuoTone="purpleToPink" size="lg">
                    Publish
                </Button>
            </form>
        </div>
    );
};

export default CreatePost;
