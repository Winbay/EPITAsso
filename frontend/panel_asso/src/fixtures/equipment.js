import fixture from 'can-fixture'

const assos = [
    {id: 1, name: "EPTV", logo: "/images/eptv.jpg", description: "", location: "KB"},
    {id: 2, name: "Kraken", logo: "https://cdn.helloasso.com/img/logos/croppedimage-ee3265134a9e40a1bfb002d341feee5c.png", description: "", location: "KB"},
    {id: 3, name: "Cristal", logo: "https://www.cristal.je/wp-content/uploads/2021/03/cropped-logo-colored-short-512.png",
        description: "", location: "KB"}
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
    {id: 1, equipmentId: 2, equipmentName: 'Machine à café', userRespoOwner: users[0], assoBorrower: assos[1],
        userRespoBorrower: users[2], borrowingDate: 1717236000, dueDate: 1717840800, status: 'accepted',
        comment: 'C\'est bon pour nous, n\'oubliez pas de la nettoyer avant de la rendre.'},
    {id: 2, equipmentId: 7, equipmentName: 'Multi-prise', userRespoOwner: users[2], assoBorrower: assos[2],
        userRespoBorrower: users[4], borrowingDate: 1717495200, dueDate: 1718013600, status: 'accepted', comment: ''},
    {id: 3, equipmentId: 11, equipmentName: 'Projecteur', userRespoOwner: users[4], assoBorrower: assos[0],
        userRespoBorrower: users[3], borrowingDate: 1717495200, dueDate: 1718186400, status: 'accepted', comment: ''},
    {id: 4, equipmentId: 4, equipmentName: 'Tables', userRespoOwner: users[0], assoBorrower: assos[2],
        userRespoBorrower: users[4], borrowingDate: 1717236000, dueDate: 1717840800, status: 'refused',
        comment: 'Impossible de prêter aussi longtemps, nous en avons aussi souvent besoin.'},
    {id: 5, equipmentId: 3, equipmentName: 'Verres', userRespoOwner: users[0], assoBorrower: assos[2],
        userRespoBorrower: users[4], borrowingDate: 1717257600, dueDate: 1717344000, status: 'accepted',
        comment: ''},
    {id: 6, equipmentId: 3, equipmentName: 'Verres', userRespoOwner: null, assoBorrower: assos[1],
        userRespoBorrower: users[2], borrowingDate: 1718035200, dueDate: 1718208000, status: 'waiting', comment: ''},
]

let equipment = [
    {id: 1, name: "Machine à café", assoOwner: assos[0], quantity: 1, equipmentRequest: null},
    {id: 2, name: "Machine à café", assoOwner: assos[0], quantity: 1, equipmentRequest: equipmentRequests[0]},
    {id: 3, name: "Verres", assoOwner: assos[0], quantity: 50, equipmentRequest: null},
    {id: 4, name: "Tables", assoOwner: assos[0], quantity: 4, equipmentRequest: null},
    {id: 5, name: "Rallonge", assoOwner: assos[1], quantity: 1, equipmentRequest: null},
    {id: 6, name: "Multi-prise", assoOwner: assos[1], quantity: 1, equipmentRequest: null},
    {id: 7, name: "Multi-prise", assoOwner: assos[1], quantity: 1, equipmentRequest: equipmentRequests[1]},
    {id: 8, name: "Friteuse bleu", assoOwner: assos[1], quantity: 1, equipmentRequest: null},
    {id: 9, name: "Crêpière verte", assoOwner: assos[1], quantity: 1, equipmentRequest: null},
    {id: 10, name: "Crêpière grise", assoOwner: assos[1], quantity: 1, equipmentRequest: null},
    {id: 11, name: "Projecteur", assoOwner: assos[2], quantity: 1, equipmentRequest: equipmentRequests[2]},
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

fixture('DELETE /api/equipment/{id}', (request, response) => {
    const id = parseInt(request.data.id)
    equipment = equipment.filter((e) => e.id !== id)
    response(204)
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
