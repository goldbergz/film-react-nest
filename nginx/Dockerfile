FROM nginx:1.27-alpine

COPY default.conf /etc/nginx/conf.d/default.conf

CMD ["sh", "-c", "until [ -f /usr/share/nginx/html/index.html ]; do sleep 0.2; done; exec nginx -g 'daemon off;'"]
