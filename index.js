const axios = require('axios');

const {wrapper} = require('axios-cookiejar-support');
const {CookieJar} = require('tough-cookie');

const baseURL = 'http://192.168.1.2:5000/webapi';

const jar = new CookieJar();
const client = wrapper(axios.create({jar, baseURL}));

axios.defaults.withCredentials = true;
client.defaults.withCredentials = true;
const fxParser = require('fast-xml-parser');
const parser = new fxParser.XMLParser();

const validCategories = ['1_2']

const username = 'sephiroth';
const password = 'Aerith77.'
const methods = [
    'SYNO.API.Auth',
    'SYNO.DownloadStation.Task'
];


const fetcher = axios.create({
    withCredentials: true,
});


const methodQueryURL = `/query.cgi?api=SYNO.API.Info&version=1&method=query&query=SYNO.API.Auth,SYNO.DownloadStation.Task`;

client.get(methodQueryURL).then(response => {

    const {success, data} = response.data;

    if (!success)
        throw ('Query Failed');

    const loginURL = `/${data['SYNO.API.Auth'].path}?api=SYNO.API.Auth&version=3&method=login&account=${username}&passwd=${password}&session=DownloadStation&format=cookie`
    const createURL = `/${data['SYNO.DownloadStation.Task'].path}?api=SYNO.DownloadStation.Task&version=3&method=create`;

    return {
        login: loginURL,
        create: createURL
    }

})
    .then(({login, create}) => {
        return client.get(login).then(response => {
            const sid = response.data.data.sid;
            console.log(sid);
            return client.get(`${create}&uri=https://www27.mejortorrent.eu/torrents/peliculas/Rose.Red.torrent&sid=${sid}`).then(response => {


                console.log(response.data);
            })
        })
    })
    .catch(console.error)

// axios.get('https://nyaa.land/?page=rss')
//     .then(response => {
//         const data = parser.parse(response.data);
//         const items = data.rss.channel.item
//             .filter(item => validCategories.includes(item['nyaa:categoryId']))
//             .slice(0, 1);
//
//         Promise.all(items.map(item => {
//             return axios.get(`${targetURL}&uri=${item.link}`)
//                 .then(response => {
//                     console.log(response);
//                     return response;
//                 })
//         }))
//
//         console.log(items.length);
//     })
//     .catch(console.error)