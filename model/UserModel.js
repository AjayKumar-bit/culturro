const neo4j=require('neo4j-driver')

require('dotenv').config()

const status=false;
const url=process.env.dbUrl
const username=process.env.dbUsername
const password=process.env.dbPassword

const driver = neo4j.driver(url, neo4j.auth.basic(username
,password ),{ disableLosslessIntegers: true });
const session = driver.session()

// const userExistsByEmail=async(user)=>{
//      const result = await driver.executeQuery(`MATCH(N:User) WHERE N.email= '${user.email}' RETURN N`)
//      const exists=!result.records.length
//      return !exists
// }

const getUserByEmail=async(email)=>{
    try {
        const result = await driver.executeQuery(`MATCH(N:User) WHERE N.email= '${email}' RETURN N`)
        const usernotfound=!result.records.length
        if(usernotfound){
           return {response:"User does not exists",status}
        } 
        else{
            
           const response=result.records[0].get('N').properties
           const id=result.records[0].get('N').elementId
           return {response,id,status:true}
        }
    } catch (error) {
        return {status:status,error}
    }
     
}

const createUser=async(user)=>{
    try {
            // if(await userExistsByEmail(user)){
            //     return {response:"user already exits",status}
            // }
            const result = await session.run(`CREATE (N:User {name: '${user.name}',email:'${user.email}',password:'${user.password}'}) RETURN N LIMIT 1`)
            const response=result.records[0].get('N').elementId
            console.log(response)
            return {response,status:true}
        }
     catch (error) {
        return {status:status,error}
    }
}

// const findById=async(id)=>{
//     try {
//         const result=await driver.executeQuery(MATCH(N:User) WHERE id(N)=${id} RETURN N)
//         const response=result.records[0].get('N').properties
//         return {response,status:true}
//     } catch (error) {
//         return {status:status,error}
//     }
// }


module.exports={createUser,getUserByEmail}