res.end()
res.send()
res.render()
res.json()

-----
RESTful API

CRUD
    C: POST
    R: GET
    U: PUT (PATCH)
    D: DELETE

-----

req.query  # query string
req.body   # 通常是表單資料

req.file
req.files

req.params # 路徑的參數
-----
url
/product/12

/:cateId/:productId

----------
fetch()
    GET: urlencoded (query string)
        來源: Form, Object

    POST: json, urlencoded, multipart
        來源: Form, Object