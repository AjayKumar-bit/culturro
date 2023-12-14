const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const neo4j = require("neo4j-driver"); 

const url=process.env.dbUrl
const username=process.env.dbUsername
const password=process.env.dbPassword

const driver = neo4j.driver(url, neo4j.auth.basic(username,password ),{ disableLosslessIntegers: true });

const session = driver.session(); 

const getAllBook = async () => {
    const result = await session.run(`MATCH (n) RETURN n`);
    return result.records.map(record => record.get('n').properties);
}

const getBookByName = async (name) => {
    const result = await session.run(`MATCH (n) WHERE n.name ='${name}' RETURN n`);
    // return result.records[0].properties;
    return result.records.map(record => record.get('n').properties)
}

const addBook = async (book) => {
    const result = await session.run(`CREATE(var:BOOK:${book.category} {author:'${book.author}',category:'${book.category}',discount:'${book.discount}%',name:'${book.name}',published:'${book.published}',price:'${book.price}Rs.',description:'${book.description}'}) RETURN var`);
    // return result.records[0].properties;
    return await getAllBook();
}   

const editBookDetails = async (bookName,author,book) => {
    await session.run(`MATCH (var) WHERE var.name='${bookName}' AND var.author='${author}'  SET var.author='${book.author}',var.category='${book.category}',var.discount='${book.discount}%',var.name='${book.name}',var.published='${book.published}',price:'${book.price}Rs.' RETURN var`);
    return await getAllBook();
    // return result.records[0].properties;
}

const deleteBook = async (bookName,author,published) => {
    await session.run(`MATCH (var) WHERE var.name='${bookName}' AND var.author='${author}'  AND var.published="${published}" DELETE var`);
    return await getAllBook();
}    
    


const tokenData = async (userDetails,res) => {
    // getting all data
    const { name, email, password } = userDetails;

    // checking that we got all data
    if (!(name && email && password)) {
        res.status(400).send('data is missing');
    }

    // checking for existing data
    const exists = await session.run(`MATCH (var:User) WHERE var.name='${name}' AND var.email='${email}' AND var.password='${password}' RETURN var`);
    console.log(exists.records,11111)
    if (exists.records.length>0) {

        res.send('user already exists');
        return
    }

    const encPass = await bcrypt.hash(password, 10);
    const result = await session.run(`CREATE (var:User {name:'${name}', email:'${email}', password:'${encPass}'}) RETURN var`);

    console.log(result);
    const id = result.records[0].get('var').identity;
    const token = jwt.sign({ name, email }, "secretpass");
    console.log(token, id);
    return { id, token };
};

module.exports = { getAllBook ,getBookByName,addBook,editBookDetails,deleteBook,tokenData};
