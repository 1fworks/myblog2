const url = process.env.NODE_ENV === 'production' ? "https://uwu" : "http://localhost:3000"

export const siteSetting = {
    site:{
        url: url,
        title: "_ = F = _ Blog",
        short_name: "_ = F = _ Blog",
        description: "A collection of doodles and studies.",
        lang: "en-US",
        timezone: "Asia/Seoul",
        image: `${url}/assets/img/f.png`, // for Open Graph
        icons: [ // favicon, icon, apple icon, safari, ms-app
            { rel: 'icon', type: 'image/x-icon', url: `${url}/assets/favicon/favicon.ico` },
            { rel: 'icon', type: 'image/png', sizes: '16x16', url: `${url}/assets/favicon/favicon-16x16.png` },
            { rel: 'icon', type: 'image/png', sizes: '32x32', url: `${url}/assets/favicon/favicon-32x32.png` },

            { rel: 'icon', type: 'image/png', sizes: '192x192', url: `${url}/assets/favicon/android-chrome-192x192.png` },
            { rel: 'icon', type: 'image/png', sizes: '384x384', url: `${url}/assets/favicon/android-chrome-384x384.png` },

            { rel: 'apple-touch-icon', sizes: '180x180', url: `${url}/assets/favicon/apple-touch-icon.png` },

            { rel: 'mask-icon', url: `${url}/assets/favicon/safari-pinned-tab.svg`, color: '#ffffff' },
            { rel: 'msapplication-TileImage', url: `${url}/assets/favicon/mstile-150x150.png` },
        ],
        sitemap_default: [
            // Root and posts are already included.
            // src/app/sitemap.ts
            '/archive', '/art', '/project', '/about',
        ]
    },
    author:{
        name: "_ = F = _",
        bio: "",
        github: "1fworks", // github username
        twitter: "1F_works", // @nickname
        instagram: "1f_works",
        soundcloud: "f_works",
        gamejolt: "F_works",
        itchio: "f-works",
        youtube: "F_works",
        email: "contact@with-1f.work",
        avatar: `${url}/assets/img/f.png`,
        url: "https://attic.with-1f.work",
    },
    pwa:{
        background_color: '#000000', // loading color
        theme_color: '#1F1F1F',
        pwa_icons: [
            {
                "src": `${url}/assets/favicon/android-chrome-192x192.png`,
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": `${url}/assets/favicon/android-chrome-384x384.png`,
                "sizes": "384x384",
                "type": "image/png"
            }
        ],
    },
    robots:{
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/posts/', '/data/'],
        },
        sitemap: `${url}/sitemap.xml`,
    },
}