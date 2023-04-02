const {JSDOM} = require('jsdom')

async function crawlPage(baseURL, currentURL, pages){
    // if this is an offsite URL, exit
    const currentUrlObj = new URL(currentURL)
    const baseUrlObj = new URL(baseURL)
    if (currentUrlObj.hostname !== baseUrlObj.hostname){
      return pages
    }

    const normalizedURL = normalizeURL(currentURL)

  // if already visited, increase count
  if (pages[normalizedURL] > 0){
    pages[normalizedURL]++
    return pages
  }

  pages[normalizedURL] = 1


//fetch and parse the html
console.log(`crawling ${currentURL}`)
let htmlBody = ''
try {
  const resp = await fetch(currentURL)
  if (resp.status > 399){
    console.log(`Got HTTP error, status code: ${resp.status}`)
    return pages
  }
  const contentType = resp.headers.get('content-type')
  if (!contentType.includes('text/html')){
    console.log(`Got non-html response: ${contentType}`)
    return pages
  }
  htmlBody = await resp.text()
} catch (err){
  console.log(err.message)
}

const nextURLs = getURLsFromHTML(htmlBody, baseURL)
for (const nextURL of nextURLs){
  pages = await crawlPage(baseURL, nextURL, pages)
}

return pages
}


function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const aElements = dom.window.document.querySelectorAll('a')
    for (const aElement of aElements){
      if (aElement.href.slice(0,1) === '/'){
        try {
          urls.push(new URL(aElement.href, baseURL).href)
        } catch (err){
          console.log(`${err.message}: ${aElement.href}`)
        }
      } else {
        try {
          urls.push(new URL(aElement.href).href)
        } catch (err){
          console.log(`${err.message}: ${aElement.href}`)
        }
      }
    }
    return urls
  }

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = {
    crawlPage,
    normalizeURL,
    getURLsFromHTML
}