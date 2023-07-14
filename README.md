<h1 align="center">Backend - Primera práctica integradora</h1>

## 🛠️ Ejecución del proyecto

**Para la ejecución del proyecto se debe clonar el mismo y ejecutar el siguiente comando:**

`npm install`

**Luego de esto ejecutar:**

`npm start`

**o bien, pararse en la capeta "src" y ejecutar:**

`nodemon ./app.js`

## ⚙️ Configuración del proyecto:

**Recuerda crear tu propio archivo .env dentro de la carpeta src, en el que incluirás las variables necesarias para el funcionamiento. Las mismas serán:** 

- `{{MONGO_USER}}`: [Usuario de tu base de datos de mongoDB Atlas].

- `{{MONGO_PASS}}`: [Contraseña de tu base de datos de mongoDB Atlas].

## ⚒️ Testeo del proyecto:

### Puede visitar los siguientes enlaces para acceder a diferentes vistas:

- http://localhost:8080 
    **En esta página encontrará el listado de productos actuales cargados a la base de datos.**

- http://localhost:8080/realtimeproducts 
    **En esta página encontrará el listado de productos cargados a la base de datos actualizados en tiempo real.**

- http://localhost:8080/chat 
    **En esta página encontrará el listado de productos cargados a la base de datos actualizados en tiempo real.**

### Para las request, utilice el siguiente formato:

**El siguiente ejemplo muestra un POST, recuerde que podrá prescindir del campo "thumbnails" si así lo desea.**

![Postman request example](./public/assets/images/POST_example.png)

**Por último un ejemplo de un PUT, en el cual podrá actualizar tantos campos como considere necesario.**

![Postman request example](./public/assets/images/PUT_example.png)