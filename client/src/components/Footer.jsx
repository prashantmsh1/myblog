import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { BsXLg, BsGithub, BsLinkedin } from "react-icons/bs";
const FooterCom = () => {
    return (
        <Footer container className="border border-t-8 border-cyan-500 ">
            <div className="w-full mx-auto max-w-7xl">
                <div className="grid justify-between w-full sm:flex md:grid-cols-1">
                    <div>
                        <Link
                            to="/"
                            className="self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white">
                            <span className="px-2 py-1 text-white rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                Prashant's{" "}
                            </span>
                            Blog
                        </Link>
                    </div>
                    <div className="grid justify-between grid-cols-2 gap-3 mt-4 text-gray-800 sm:mt-8 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="About" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="" rel="noopener noreferrer">
                                    Porfolio
                                </Footer.Link>
                                <Footer.Link href="" rel="noopener noreferrer">
                                    Prashant's Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Follow Us" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="" rel="noopener noreferrer">
                                    LinkedIn
                                </Footer.Link>
                                <Footer.Link href="" rel="noopener noreferrer">
                                    Github
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Legal" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="" rel="noopener noreferrer">
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link href="" rel="noopener noreferrer">
                                    Terms & Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />

                <div className="flex flex-col w-full mt-4 sm:justify-between sm:gap-6 sm:flex-row ">
                    <Footer.Copyright by="Prashant's blog" year={new Date().getFullYear()} />

                    <div className="flex gap-6 mt-4 sm:mt-0 sm:justify-center">
                        <Footer.Icon href="#" icon={BsXLg} />
                        <Footer.Icon href="#" icon={BsGithub} />
                        <Footer.Icon href="#" icon={BsLinkedin} />
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default FooterCom;
