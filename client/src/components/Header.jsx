import { Button, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
const Header = () => {
    const path = useLocation().pathname;
    const navigate = useNavigate();
    return (
        <Navbar className="border-b-2 ">
            <Link
                to="/"
                className="self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white">
                <span className="px-2 py-1 text-white rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    Prashant's{" "}
                </span>
                Blog
            </Link>
            <form action="">
                <TextInput
                    type="text"
                    placeholder="Search"
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"></TextInput>
            </form>
            <Button className="w-12 h-10 lg:hidden " color="gray" pill>
                <AiOutlineSearch />
            </Button>

            <div className="flex gap-x-4 md:order-2 ">
                <Button className="hidden w-12 h-10 lg:inline" color="gray" pill>
                    <FaMoon />
                </Button>
                <Link to="/sign-in/">
                    <Button gradientDuoTone="purpleToBlue" outline>
                        Sign In
                    </Button>
                </Link>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={"div"}>
                    <Link to="/">Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={"div"}>
                    <Link to="/about">About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/projects"} as={"div"}>
                    <Link to="/projects">Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
