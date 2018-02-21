# Imagen raíz
FROM node
# Carpeta raíz
WORKDIR /apitechu
# Copia de archivos
ADD . /apitechu
# Puerto que expone
EXPOSE 3000
# Comando de iniciado
CMD ["npm", "start"]
