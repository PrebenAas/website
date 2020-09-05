FROM nginx:stable-alpine
COPY index.html /usr/share/nginx/html/index.html
COPY portfolio.html /usr/share/nginx/html/portfolio.html
COPY gridStick.html /usr/share/nginx/html/gridStick.html
COPY styles /usr/share/nginx/html/styles/
COPY JS /usr/share/nginx/html/JS/
RUN mkdir -p /usr/share/nginx/html/assets/
COPY assets/process.svg /usr/share/nginx/html/assets/process.svg
COPY assets/qr-code.svg /usr/share/nginx/html/assets/qr-code.svg
COPY assets/qr-code.svg /usr/share/nginx/html/assets/soprasterialogo.svg
