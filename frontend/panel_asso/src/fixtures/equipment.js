import fixture from 'can-fixture'

const assos = [
    {id: 1, name: "BDE", logo: "/images/kraken.png", description: "", location: "KB"},
    {id: 2, name: "VJN", logo: "/images/vjn.png", description: "", location: "KB"},
    {id: 3, name: "EPTV", logo: "/images/eptv.jpg", description: "", location: "KB"},
]

const users = [
    {id: "fnbzfte", login: "john.doe", email: "john.doe@epita.fr", name: "John",
        lastName: "Doe", school: "EPITECH", isAdmin: false},
    {id: "regrrreg", login: "celian.cusey", email: "celian.cusey@epita.fr", name: "Célian",
        lastName: "Cusey", school: "EPITA", isAdmin: false},
    {id: "ezferttrg", login: "vincent1.barbier", email: "vincent1.barbier@epita.fr", name: "Vincent",
        lastName: "Barbier", school: "EPITA", isAdmin: false},
    {id: "rgtezezf", login: "nathan.lenogue", email: "nathan.lenogue@epita.fr", name: "Nathan",
        lastName: "Lenogue", school: "EPITA", isAdmin: false},
    {id: "rgrefeaa", login: "mathis.brahim", email: "mathis.brahim@epita.fr", name: "Mathis",
        lastName: "Brahim", school: "EPITA", isAdmin: false},
]

let equipmentRequests = [
    {id: 1, equipmentId: 2, equipmentName: 'Enceinte', userRespoOwner: users[0], assoBorrower: assos[1],
        userRespoBorrower: users[2], borrowingDate: 1717236000, dueDate: 1717840800, status: 'accepted',
        comment: 'C\'est bon pour nous, n\'oubliez pas de la nettoyer avant de la rendre.'},
    {id: 2, equipmentId: 7, equipmentName: 'Multi-prise', userRespoOwner: users[2], assoBorrower: assos[2],
        userRespoBorrower: users[4], borrowingDate: 1717495200, dueDate: 1718013600, status: 'accepted', comment: ''},
    {id: 7, equipmentId: 6, equipmentName: 'Multi-prise', userRespoOwner: users[2], assoBorrower: assos[2],
        userRespoBorrower: users[4], borrowingDate: 1717495200, dueDate: 1718013600, status: 'accepted', comment: ''},
    {id: 3, equipmentId: 11, equipmentName: 'Projecteur', userRespoOwner: users[4], assoBorrower: assos[0],
        userRespoBorrower: users[3], borrowingDate: 1717495200, dueDate: 1718186400, status: 'accepted', comment: ''},
    {id: 4, equipmentId: 4, equipmentName: 'Bar', userRespoOwner: users[0], assoBorrower: assos[2],
        userRespoBorrower: users[4], borrowingDate: 1717236000, dueDate: 1717840800, status: 'refused',
        comment: 'Nous en avons besoin pour notre événement au même moment désolé.'},
    {id: 5, equipmentId: 3, equipmentName: 'Ecocup WEI', userRespoOwner: users[0], assoBorrower: assos[2],
        userRespoBorrower: users[4], borrowingDate: 1717257600, dueDate: 1717344000, status: 'accepted',
        comment: ''},
    {id: 6, equipmentId: 3, equipmentName: 'Ecocup WEI', userRespoOwner: null, assoBorrower: assos[1],
        userRespoBorrower: users[2], borrowingDate: 1718035200, dueDate: 1718208000, status: 'waiting', comment: ''},
    {id: 8, equipmentId: 9, equipmentName: 'Crêpière grise', userRespoOwner: users[1], assoBorrower: assos[0],
        userRespoBorrower: users[3], borrowingDate: 1718035200, dueDate: 1719266400, status: 'accepted', comment: 'Rendez la propre svp c:'},
]

let equipment = [
    {id: 1, name: "Talkie Walkie", assoOwner: assos[0], quantity: 15, equipmentRequest: null, photo: ''},
    {id: 2, name: "Enceinte", assoOwner: assos[0], quantity: 1, equipmentRequest: equipmentRequests[0], photo: 'https://proxymedia.woopic.com/api/v1/images/1618%2Fedithor%2Faccessoires%2F504x504-LD0005793816_1_624ed828be29591e39e9ab10.png?format=504x504&saveas=webp&saveasquality=80'},
    {id: 3, name: "Ecocup WEI", assoOwner: assos[0], quantity: 200, equipmentRequest: null, photo: ''},
    {id: 4, name: "Bar", assoOwner: assos[0], quantity: 3, equipmentRequest: null, photo: ''},
    {id: 5, name: "Enrouleur", assoOwner: assos[1], quantity: 1, equipmentRequest: null, photo: ''},
    {id: 6, name: "Multi-prise", assoOwner: assos[1], quantity: 1, equipmentRequest: equipmentRequests[2], photo: 'https://content.pearl.fr/media/cache/default/article_ultralarge_high_nocrop/shared/images/articles/K/KT8/multiprise-avec-3-prises-230-v-et-interrupteur-blanc-ref_KT8583_1.jpg'},
    {id: 7, name: "Multi-prise", assoOwner: assos[1], quantity: 1, equipmentRequest: equipmentRequests[1], photo: 'https://content.pearl.fr/media/cache/default/article_ultralarge_high_nocrop/shared/images/articles/K/KT8/multiprise-avec-3-prises-230-v-et-interrupteur-blanc-ref_KT8583_1.jpg'},
    {id: 8, name: "Friteuse", assoOwner: assos[1], quantity: 1, equipmentRequest: null, photo: ''},
    {id: 14, name: "Gauffrière", assoOwner: assos[1], quantity: 1, equipmentRequest: null, photo: ''},
    {id: 15, name: "Glacière", assoOwner: assos[1], quantity: 1, equipmentRequest: null, photo: ''},
    {id: 9, name: "Crêpière grise", assoOwner: assos[1], quantity: 1, equipmentRequest: equipmentRequests[7], photo: ''},
    {id: 10, name: "Crêpière verte n1", assoOwner: assos[1], quantity: 1, equipmentRequest: null, photo: ''},
    {id: 11, name: "Crêpière verte n2", assoOwner: assos[1], quantity: 1, equipmentRequest: null, photo: ''},
    {id: 12, name: "Projecteur", assoOwner: assos[2], quantity: 1, equipmentRequest: equipmentRequests[3], photo: ''},
    {id: 13, name: "Fond vert", assoOwner: assos[2], quantity: 1, equipmentRequest: null, photo: ''},
]

fixture('GET /api/equipment', () => {
    return equipment;
})

fixture('POST /api/equipment', (request, response) => {
    let newEquipment = request.data
    newEquipment.id = equipment[equipment.length - 1].id + 1
    newEquipment.assoBorrower = null;
    newEquipment.borrowingDate = 0;
    newEquipment.dueDate = 0;
    newEquipment.userRespoOwner = {id: "regrrreg", login: "celian.cusey", email: "celian.cusey@epita.fr", name: "Célian",
        lastName: "Cusey", school: "EPITA", isAdmin: false};
    newEquipment.userRespoBorrower = null;
    equipment.push(newEquipment)
    response(201)
})

fixture('PUT /api/equipment/{id}', (request, response) => {
    const id = parseInt(request.data.id)
    const index = equipment.findIndex((item) => item.id === id)
    if (index !== -1) {
        let newEquipment = request.data
        newEquipment.assoOwner = equipment[index].assoOwner;
        newEquipment.equipmentRequest = equipment[index].equipmentRequest;
        equipment.splice(index, 1, newEquipment)
    }
    response(204)
})

fixture('POST /api/equipment/{id}/retrieve', (request, response) => {
    const id = parseInt(request.data.id);
    const index = equipment.findIndex((item) => item.id === id)
    if (index !== -1) {
        let newEquipment = equipment[index];
        newEquipment.equipmentRequest = null;
        equipment.splice(index, 1, newEquipment)
    }
    response(200)
})

fixture('POST /api/equipment/{equipmentId}/borrow', (request, response) => {
    const id = parseInt(request.data.equipmentId);
    const index = equipment.findIndex((item) => item.id === id)
    if (index !== -1) {
        const currEquipment = equipment[index];
        let newEquipmentRequest = request.data;
        newEquipmentRequest.id = equipmentRequests[equipmentRequests.length - 1].id + 1
        newEquipmentRequest.equipmentName = currEquipment.name;
        newEquipmentRequest.userRespoOwner = null;
        newEquipmentRequest.userRespoBorrower = {id: "regrrreg", login: "celian.cusey", email: "celian.cusey@epita.fr", name: "Célian",
            lastName: "Cusey", school: "EPITA", isAdmin: false} // Dans le backend, prendre le user qui fait la request
        newEquipmentRequest.status = 'waiting';
        newEquipmentRequest.comment = '';
        equipmentRequests.push(newEquipmentRequest);
    }
    response(200)
})

fixture('DELETE /api/equipment/{id}', (request) => {
    const id = parseInt(request.data.id)
    equipment = equipment.filter((e) => e.id !== id)
    response(204)
})

fixture('POST /api/equipment/{id}/invalid-dates', (request) => {
    // Récupère les dates auxquelles le matériel est déjà emprunté (demandes acceptées seulement)
    const id = parseInt(request.data.id);
    return equipmentRequests.filter(req => req.equipmentId === id && req.status === 'accepted')
        .map(req => [req.borrowingDate, req.dueDate])
})

fixture('POST /api/equipment/requests/received', (request) => {
    const newEquipmentRequestList = [];
    for (const equipmentRequest of equipmentRequests) {
        const currEquipment = equipment.find(eq => eq.id === equipmentRequest.equipmentId);
        if (!currEquipment) continue;
        const { assoId } = request.data;
        if (currEquipment.assoOwner.id === assoId) {
            newEquipmentRequestList.push(equipmentRequest);
        }
    }
    return newEquipmentRequestList;
})

fixture('POST /api/equipment/requests/sent', (request) => {
    const { assoId } = request.data;
    return equipmentRequests.filter(req => req.assoBorrower.id === assoId);
})

fixture('POST /api/equipment/requests/{id}/accept', (request, response) => {
    const currUser = {id: "regrrreg", login: "celian.cusey", email: "celian.cusey@epita.fr", name: "Célian",
        lastName: "Cusey", school: "EPITA", isAdmin: false} // Dans le backend, prendre le user qui fait la request
    const { id, comment } = request.data;
    const idParsed = parseInt(id);
    const indexEquipmentRequest = equipmentRequests.findIndex((item) => item.id === idParsed);
    if (indexEquipmentRequest !== -1) {
        let equipmentRequest = equipmentRequests[indexEquipmentRequest];
        const indexEquipment = equipment.findIndex((item) => item.id === equipmentRequest.equipmentId);
        if (indexEquipment !== -1) {
            let currEquipment = equipment[indexEquipment];
            equipmentRequest.userRespoOwner = currUser;
            equipmentRequest.status = 'accepted';
            equipmentRequest.comment = comment;
            equipmentRequests.splice(indexEquipmentRequest, 1, equipmentRequest)
            currEquipment.equipmentRequest = equipmentRequest;
            equipment.splice(indexEquipment, 1, currEquipment);
        }
    }
    response(204)
})

fixture('POST /api/equipment/requests/{id}/refuse', (request, response) => {
    const currUser = {id: "regrrreg", login: "celian.cusey", email: "celian.cusey@epita.fr", name: "Célian",
        lastName: "Cusey", school: "EPITA", isAdmin: false} // Dans le backend, prendre le user qui fait la request
    const { id, comment } = request.data;
    const idParsed = parseInt(id);
    const indexEquipmentRequest = equipmentRequests.findIndex((item) => item.id === idParsed);
    if (indexEquipmentRequest !== -1) {
        let equipmentRequest = equipmentRequests[indexEquipmentRequest];
        equipmentRequest.userRespoOwner = currUser;
        equipmentRequest.status = 'refused';
        equipmentRequest.comment = comment;
        equipmentRequests.splice(indexEquipmentRequest, 1, equipmentRequest)
    }
    response(204)
})

export default fixture
