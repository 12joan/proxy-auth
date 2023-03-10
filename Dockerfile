FROM nginx:latest
COPY nginx.conf /nginx.conf.template
EXPOSE 80
CMD ["/bin/sh" , "-c" , "envsubst '$TOKEN $UPSTREAM' < /nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
