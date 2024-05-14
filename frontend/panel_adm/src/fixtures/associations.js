import fixture from 'can-fixture'

let images = [
    {id: 1, url: "https://yt3.googleusercontent.com/cOzPj17JbobUiEmTVMe2jmNPuy5LOExELFWjx8eIOlgK__wStz5hWIRzqivRsGiz-Lot-0XR=s900-c-k-c0x00ffffff-no-rj"},
    {id: 2, url: "https://bdekraken.fr/assets/kraken.png"}
]

let associations = [
    {id: 1, name: "EPTV", description: "Ceci est une description.", location: "VJ", logo: images[0]},
    {id: 2, name: "Kraken", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.", location: "KB", logo: images[1]}
]

fixture('GET /api/associations', () => {
    return associations;
})

fixture('POST /api/associations', (request, response) => {
    let newAsso = request.data
    newAsso.id = associations[associations.length - 1].id + 1
    const index = images.findIndex((image) => image.id === newAsso.logo)
    if (index !== -1) {
        newAsso.logo = images[index];
    }
    associations.push(newAsso);
    response(201)
})

fixture('POST /api/images', () => {
    const nextId = images[images.length - 1].id + 1
    images.push({id: nextId, url: "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg"})
    return images[images.length - 1];
})

export default fixture
