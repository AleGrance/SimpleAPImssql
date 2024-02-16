export default queries = {
    getAllProducts: "SELECT * FROM RECORDS",
    addNewProduct: "INSERT INTO PRODUCTO (nombre, descripcion, cantidad) VALUES (@name, @descri, @cantidad);"
}