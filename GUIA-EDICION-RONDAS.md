# 📝 Guía Rápida - Editar Rondas

## 🎯 Orden de las Rondas

El sistema crea automáticamente 10 rondas en este orden:

1. **Ronda 1** - Normal
2. **Ronda 2** - Normal  
3. **Ronda 3** - Normal
4. **Ronda 4** - Normal
5. **Ronda 5** - **ESPECIAL** 🔽
6. **Ronda 6** - Normal
7. **Ronda 7** - Normal
8. **Ronda 8** - Normal
9. **Ronda 9** - Normal
10. **Ronda 10** - **ESPECIAL** 🔽

---

## ✏️ Cómo Editar una Ronda

### Desde el Panel de Admin

1. **Login** como administrador (`admin` / `cumpleaños2025`)
2. Encuentra la ronda que quieres editar
3. Click en el botón **"✏️ Editar"** (solo aparece en rondas pendientes)
4. Edita los campos que necesites
5. Click en **"💾 Guardar Cambios"**

---

## 📋 Campos Editables

### Rondas Normales 🔼

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Título** | Nombre de la ronda | "Ronda 1: Producto X" |
| **Descripción** | Información adicional | "Descripción del producto" |
| **Precio Mínimo** | Precio base de inicio | 100 |
| **Incremento Mínimo** | Cuánto debe subir cada puja | 50 |

### Rondas Especiales 🔽

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Título** | Nombre de la ronda | "Ronda 5: Producto Especial" |
| **Descripción** | Información adicional | "¡Precio descendente!" |
| **Precio Mínimo** | Precio más bajo posible | 100 |
| **Precio Inicial** | Precio de inicio (desciende) | 1000 |
| **Decremento** | Cuánto baja por segundo | 50 |

---

## 🔄 Proceso Completo

### 1. Inicializar Base de Datos (Solo una vez)

```bash
cd backend
rm database.sqlite  # Si existe
npm run init-db
```

Esto crea:
- ✅ 2 equipos con $10,000 cada uno
- ✅ 10 rondas en el orden correcto
- ✅ Muestra los tokens de acceso

### 2. Editar Rondas

1. Inicia el backend: `./start-backend.sh`
2. Abre el frontend en tu navegador
3. Login como admin
4. Edita cada ronda con:
   - Título descriptivo del producto/premio
   - Descripción detallada
   - Precios apropiados para tu evento

### 3. Durante el Evento

1. Inicia las rondas en orden con el botón **"▶️ Iniciar Ronda"**
2. Los equipos pujan automáticamente
3. Cierra la ronda cuando termine con **"⏹️ Cerrar Ronda"**

---

## 💡 Tips

### Precios Recomendados

**Rondas Normales:**
- Precio Mínimo: $100 - $500
- Incremento Mínimo: $50 - $100
- Los equipos tienen $10,000 en total

**Rondas Especiales:**
- Precio Inicial: $1,000 - $3,000
- Precio Mínimo: $100 - $300
- Decremento: $50 - $100 por segundo
- Duración aprox: 10-30 segundos

### Balancear el Juego

- Las primeras rondas: precios más bajos
- Rondas intermedias: precios medianos
- Últimas rondas: precios más altos
- Rondas especiales: más emocionantes, precios iniciales altos

---

## ⚠️ Importante

- ✅ Solo puedes editar rondas **pendientes** (no iniciadas)
- ✅ No puedes cambiar el tipo (normal ↔ especial) después de crear
- ✅ Guarda los cambios antes de iniciar la ronda
- ✅ Una vez iniciada, no se puede editar

---

## 🗑️ Eliminar una Ronda

Si necesitas eliminar una ronda pendiente, puedes hacerlo desde la API o creando un botón en el admin (actualmente no implementado en el UI).

Desde el backend:
```bash
# Eliminar ronda con ID 3 (ejemplo)
curl -X DELETE http://localhost:3001/api/rounds/3 \
  -H "Authorization: Bearer TU_TOKEN_ADMIN"
```

---

## 📝 Ejemplo de Rondas Editadas

```
1. Ronda 1: Cena para 2 ($200 min, +$50)
2. Ronda 2: Entrada de cine ($150 min, +$30)
3. Ronda 3: Botella de vino ($300 min, +$50)
4. Ronda 4: Gift card $500 ($400 min, +$100)
5. ESPECIAL: Tablet ($2000 → $200, -$100/s)
6. Ronda 6: Auriculares ($600 min, +$100)
7. Ronda 7: Reloj ($800 min, +$150)
8. Ronda 8: Laptop ($1500 min, +$200)
9. Ronda 9: TV 4K ($2000 min, +$300)
10. ESPECIAL: Viaje ($5000 → $500, -$200/s)
```

---

**¡Listo para personalizar tus rondas! 🎉**
