import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { NotFoundPage } from '@/pages/notFound'
import Md5Page from '@/pages/md5/page'
import { Sha256Page } from '@/pages/sha256/page'
import { Sha512Page } from '@/pages/sha512/page'
import { Sha1Page } from '@/pages/sha1/page'
import { Sha3Page } from '@/pages/sha3/page'
import { Blake2bPage } from '@/pages/blake2b/page'
import { Blake3Page } from '@/pages/blake3/page'
import { Ripemd160Page } from '@/pages/ripemd160/page'
import { HmacPage } from '@/pages/hmac/page'

const router = createBrowserRouter([
    // ── Root (MD5) ──────────────────────────────────────────────────────────
    { path: '/',                    Component: Md5Page },
    { path: '/:lang',               Component: Md5Page },

    // ── Hash tools ──────────────────────────────────────────────────────────
    { path: '/:lang/sha1',          Component: Sha1Page },
    { path: '/:lang/sha256',        Component: Sha256Page },
    { path: '/:lang/sha512',        Component: Sha512Page },
    { path: '/:lang/sha3',          Component: Sha3Page },
    { path: '/:lang/blake2b',       Component: Blake2bPage },
    { path: '/:lang/blake3',        Component: Blake3Page },
    { path: '/:lang/ripemd160',     Component: Ripemd160Page },
    { path: '/:lang/hmac',          Component: HmacPage },

    // ── 404 ─────────────────────────────────────────────────────────────────
    { path: '*',                    Component: NotFoundPage },
])

const root = document.getElementById('root')
createRoot(root!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
)
