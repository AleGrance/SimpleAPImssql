export default queries = {
    getAllProducts: "SELECT * FROM PRODUCTO",
    addNewProduct: "INSERT INTO PRODUCTO (nombre, descripcion, cantidad) VALUES (@name, @descri, @cantidad);"
}