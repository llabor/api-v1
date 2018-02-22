# Imagen raíz
FROM node
# Carpeta raíz
WORKDIR /apitechu
# Copia de archivos
ADD . /apitechu
# Instalo los paquetes necesarios
RUN npm install
# Volumen de la imagen
VOLUME ["/logs"]
# Puerto que expone
EXPOSE 3000
# Comando de iniciado
CMD ["npm", "start"]
