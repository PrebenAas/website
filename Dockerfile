FROM nginx:stable-alpine
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY app.js /usr/share/nginx/html/app.js
RUN mkdir -p /usr/share/nginx/html/assets/
COPY assets/process.svg /usr/share/nginx/html/assets/process.svg
COPY assets/qr-code.svg /usr/share/nginx/html/assets/qr-code.svg
COPY assets/qr-code.svg /usr/share/nginx/html/assets/soprasterialogo.svg
