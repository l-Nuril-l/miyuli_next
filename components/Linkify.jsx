import he from 'he';
import DOMPurify from "isomorphic-dompurify";
const Linkify = ({ children }) => {
    const isUrl = word => {
        const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
        return word.match(urlPattern)
    }

    const addMarkup = word => {
        return isUrl(word) ?
            `<a href="${word}">${word}</a>` :
            word
    }

    const words = he.encode(children).replaceAll('\n', '<br>').split(' ')
    const formatedWords = words.map((w, i) => addMarkup(w))
    const html = DOMPurify.sanitize(formatedWords.join(' '))
    return (<span dangerouslySetInnerHTML={{ __html: html }} />)
}

export default Linkify;