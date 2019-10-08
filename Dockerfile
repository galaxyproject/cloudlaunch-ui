#########################
### build environment ###
### Ref: https://github.com/avatsaev/angular4-docker-example
### http://mherman.org/blog/2018/02/26/dockerizing-an-angular-app/#.WuLSdNNuaL4
#########################

# base image
FROM node:11.0.0 as builder

# set working directory
RUN mkdir /app
WORKDIR /app

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@1.7.1 --unsafe

# add app
COPY . /app

# Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build --prod --build-optimizer

##################
### production ###
##################

# base image
FROM nginx:1.13.9-alpine

# copy artifact build from the 'build environment'
COPY --from=builder /app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
