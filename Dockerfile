FROM nginx:stable-alpine
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY app.js /usr/share/nginx/html/js.css
COPY process.svg /usr/share/nginx/assets/process.svg
COPY qr-code.svg /usr/share/nginx/assets/qr-code.svg
