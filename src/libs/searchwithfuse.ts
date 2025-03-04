import Fuse from 'fuse.js'

export function searchwithfuse(datalist:
  {[key:string]: string}[] ){
  
  const fuse = new Fuse(datalist, {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    // threshold: 0.6,
    distance: 10000,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys:[
      "title",
      "body"
    ]
  })

  return fuse
}

  