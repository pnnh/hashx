import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router/dom";
import {NotFoundPage} from "@/pages/notFound.tsx";
import Md5Page from "@/pages/md5/page.tsx";
import {Sha256Page} from "@/pages/sha256/page.tsx";
import {Sha512Page} from "@/pages/sha512/page.tsx";

let router = createBrowserRouter([
    {
        path: "/",
        Component: Md5Page,
    },
    {
        path: '/:lang',
        Component: Md5Page,
    },
    {
        path: '/:lang/sha256',
        Component: Sha256Page,
    },
    {
        path: '/:lang/sha512',
        Component: Sha512Page,
    },
    {
        path: '*',
        Component: NotFoundPage,
    }
]);

const root = document.getElementById('root')

createRoot(root!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>
)
