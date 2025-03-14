import { siteSetting } from "@/app/site.setting"
// import Link from "next/link"

export const Footer = () => {
  return (
    <footer>
      <div className='pt-10 pb-10'>
        <div className="w-fit mx-auto mb-2">
          { /* My Blog Logo. _ = F = _ */ }
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
            <path d="M 6 0 L 0 6 L 1 7 L 7 1 L 6 0 M 2 8 L 6 12 L 12 6 L 11 5 L 10 6 L 7 3 L 6 4 L 9 7 L 8 8 L 5 5 Z"/>
          </svg>
        </div>
        <p className='w-fit mx-auto blog-data-1'>
          <a className='no-style mr-3' href='/feed.xml'>
            {
              // Gentlecons Interface Icons by Konstantin Filatov, CC Attribution License
              // https://www.svgrepo.com/collection/gentlecons-interface-icons
            }
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="1"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M23 7C23 5.34315 21.6569 4 20 4H4C2.34315 4 1 5.34315 1 7H3C3 6.44771 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7V17C21 17.5523 20.5523 18 20 18H15C14.4477 18 14 18.4477 14 19C14 19.5523 14.4477 20 15 20H20C21.6569 20 23 18.6569 23 17V7Z"></path>
                <path d="M10.763 19.9806C11.2919 20.1155 11.8358 19.7963 11.912 19.2558C12.0823 18.0468 12.0054 16.8123 11.6818 15.6279C11.2711 14.1248 10.4772 12.7541 9.37776 11.6499C8.27832 10.5456 6.91103 9.74579 5.4097 9.32859C4.22678 8.99987 2.99258 8.91757 1.78293 9.08267C1.24209 9.15649 0.920464 9.69902 1.05311 10.2285C1.18576 10.758 1.72288 11.0723 2.26575 11.0152C3.14036 10.9233 4.02749 10.9961 4.88045 11.2331C6.05203 11.5587 7.11902 12.1829 7.97698 13.0446C8.83494 13.9063 9.45448 14.9759 9.77497 16.1489C10.0083 17.0029 10.0773 17.8904 9.98155 18.7646C9.92213 19.3072 10.2341 19.8457 10.763 19.9806Z"></path>
                <path d="M6.55123 19.8727C7.03253 20.1265 7.63907 19.943 7.79374 19.4213C8.00116 18.7216 8.05408 17.9811 7.94368 17.2517C7.78382 16.1956 7.28993 15.2184 6.53438 14.4633C5.77882 13.7083 4.80131 13.215 3.74506 13.0558C3.01562 12.9459 2.2751 12.9993 1.5756 13.2072C1.05401 13.3622 0.870846 13.9688 1.12497 14.45C1.3791 14.9311 1.97808 15.0966 2.5152 15.0095C2.8232 14.9596 3.13899 14.9572 3.45143 15.0043C4.09142 15.1007 4.6837 15.3996 5.14149 15.8571C5.59929 16.3146 5.89854 16.9067 5.9954 17.5466C6.04268 17.859 6.04052 18.1748 5.99079 18.4829C5.90407 19.02 6.06992 19.6189 6.55123 19.8727Z"></path>
                <path d="M4 18.5C4 19.3284 3.32843 20 2.5 20C1.67157 20 1 19.3284 1 18.5C1 17.6716 1.67157 17 2.5 17C3.32843 17 4 17.6716 4 18.5Z"></path>
              </g>
            </svg>
            rss
          </a> © {siteSetting.author.name} {new Date().getFullYear()}
        </p>
        <p className='w-fit mx-auto blog-data-2'>Powered by Next.js, Cloudflare Pages</p>
      </div>
    </footer>
  )
}