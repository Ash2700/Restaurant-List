const db=require('./models')
const users=db.Users
const {Sequelize} =require('sequelize')

async function testwhere(){
    const condition=Sequelize.Op
    const user=await users.findAll({
        attributes:['id','name','email'],
        where:{id:'1'},[condition.or]:[],
        raw:false
    })
    await console.log(user)
}

testwhere()