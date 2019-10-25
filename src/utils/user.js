const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data, 
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }
    // check for existing user 
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    // Validate username
    if (existingUser) {
        return {
            error: 'User name is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    // Above could aslo be written as 
    // const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    // V1 const thisUser = users.find((user) => { 
    // V1     return user.id === id
    // V1 })
    // V1 return { thisUser }
    // V2 return users.find((user) => {
    // V2     return user.id === id
    // V2 })
    return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
    // V1    const theseUsers = users.filter((user) => { return user.room === room.trim().toLowerCase() })
    // V1    return theseUsers
    // V2    const theseUsers = users.filter(user => user.room === room.trim().toLowerCase())
    // V2    return theseUsers
    return users.filter(user => user.room === room.trim().toLowerCase())  //V3
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// TESTING 
// const res1 = addUser({
//     id: 22,
//     username: 'Peter  ',
//     room: 'Room 101'
// })
// console.log(res1)

// const res2 = addUser({
//     id: 23,
//     username: 'Sarah',
//     room: 'Room 101'
// })
// console.log(res2)

// const res3 = addUser({
//     id: 41,
//     username: 'Peter  ',
//     room: 'Room 102'
// })
// console.log(res3)
// console.log(users)
// const foundUser = getUser(41)
// console.log('found user 41', foundUser)
// var findRoom = 'Room 101'
// var foundUsersInRoom = getUsersInRoom(findRoom)
// console.log('found Users in', findRoom, foundUsersInRoom)
// findRoom = 'Room 102'
// foundUsersInRoom = getUsersInRoom(findRoom)
// console.log('found Users in', findRoom, foundUsersInRoom)
// findRoom = 'Room 103'
// foundUsersInRoom = getUsersInRoom(findRoom)
// console.log('found Users in', findRoom, foundUsersInRoom)
// var removedUser = removeUser(22)
// console.log(removedUser)
// console.log(users)
// removedUser = removeUser(23)
// console.log(removedUser)
// console.log(users)
// removedUser = removeUser(41)
// console.log(removedUser)
// console.log(users)