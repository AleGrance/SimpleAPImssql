export default queries = {
    getAllProducts: "SELECT * FROM REGISTROS",
    addNewProduct: "INSERT INTO PRODUCTO (nombre, descripcion, cantidad) VALUES (@name, @descri, @cantidad);"
}