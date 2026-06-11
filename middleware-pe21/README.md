# PE-2.1: Configuración y primer servicio middleware con Node.js

## Pruebas de los escenarios

**a) Sin API key**
* **Comando:** `curl http://localhost:3000/health`
* **Salida real:** `{"error":"API key inválida o ausente"}`
* **Explicación:** El middleware de autenticación rechaza la petición con un código 401 porque no se incluyó el encabezado `x-api-key`.

**b) Con clave válida**
* **Comando:** `curl.exe -H "x-api-key: secreto-demo" http://localhost:3000/health`
* **Salida real:** `{"status":"ok","ts":"2026-06-11T20:36:26.545Z"}`
* **Explicación:** La petición incluye la clave correcta, por lo que el middleware permite el paso y el servidor responde con estado 200 y el timestamp actual.

**c) Ruta inexistente**
* **Comando:** `curl.exe -H "x-api-key: secreto-demo" http://localhost:3000/noexiste`
* **Salida real:** ```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /noexiste</pre>
</body>
</html>